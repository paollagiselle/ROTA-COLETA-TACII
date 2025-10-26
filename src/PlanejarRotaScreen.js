import React, { useState, useEffect } from "react";
import { 
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import CheckboxPontos from "./CheckboxPontos";
import Resultado from "./Resultado";
import SelectInicio from "./SelectInicio";
import TiposResiduos from "./TiposResiduos";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function PlanejarRotaScreen() {
  const pontos = ["A", "B", "C", "D", "E"];
  const distancias = {
    A: { B: 4, C: 7, D: 3, E: 6 },
    B: { A: 4, C: 2, D: 5, E: 8 },
    C: { A: 7, B: 2, D: 6, E: 3 },
    D: { A: 3, B: 5, C: 6, E: 4 },
    E: { A: 6, B: 8, C: 3, D: 4 },
  };

  // Mapeamento dos tipos de resíduos por ponto
  const mapeamentoResiduos = {
    A: ['eletronico','organico'],
    B: ['organico', 'reciclavel'],
    C: ['reciclavel', 'eletronico'],
    D: ['organico'],
    E: ['reciclavel'],
  };

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


  const pontosFiltradosPorResiduo = pontos.filter(ponto => {
    if (ponto === 'A') return false; 
    
    const tiposMarcados = Object.keys(tiposSelecionados).filter(key => tiposSelecionados[key]);
    if (tiposMarcados.length === 0) {
        return true; 
    }

    // Verifica se o ponto coleta pelo menos um dos tipos de resíduos marcados.
    const tiposDoPonto = mapeamentoResiduos[ponto] || [];
    return tiposMarcados.some(tipo => tiposDoPonto.includes(tipo));
  });

  //Adiciona o Ponto 'A' (base) à lista se ele não for o ponto de início.
  let pontosFinais = pontosFiltradosPorResiduo;
  if (inicio !== 'A') {
      pontosFinais = [...pontosFinais, 'A'];
  }

  const pontosFiltrados = pontosFinais.filter(p => p !== inicio).sort();


  //efeito para limpar a seleção de pontos se eles não estiverem mais na lista filtrada
  useEffect(() => {
    setSelecionados(prev => prev.filter(p => pontosFiltrados.includes(p)));
  }, [tiposSelecionados, inicio]);


  const marcarPonto = (ponto) => {
    if (!pontosFiltrados.includes(ponto)) return; 

    setSelecionados((prev) => {
      const novoSet = new Set(prev);
      if (novoSet.has(ponto)) novoSet.delete(ponto);
      else novoSet.add(ponto);
      return Array.from(novoSet);
    });
  };

  // FUNÇÃO CALCULAR(Vizinho Mais Próximo)
  const calcular = () => {
    if (selecionados.length === 0) {
        setTotal(0);
        setEtapas([]);
        navigation.navigate("Ofertas", { filtros: tiposSelecionados });
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
            const dist = distancias[pontoAtual][proxPonto];
            if (dist < menorDistancia) {
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
    
    if (pontoAtual !== inicio) {
        const distVolta = distancias[pontoAtual][inicio];
        distanciaTotal += distVolta;
        etapasTemp.push(`${pontoAtual} → ${inicio} : ${distVolta} km (Volta à Base)`);
        rotaOtimizada.push(inicio);
    }


    setTotal(distanciaTotal);
    setEtapas(etapasTemp);
  };


  const tema = darkMode ? dark : light;

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