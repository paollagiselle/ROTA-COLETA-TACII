import React, { useState, useEffect } from "react";
import { 
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator, 
  Alert 
} from "react-native";
import CheckboxPontos from "./CheckboxPontos";
import Resultado from "./Resultado";
import SelectInicio from "./SelectInicio";
import TiposResiduos from "./TiposResiduos";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { PONTOS_MAPA_RESIDUOS } from "./constants/data"; 
import { supabase } from './supabase'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; // NOVO IMPORT

// Chave para salvar o plano de rota
const ASYNC_STORAGE_ROUTE_KEY = '@rotaOtimizadaPlano'; 

export default function PlanejarRotaScreen() {
  const pontos = ["A", "B", "C", "D", "E"];
  
  const [distancias, setDistancias] = useState({});
  const [loadingDist, setLoadingDist] = useState(true); 
  const [mapaResiduos, setMapaResiduos] = useState({}); 
  const [loadingMap, setLoadingMap] = useState(true); 

  // EFEITO PARA CARREGAR AS DISTÂNCIAS DO SUPABASE
  useEffect(() => {
    async function fetchDistancias() {
        try {
            const { data, error } = await supabase
                .from('distancias_pontos')
                .select('*');

            if (error) throw error;

            const matriz = {};
            data.forEach(item => {
                if (!matriz[item.ponto_a]) {
                    matriz[item.ponto_a] = {};
                }
                matriz[item.ponto_a][item.ponto_b] = item.distancia_km;
            });

            setDistancias(matriz);
        } catch (error) {
            console.error('Erro ao carregar distâncias:', error.message);
            Alert.alert("Erro de Conexão", "Não foi possível carregar a matriz de distâncias.");
        } finally {
            setLoadingDist(false);
        }
    }
    fetchDistancias();
  }, []); 

  // EFEITO PARA CARREGAR O MAPA DE RESÍDUOS DO SUPABASE
  useEffect(() => {
    async function fetchMapaResiduos() {
        try {
            const { data, error } = await supabase
                .from('pontos_residuos')
                .select('*');

            if (error) throw error;

            const mapa = {};
            data.forEach(item => {
                if (!mapa[item.ponto]) {
                    mapa[item.ponto] = [];
                }
                mapa[item.ponto].push(item.tipo_residuo);
            });

            setMapaResiduos(mapa);
        } catch (error) {
            console.error('Erro ao carregar mapa de resíduos:', error.message);
            Alert.alert("Erro de Conexão", "Não foi possível carregar o mapa de resíduos.");
        } finally {
            setLoadingMap(false);
        }
    }
    fetchMapaResiduos();
  }, []); 


  const [inicio, setInicio] = useState("A");
  const [selecionados, setSelecionados] = useState([]);
  const [tiposSelecionados, setTiposSelecionados] = useState({
    organico: false,
    reciclavel: false,
    eletronico: false,
  });
  const [total, setTotal] = useState(0);
  const [etapas, setEtapas] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  // FUNÇÃO DE SALVAMENTO NO ASYNCSTORAGE
  const salvarPlanoDeRota = async (rota) => {
    try {
        const rotaJson = JSON.stringify(rota);
        await AsyncStorage.setItem(ASYNC_STORAGE_ROUTE_KEY, rotaJson);
        // Reseta o índice de execução sempre que um novo plano é calculado
        await AsyncStorage.setItem('@rotaIndexAtual', '0'); 
    } catch (e) {
        console.error("Erro ao salvar plano:", e);
    }
  };


  // Lógica de Filtragem de Pontos de Destino 
  const pontosFiltradosPorResiduo = pontos.filter(ponto => {
    if (ponto === 'A') return false; 
    
    const tiposMarcados = Object.keys(tiposSelecionados).filter(key => tiposSelecionados[key]);
    if (tiposMarcados.length === 0) {
        return true; 
    }

    const tiposDoPonto = mapaResiduos[ponto] || [];
    return tiposMarcados.some(tipo => tiposDoPonto.includes(tipo));
  });

  let pontosFinais = pontosFiltradosPorResiduo;
  if (inicio !== 'A') {
      pontosFinais = [...pontosFinais, 'A'];
  }

  const pontosFiltrados = pontosFinais.filter(p => p !== inicio).sort();


  // Correção do ESLint (problema de dependência)
  useEffect(() => {
    setSelecionados(prev => prev.filter(p => pontosFiltrados.includes(p)));
  }, [tiposSelecionados, inicio, pontosFiltrados]); 

  
  const marcarPonto = (ponto) => {
    if (!pontosFiltrados.includes(ponto)) return; 

    setSelecionados((prev) => {
      const novoSet = new Set(prev);
      if (novoSet.has(ponto)) novoSet.delete(ponto);
      else novoSet.add(ponto);
      return Array.from(novoSet);
    });
  };

  // FUNÇÃO CALCULAR(Vizinho Mais Próximo) - ATUALIZADA PARA SALVAR O PLANO
  const calcular = () => {
    if (selecionados.length === 0 || loadingDist || Object.keys(distancias).length === 0 || loadingMap) {
        setTotal(0);
        setEtapas([]);
        if (loadingDist || loadingMap) Alert.alert("Aguarde", "Carregando dados de roteamento...");
        return;
    }

    let rotaOtimizada = [inicio];
    let pontosRestantes = new Set(selecionados);
    let pontoAtual = inicio;
    let distanciaTotal = 0;
    const etapasTemp = [];

    while (pontosRestantes.size > 0) {
        let vizinhoMaisProximo = null;
        let menorDistancia = Infinity;

        pontosRestantes.forEach(proxPonto => {
            const dist = distancias[pontoAtual]?.[proxPonto]; 
            if (dist !== undefined && dist < menorDistancia) {
                menorDistancia = dist;
                vizinhoMaisProximo = proxPonto;
            }
        });

        if (vizinhoMaisProximo) {
            etapasTemp.push(`${pontoAtual} → ${vizinhoMaisProximo} : ${menorDistancia} km`);
            rotaOtimizada.push(vizinhoMaisProximo);
            distanciaTotal += menorDistancia;
            pontosRestantes.delete(vizinhoMaisProximo);
            pontoAtual = vizinhoMaisProximo;
        } else {
            break; 
        }
    }
    
    // Otimização: Voltar para o Ponto de Início
    if (pontoAtual !== inicio) {
        const distVolta = distancias[pontoAtual]?.[inicio]; 
        if (distVolta !== undefined) {
             distanciaTotal += distVolta;
             etapasTemp.push(`${pontoAtual} → ${inicio} : ${distVolta} km (Volta à Base)`);
             rotaOtimizada.push(inicio);
        }
    }

    setTotal(distanciaTotal);
    setEtapas(etapasTemp);
    
    // NOVO: Salva apenas a sequência de pontos (o plano de rota)
    salvarPlanoDeRota(rotaOtimizada); 
};


  const tema = darkMode ? dark : light;

  // Renderiza tela de loading enquanto carrega as distâncias e o mapa de resíduos
  if (loadingDist || loadingMap) {
    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: tema.bg, justifyContent: 'center', alignItems: 'center' }]}>
            <ActivityIndicator size="large" color={tema.icon} />
            <Text style={{ color: tema.text, marginTop: 10 }}>Carregando dados de roteamento...</Text>
        </SafeAreaView>
    );
  }


  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: tema.bg }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: tema.text }]}>
            Rota de Coleta de Lixo
          </Text>

          <Pressable onPress={() => setDarkMode(!darkMode)}>
            <Ionicons
              name={darkMode ? "moon" : "sunny"}
              size={26}
              color={tema.icon}
            />
          </Pressable>
        </View>

        <SelectInicio
          pontos={pontos}
          inicio={inicio}
          isDarkMode={darkMode}
          setInicio={(v) => {
            setInicio(v);
            setSelecionados([]);
            setTotal(0);
            setEtapas([]);
          }}
        />

          <TiposResiduos 
          isDarkMode={darkMode}
          onChange={(novosTipos) => {
            setTiposSelecionados(novosTipos);
            setTotal(0);
            setEtapas([]);
          }} 
          />

        <CheckboxPontos
          pontos={pontosFiltrados}
          inicio={inicio}
          selecionados={selecionados}
          marcarPonto={marcarPonto}
          isDarkMode={darkMode}
        />

        <Pressable onPress={calcular} style={{ width: "100%", marginTop: 10 }}>
          <LinearGradient
            colors={["#0097e6", "#00c6ff"]}
            style={styles.btn}
            start={[0, 0]}
            end={[1, 1]}
          >
            <Text style={styles.btnText}>Calcular Rota</Text>
          </LinearGradient>
        </Pressable>

        <Resultado etapas={etapas} total={total} />
      </ScrollView>
    </SafeAreaView>
  );
}

const light = {
  bg: "#f5f6fa",
  text: "#2f3640",
  icon: "#0097e6",
};

const dark = {
  bg: "#1e272e",
  text: "#f5f6fa",
  icon: "#ffd32a",
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: 20, alignItems: "center" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 16,
  },
  title: { fontSize: 20, fontWeight: "700" },
  btn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  btnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});