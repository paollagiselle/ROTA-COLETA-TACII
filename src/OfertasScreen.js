import React, { useState, useEffect, useMemo } from 'react';
import { 
  SafeAreaView,  
  StyleSheet, 
  Text, 
  View, 
  FlatList,
  Pressable,
  ActivityIndicator, 
} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { supabase } from './supabase'; 
import { TIPO_COR_MAP, TIPOS_RESIDUOS } from './constants/data'; 

// NOVO: Função para normalizar strings (remove acentos e converte para minúsculas)
const normalizeString = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// Componente para renderizar um item da lista (inalterado)
const OfertaItem = ({ item, tema }) => (
    <View style={[styles.itemCard, { backgroundColor: tema.card }]}>
      <View style={[styles.pontoTag, { backgroundColor: TIPO_COR_MAP[item.tipo_residuo] || '#95a5a6' }]}>
        <Text style={styles.pontoText}>{item.ponto_coleta}</Text>
      </View>
      <View style={styles.details}>
        <Text style={[styles.typeText, { color: tema.text }]}>{item.tipo_residuo} - {item.nome_usuario}</Text>
        <Text style={[styles.quantityText, { color: tema.subtext }]}>
          <Text style={{ fontWeight: 'bold' }}>{item.quantidade_kg}</Text> kg
        </Text>
      </View>
    </View>
);

// NOVO: Componente para os Botões de Filtro (Melhorado)
const FiltroTipo = ({ tema, filtroAtivo, onToggle }) => (
    <View style={styles.filtroContainer}>
        {Object.entries(TIPOS_RESIDUOS).map(([key, data]) => {
            const isActive = filtroAtivo[data.label]; // Usa o RÓTULO (Ex: 'Orgânico') como chave de estado
            return (
                <Pressable
                    key={key}
                    onPress={() => onToggle(data.label)} // Passa o RÓTULO para o toggle
                    style={[
                        styles.filtroButton,
                        { borderColor: data.cor, backgroundColor: isActive ? data.cor : tema.card }
                    ]}
                >
                    <Text style={[
                        styles.filtroText,
                        { color: isActive ? tema.card : tema.text, fontWeight: isActive ? '700' : '500' }
                    ]}>
                        {data.label}
                    </Text>
                </Pressable>
            );
        })}
    </View>
);


export default function OfertasScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [ofertas, setOfertas] = useState([]); 
  const [loading, setLoading] = useState(true); 
  // ESTADO DO FILTRO: Agora armazena o RÓTULO do filtro ativo (Ex: {'Reciclável': true})
  const [filtrosAtivos, setFiltrosAtivos] = useState({}); 

  const tema = darkMode ? darkTheme : lightTheme;

  // Função para buscar dados do Supabase (inalterada)
  useEffect(() => {
    async function fetchOfertas() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('ofertas_coleta')
          .select('*')
          .order('created_at', { ascending: false }); 

        if (error) {
          throw error;
        }
        
        setOfertas(data);
      } catch (error) {
        console.error('Erro ao buscar ofertas:', error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchOfertas();
  }, []); 

  // NOVO: Lógica de Filtragem (LOCAL) - Usa useMemo para performance e normalização
  const ofertasFiltradas = useMemo(() => {
    // 1. Obtém a lista normalizada (sem acento, minúsculo) dos filtros ATIVOS
    const tiposAtivosNormalizados = Object.keys(filtrosAtivos)
        .filter(label => filtrosAtivos[label]) // Filtra apenas os que são TRUE
        .map(label => normalizeString(label)); // Normaliza o nome (ex: 'reciclavel')
    
    // 2. Se nenhum filtro estiver ativo, exibe todas as ofertas
    if (tiposAtivosNormalizados.length === 0) {
        return ofertas;
    }

    // 3. Filtra a lista de ofertas
    return ofertas.filter(oferta => {
        // Normaliza o tipo de resíduo do DB (Ex: 'reciclavel')
        const tipoResiduoNormalizado = normalizeString(oferta.tipo_residuo);
        
        // Verifica se o tipo do resíduo (normalizado) está na lista de filtros ativos (normalizados)
        return tiposAtivosNormalizados.includes(tipoResiduoNormalizado);
    });

  }, [ofertas, filtrosAtivos]); // Recalcula apenas se os dados ou os filtros mudarem


  // Função para alternar o estado do filtro (usando o RÓTULO como chave)
  const handleToggleFiltro = (label) => {
    setFiltrosAtivos(prev => ({
        ...prev,
        [label]: !prev[label]
    }));
  };


  // Renderiza a tela de carregamento (inalterada)
  if (loading) {
    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: tema.bg, justifyContent: 'center', alignItems: 'center' }]}>
            <ActivityIndicator size="large" color={tema.icon} />
            <Text style={{ color: tema.subtext, marginTop: 10 }}>Carregando ofertas...</Text>
        </SafeAreaView>
    );
  }


  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: tema.bg }]}>
      <View style={[styles.header, { backgroundColor: tema.card, borderBottomColor: tema.border }]}>
        <View>
          <Text style={[styles.title, { color: tema.text }]}>Ofertas de Coleta</Text>
          <Text style={[styles.subtitle, { color: tema.subtext }]}>
            Visualização das quantidades de lixo disponíveis para coleta.
          </Text>
        </View>

        <Pressable onPress={() => setDarkMode(!darkMode)}>
          <Ionicons
            name={darkMode ? "moon" : "sunny"}
            size={26}
            color={tema.icon}
          />
        </Pressable>
      </View>

      {/* NOVO: Componente de Filtro */}
      <FiltroTipo 
          tema={tema}
          filtroAtivo={filtrosAtivos}
          onToggle={handleToggleFiltro}
      />

      <FlatList
        data={ofertasFiltradas} // AGORA USA A LISTA FILTRADA
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <OfertaItem item={item} tema={tema} />}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={() => (
            <Text style={{ color: tema.subtext, textAlign: 'center', marginTop: 20 }}>
                Nenhuma oferta encontrada para os filtros selecionados.
            </Text>
        )}
      />
    </SafeAreaView>
  );
}

// Temas e Estilos (inalterados)
const lightTheme = {
  bg: "#f5f6fa",
  card: "#ffffff",
  text: "#2f3640",
  subtext: "#636e72",
  border: "#dfe6e9",
  icon: "#0097e6",
};

const darkTheme = {
  bg: "#1e272e",
  card: "#2f3640",
  text: "#f5f6fa",
  subtext: "#b2bec3",
  border: "#3d3d3d",
  icon: "#ffd32a",
};

const styles = StyleSheet.create({
  safe: { 
    flex: 1, 
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    borderBottomWidth: 1,
  },
  title: { 
    fontSize: 22, 
    fontWeight: '700',
    marginBottom: 5 
  },
  subtitle: { 
    fontSize: 14,
  },
  // Estilos do filtro
  filtroContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#dfe6e9',
  },
  filtroButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  filtroText: {
    fontSize: 14,
  },
  // Fim dos estilos de filtro
  listContainer: { 
    padding: 20, 
    gap: 10 
  },
  itemCard: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
    alignItems: 'center',
  },
  pontoTag: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  pontoText: {
    color: 'white',
    fontWeight: '900',
    fontSize: 18,
  },
  details: {
    flex: 1,
    justifyContent: 'center',
  },
  typeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  quantityText: {
    fontSize: 15,
    marginTop: 2,
  },
});