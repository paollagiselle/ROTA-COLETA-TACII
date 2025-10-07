import React, { useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text } from "react-native";
import CheckboxPontos from "../src/CheckboxPontos";
import Resultado from "../src/Resultado";
import SelectInicio from "../src/SelectInicio";

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
  const [selecionados, setSelecionados] = useState([]); // pontos escolhidos
  const [total, setTotal] = useState(0);
  const [etapas, setEtapas] = useState([]);

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

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Rota de Coleta de Lixo</Text>

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

        <Pressable style={styles.btn} onPress={calcular}>
          <Text style={styles.btnText}>Calcular Rota</Text>
        </Pressable>

        <Resultado etapas={etapas} total={total} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f5f6fa" },
  container: {
    padding: 20,
    alignItems: "center",
  },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 12, color: "#2f3640" },
  btn: {
    backgroundColor: "#0097e6",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 10,
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
