import React, { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import CheckboxPontos from "../src/CheckboxPontos";
import Resultado from "../src/Resultado";
import SelectInicio from "../src/SelectInicio";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function App() {
  const pontos = ["A", "B", "C", "D", "E"];
  const distancias = {
    A: { B: 4, C: 7, D: 3, E: 6 },
    B: { A: 4, C: 2, D: 5, E: 8 },
    C: { A: 7, B: 2, D: 6, E: 3 },
    D: { A: 3, B: 5, C: 6, E: 4 },
    E: { A: 6, B: 8, C: 3, D: 4 },
  };

  const [inicio, setInicio] = useState("A");
  const [selecionados, setSelecionados] = useState([]);
  const [total, setTotal] = useState(0);
  const [etapas, setEtapas] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  const marcarPonto = (ponto) => {
    setSelecionados((prev) => {
      const novoSet = new Set(prev);
      if (novoSet.has(ponto)) novoSet.delete(ponto);
      else novoSet.add(ponto);
      return Array.from(novoSet);
    });
  };

  const calcular = () => {
    const rota = [inicio, ...selecionados];
    let distanciaTotal = 0;
    const etapasTemp = [];

    for (let i = 0; i < rota.length - 1; i++) {
      const atual = rota[i];
      const prox = rota[i + 1];
      const dist = distancias[atual][prox];
      distanciaTotal += dist;
      etapasTemp.push(`${atual} → ${prox} : ${dist} km`);
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
            🚛 Rota de Coleta de Lixo
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
          setInicio={(v) => {
            setInicio(v);
            setSelecionados([]);
            setTotal(0);
            setEtapas([]);
          }}
        />

        <CheckboxPontos
          pontos={pontos}
          inicio={inicio}
          selecionados={selecionados}
          marcarPonto={marcarPonto}
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
