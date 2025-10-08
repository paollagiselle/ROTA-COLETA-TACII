import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function CheckboxPontos({ pontos, inicio, selecionados, marcarPonto }) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>Selecione os pontos da rota:</Text>
      {pontos.map(
        (p) =>
          p !== inicio && (
            <Pressable
              key={p}
              style={styles.checkboxRow}
              onPress={() => marcarPonto(p)}
            >
              <View style={[styles.box, selecionados.includes(p) && styles.boxChecked]}>
                {selecionados.includes(p) && <Text style={styles.checkMark}>✓</Text>}
              </View>
              <Text style={styles.ptText}>{p}</Text>
            </Pressable>
          )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 12,
    marginVertical: 10,
  },
  label: { marginBottom: 8, fontWeight: "600", color: "#2f3640" },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 6,
  },
  box: {
    width: 26,
    height: 26,
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    backgroundColor: "#fff",
  },
  boxChecked: {
    backgroundColor: "#0097e6",
    borderColor: "#0097e6",
  },
  checkMark: { color: "#fff", fontWeight: "700" },
  ptText: { fontSize: 16, color: "#2f3640" },
});