import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import CheckBox from "expo-checkbox";

export default function TiposResiduos({ onChange, isDarkMode }) {
  const [tipos, setTipos] = useState({
    organico: false,
    reciclavel: false,
    eletronico: false,
  });

  const handleChange = (key) => {
    const novosTipos = { ...tipos, [key]: !tipos[key] };
    setTipos(novosTipos);
    onChange && onChange(novosTipos);
  };

  const tema = isDarkMode ? darkTheme : lightTheme;

  return (
    <View style={[styles.card, { backgroundColor: tema.bg }]}>
      <Text style={[styles.title, { color: tema.text }]}>Tipos de Resíduos</Text>

      <View style={styles.option}>
        <CheckBox
          value={tipos.organico}
          onValueChange={() => handleChange("organico")}
          color={tipos.organico ? "#27ae60" : tema.checkbox}
        />
        <Text style={[styles.label, { color: tema.text }]}>Orgânico</Text>
      </View>

      <View style={styles.option}>
        <CheckBox
          value={tipos.reciclavel}
          onValueChange={() => handleChange("reciclavel")}
          color={tipos.reciclavel ? "#f1c40f" : tema.checkbox}
        />
        <Text style={[styles.label, { color: tema.text }]}>Reciclável</Text>
      </View>

      <View style={styles.option}>
        <CheckBox
          value={tipos.eletronico}
          onValueChange={() => handleChange("eletronico")}
          color={tipos.eletronico ? "#3498db" : tema.checkbox}
        />
        <Text style={[styles.label, { color: tema.text }]}>Eletrônico</Text>
      </View>
    </View>
  );
}

// Temas separados para modo claro e escuro
const lightTheme = {
  bg: "#f9f9f9",
  text: "#2f3640",
  checkbox: "#2f3640",
};

const darkTheme = {
  bg: "#2f3640",
  text: "#f5f6fa",
  checkbox: "#f5f6fa",
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    padding: 12,
    borderRadius: 12,
    marginVertical: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    marginLeft: 8,
    fontSize: 15,
  },
});
