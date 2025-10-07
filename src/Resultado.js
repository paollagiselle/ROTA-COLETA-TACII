import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function Resultado({ etapas, total }) {
  return (
    <View style={[styles.card, styles.resultado]}>
      <Text style={styles.title}>Resultado</Text>

      {etapas && etapas.length > 0 ? (
        <>
          <FlatList
            data={etapas}
            keyExtractor={(item, index) => String(index)}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text>{item}</Text>
              </View>
            )}
            style={{ width: "100%" }}
          />
          <Text style={styles.total}>
            <Text style={{ fontWeight: "700" }}>Total: </Text>
            {total} km
          </Text>
        </>
      ) : (
        <Text>Nenhuma rota calculada ainda.</Text>
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
  resultado: {
    backgroundColor: "#eaf8f5",
    borderLeftWidth: 5,
    borderLeftColor: "#00a8ff",
  },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 8, color: "#2f3640" },
  item: {
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 6,
    borderRadius: 8,
    elevation: 1,
  },
  total: { marginTop: 8, fontSize: 16, color: "#2f3640" },
});
