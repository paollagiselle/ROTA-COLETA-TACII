import React from "react";
import { Animated, FlatList, StyleSheet, Text, View } from "react-native";

export default function Resultado({ etapas, total }) {
  const fadeAnim = new Animated.Value(0);

  React.useEffect(() => {
    if (etapas.length > 0) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }
  }, [etapas]);

  return (
    <Animated.View
      style={[
        styles.card,
        styles.resultado,
        { opacity: etapas.length > 0 ? fadeAnim : 1 },
      ]}
    >
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
        <Text style={{ color: "#636e72" }}>Nenhuma rota calculada ainda.</Text>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "#f9f9f9",
    padding: 14,
    borderRadius: 12,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  resultado: {
    backgroundColor: "#eaf8f5",
    borderLeftWidth: 5,
    borderLeftColor: "#00a8ff",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    color: "#2f3640",
  },
  item: {
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 6,
    borderRadius: 8,
    elevation: 1,
  },
  total: { marginTop: 8, fontSize: 16, color: "#2f3640" },
});
