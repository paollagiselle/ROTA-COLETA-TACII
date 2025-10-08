import React, { useState } from "react";
import { View, Text, StyleSheet, useColorScheme } from "react-native";
import CheckBox from "expo-checkbox";

export default function TiposResiduos({ onChange }) {
  const [tipos, setTipos] = useState({
    organico: false,
    reciclavel: false,
    eletronico: false,
  });

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const handleChange = (key) => {
    const novosTipos = { ...tipos, [key]: !tipos[key] };
    setTipos(novosTipos);
    onChange && onChange(novosTipos);
  };

  return (
    <View style={[styles.card, isDark && styles.cardDark]}>
      <Text style={[styles.title, isDark && styles.titleDark]}>Tipos de Resíduos</Text>

      <View style={styles.option}>
        <CheckBox
          value={tipos.organico}
          onValueChange={() => handleChange("organico")}
          color={tipos.organico ? "#27ae60" : undefined}
        />
        <Text style={[styles.label, isDark && styles.labelDark]}>Orgânico</Text>
      </View>

      <View style={styles.option}>
        <CheckBox
          value={tipos.reciclavel}
          onValueChange={() => handleChange("reciclavel")}
          color={tipos.reciclavel ? "#f1c40f" : undefined}
        />
        <Text style={[styles.label, isDark && styles.labelDark]}>Reciclável</Text>
      </View>

      <View style={styles.option}>
        <CheckBox
          value={tipos.eletronico}
          onValueChange={() => handleChange("eletronico")}
          color={tipos.eletronico ? "#3498db" : undefined}
        />
        <Text style={[styles.label, isDark && styles.labelDark]}>Eletrônico</Text>
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
  cardDark: {
    backgroundColor: "#2f3640",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    color: "#2f3640",
  },
  titleDark: {
    color: "#f5f6fa",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    marginLeft: 8,
    fontSize: 15,
    color: "#2f3640",
  },
  labelDark: {
    color: "#f5f6fa",
  },
});
