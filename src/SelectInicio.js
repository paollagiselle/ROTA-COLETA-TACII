import React from "react";
import { StyleSheet, Text, View } from "react-native";
import RNPickerSelect from "react-native-picker-select";

export default function SelectInicio({ pontos, inicio, setInicio, isDarkMode }) {
  const placeholder = {
    label: 'Selecione um ponto de partida...',
    value: null,
    color: '#9EA0A4', 
  };

  const tema = isDarkMode ? darkTheme : lightTheme;

  return (
    <View style={[styles.card, { backgroundColor: tema.bg }]}>
      <Text style={[styles.title, { color: tema.text }]}>Ponto de Partida:</Text>
      
      <RNPickerSelect
        onValueChange={(value) => {
          console.log('Valor selecionado:', value); 
          setInicio(value);
        }}
        items={pontos.map((p) => ({ label: p, value: p, key: p }))}
        value={inicio} 
        placeholder={inicio ? undefined : placeholder} 

        style={{
          ...pickerSelectStyles,
          inputIOS: {
            ...pickerSelectStyles.inputIOS,
            backgroundColor: tema.inputBg,
            color: tema.text,
            borderColor: tema.border,
          },
          inputAndroid: {
            ...pickerSelectStyles.inputAndroid,
            backgroundColor: tema.inputBg,
            color: tema.text,
            borderColor: tema.border,
          },
          placeholder: {
            ...pickerSelectStyles.placeholder,
            color: tema.placeholder,
          },
          viewContainer: {
            ...pickerSelectStyles.viewContainer,
            backgroundColor: tema.inputBg,
          },
        }}

        useNativeAndroidPickerStyle={false} 
        fixAndroidTouchableBug={true} 
      />
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
  label: { 
    marginBottom: 6, 
    fontWeight: "600", 
    color: "#2f3640" 
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: 'white',
    color: 'black',
    paddingRight: 30, 
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: 'white',
    color: 'black',
    paddingRight: 30,
  },
  placeholder: {
    color: '#9EA0A4', 
    fontStyle: 'italic', 
  },
  viewContainer: {
    backgroundColor: 'white',
  },
});