import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function CheckboxPontos({ pontos, inicio, selecionados, marcarPonto, isDarkMode }) {
  // Se o array de pontos estiver vazio, mostramos uma mensagem informativa
  if (pontos.length === 0) {
    return (
        <View style={[styles.card, { backgroundColor: tema.bg }]}>
             <Text style={[styles.label, { color: tema.text }]}>Selecione os pontos da rota:</Text>
             <Text style={[styles.infoText, {backgroundColor: isDarkMode ? "#3d3d3d" : "#fff3e0",color: isDarkMode ? "#fcbf49" : "#e65100",},]}>Nenhum ponto de coleta atende aos tipos de resíduos selecionados.</Text>
        </View>
    );
  }

   const tema = isDarkMode ? darkTheme : lightTheme;

  return (
    <View style={[styles.card, { backgroundColor: tema.bg }]}>
      <Text style={[styles.title, { color: tema.text }]}>Selecione os pontos da rota:</Text>
      
      {pontos.map(
        (p) =>
          (
            <Pressable
              key={p}
              style={styles.checkboxRow}
              onPress={() => marcarPonto(p)}
            >
              <View style={[styles.box, {backgroundColor: selecionados.includes(p) ? '#0097e6' : tema.bgBox,
                borderColor: selecionados.includes(p) ? '#0097e6' : tema.checkbox, }, ]} >

              {selecionados.includes(p) && <Text style={styles.checkMark}>✓</Text>}
              </View>

              <Text style={[styles.ptText, { color: selecionados.includes(p) ? "#0097e6" : tema.text },]}>{p}</Text>
            </Pressable>
          )
      )}
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
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 12,
    marginVertical: 10,
  },
  label: { marginBottom: 8, fontWeight: "600", color: "#2f3640" },
  infoText: { 
    color: '#e65100', 
    padding: 8,
    backgroundColor: '#fff3e0',
    borderRadius: 8,
    textAlign: 'center',
    marginTop: 5,
  },
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