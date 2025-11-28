import React, { useState, useEffect, useMemo } from 'react';
import { 
    SafeAreaView, 
    ScrollView, 
    StyleSheet, 
    Text, 
    View, 
    Pressable,
    Alert,
    ActivityIndicator,
    Linking 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from './supabase'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; // NOVO IMPORT

// Chaves para carregar o plano de rota
const ASYNC_STORAGE_ROUTE_KEY = '@rotaOtimizadaPlano'; 
const ASYNC_STORAGE_CURRENT_INDEX = '@rotaIndexAtual';

export default function ExecucaoScreen() {
    const [darkMode, setDarkMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [planoRota, setPlanoRota] = useState([]); // A Rota Otimizada (Ex: ['A', 'D', 'C', 'E', 'A'])
    const [currentIndex, setCurrentIndex] = useState(0); // Onde estamos na rota (índice)
    const [coordenadasPontos, setCoordenadasPontos] = useState({}); // Coordenadas do DB

    const tema = darkMode ? darkTheme : lightTheme;

    // EFEITO PARA CARREGAR DADOS NA MONTAGEM: Rota e Coordenadas
    useEffect(() => {
        async function loadData() {
            setLoading(true);
            try {
                // 1. Carregar Coordenadas
                const { data: coordData, error: coordError } = await supabase
                    .from('coordenadas_pontos')
                    .select('ponto, latitude, longitude');
                
                if (coordError) throw coordError;

                const coordsMap = {};
                coordData.forEach(item => {
                    coordsMap[item.ponto] = { lat: item.latitude, lon: item.longitude };
                });
                setCoordenadasPontos(coordsMap);

                // 2. Carregar Plano de Rota Salvo (do PlanejarRotaScreen)
                const rotaJson = await AsyncStorage.getItem(ASYNC_STORAGE_ROUTE_KEY);
                const rotaSalva = rotaJson ? JSON.parse(rotaJson) : [];
                setPlanoRota(rotaSalva);

                // 3. Carregar Índice Atual (Onde o motorista parou da última vez)
                const indexSalvo = await AsyncStorage.getItem(ASYNC_STORAGE_CURRENT_INDEX);
                // Garante que o índice não exceda o tamanho da rota
                const initialIndex = indexSalvo ? parseInt(indexSalvo, 10) : 0;
                setCurrentIndex(initialIndex);

            } catch (error) {
                console.error('Erro ao carregar dados de execução:', error.message);
                Alert.alert("Erro", "Não foi possível carregar a rota de execução.");
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    // Calcula a próxima parada e o status
    const isRouteComplete = planoRota.length > 0 && currentIndex >= planoRota.length - 1;
    const currentPointKey = planoRota[currentIndex];
    const nextPointKey = planoRota[currentIndex + 1];


    // FUNÇÃO DE REGISTRO E AVANÇO
    const handleColetar = async () => {
        if (isRouteComplete) {
            Alert.alert("Rota Concluída!", "Você já completou todos os pontos da rota.");
            return;
        }

        setLoading(true);
        try {
            const pontoAtual = planoRota[currentIndex];

            // 1. REGISTRA A CONCLUSÃO no DB
            const { error: dbError } = await supabase
                .from('rotas_realizadas')
                .insert({
                    ponto_coleta: pontoAtual,
                    status: 'CONCLUIDO',
                    observacoes: "Registro automático via aplicativo móvel.",
                });

            if (dbError) throw dbError;

            // 2. AVANÇA O ÍNDICE
            const novoIndex = currentIndex + 1;
            await AsyncStorage.setItem(ASYNC_STORAGE_CURRENT_INDEX, novoIndex.toString());
            
            // Atualiza o estado local
            setCurrentIndex(novoIndex);
            
            Alert.alert("Sucesso!", `Coleta no Ponto ${pontoAtual} registrada. Próximo ponto: ${planoRota[novoIndex] || 'Fim'}.`);
            
        } catch (error) {
            console.error('Erro ao registrar coleta ou avançar:', error.message);
            Alert.alert("Erro", "Não foi possível registrar a coleta.");
        } finally {
            setLoading(false);
        }
    };

    // FUNÇÃO DE NAVEGAÇÃO EXTERNA (Deep Link)
    const handleNavigate = () => {
        if (!nextPointKey || !coordenadasPontos[nextPointKey]) {
            Alert.alert("Erro", "Coordenadas do próximo ponto não encontradas.");
            return;
        }
        const { lat, lon } = coordenadasPontos[nextPointKey];
        // Formato para abrir o Google Maps/Waze: latitude,longitude
        const url = `http://maps.google.com/maps?daddr=${lat},${lon}`;
        Linking.openURL(url);
    };

    if (loading || planoRota.length === 0) {
        return (
            <SafeAreaView style={[styles.safe, { backgroundColor: tema.bg, justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={tema.icon} />
                <Text style={{ color: tema.subtext, marginTop: 10 }}>
                    {loading ? "Preparando plano de execução..." : "Nenhum plano de rota calculado. Vá para a aba 'Rota'."}
                </Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: tema.bg }]}>
             <ScrollView contentContainerStyle={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={[styles.screenTitle, { color: tema.text }]}>Execução da Coleta</Text>
                    <Pressable onPress={() => setDarkMode(v => !v)}>
                        <Ionicons name={darkMode ? 'moon' : 'sunny'} size={24} color={tema.icon} />
                    </Pressable>
                </View>

                {isRouteComplete ? (
                    <View style={[styles.card, { backgroundColor: '#d4edda', borderColor: '#c3e6cb' }]}>
                        <Text style={[styles.pontoText, { color: '#155724' }]}>ROTA CONCLUÍDA!</Text>
                        <Text style={[styles.detailText, { color: '#155724', textAlign: 'center' }]}>
                            Todos os {planoRota.length} pontos foram visitados e registrados.
                        </Text>
                    </View>
                ) : (
                    <>
                        <View style={[styles.card, { backgroundColor: tema.card, borderColor: tema.border }]}>
                            <Text style={[styles.cardTitle, { color: tema.text }]}>Ponto Atual:</Text>
                            <Text style={[styles.pontoText, { color: tema.accent }]}>{currentPointKey}</Text>
                            <Text style={[styles.detailText, { color: tema.subtext, textAlign: 'center' }]}>
                                {nextPointKey ? `Próximo Ponto: ${nextPointKey}` : 'Última Parada.'}
                            </Text>

                            <Pressable onPress={handleNavigate} style={styles.navigateButton}>
                                <Ionicons name="navigate-outline" size={20} color="#fff" />
                                <Text style={styles.navigateButtonText}>Navegar para {nextPointKey || currentPointKey}...</Text>
                            </Pressable>
                        </View>
                        
                        <Pressable onPress={handleColetar} disabled={loading} style={styles.coletarButton}>
                            <Text style={styles.buttonText}>
                                {loading ? <ActivityIndicator color="#fff" /> : `COLETAR LIXO em ${currentPointKey}`}
                            </Text>
                        </Pressable>
                    </>
                )}

                {/* Histórico/Instruções da Rota (Exibe a rota completa para referência) */}
                <View style={{ marginTop: 20, width: '100%' }}>
                    <Text style={[styles.cardTitle, { color: tema.text }]}>Plano de Rota ({planoRota.length} pontos):</Text>
                    {planoRota.map((ponto, index) => (
                        <Text 
                            key={index} 
                            style={[
                                styles.detailText, 
                                { color: index === currentIndex ? tema.accent : tema.subtext, fontWeight: index === currentIndex ? '700' : '400' }
                            ]}
                        >
                            {index + 1}. {ponto} {index === currentIndex && '← ATUAL'}
                        </Text>
                    ))}
                </View>
                
             </ScrollView>
        </SafeAreaView>
    );
}

// Temas
const lightTheme = {
  bg: '#f5f6fa', card: '#ffffff', text: '#2f3640', subtext: '#636e72', border: '#dfe6e9', icon: '#0097e6', accent: '#0097e6', 
};
const darkTheme = {
  bg: '#1e272e', card: '#2f3640', text: '#f5f6fa', subtext: '#b2bec3', border: '#3d3d3d', icon: '#ffd32a', accent: '#00c6ff', 
};

// Estilos
const styles = StyleSheet.create({
    safe: { flex: 1 },
    container: { padding: 20, alignItems: 'center' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 20 },
    screenTitle: { fontSize: 20, fontWeight: '700' },

    card: { width: '100%', borderRadius: 12, borderWidth: 1, padding: 15, marginBottom: 20, shadowOpacity: 0.05, shadowRadius: 5, elevation: 3 },
    cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 5 },
    pontoText: { fontSize: 48, fontWeight: '900', textAlign: 'center', marginVertical: 10 },
    detailText: { fontSize: 14, marginBottom: 4 },

    coletarButton: {
        width: '100%',
        backgroundColor: '#2ecc71', // Verde de sucesso
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '700',
    },
    navigateButton: {
        flexDirection: 'row',
        backgroundColor: '#0097e6',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    navigateButtonText: {
        color: 'white',
        marginLeft: 8,
        fontWeight: '600',
    }
});