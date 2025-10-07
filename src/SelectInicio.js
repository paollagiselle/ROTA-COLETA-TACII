import { Picker } from "@react-native-picker/picker";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function SelectInicio({ pontos, inicio, setInicio }) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>Ponto de Partida:</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={inicio}
          onValueChange={(itemValue) => setInicio(itemValue)}
          mode="dropdown"
        >
          {pontos.map((p) => (
            <Picker.Item label={p} value={p} key={p} />
          ))}
        </Picker>
      </View>
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
  label: { marginBottom: 6, fontWeight: "600", color: "#2f3640" },
  pickerWrapper: {
    height: 50,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
});
