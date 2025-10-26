import React, { useState } from 'react';
import { 
  SafeAreaView,  
  StyleSheet, 
  Text, 
  View, 
  FlatList,
  Pressable
} from 'react-native';
import { Ionicons } from "@expo/vector-icons";

// Dados de exemplo
const ofertasData = [
  { id: '1', ponto: 'B', tipo: 'Orgânico', quantidade: 5.2, user: 'Maria' },
  { id: '3', ponto: 'C', tipo: 'Eletrônico', quantidade: 0.5, user: 'Ana' },
  { id: '4', ponto: 'E', tipo: 'Reciclável', quantidade: 3.0, user: 'Pedro' },
  { id: '2', ponto: 'D', tipo: 'Orgânico', quantidade: 1.8, user: 'João' },
  { id: '5', ponto: 'B', tipo: 'Reciclável', quantidade: 2.5, user: 'Carla' },
];

const tipoCor = {
  'Orgânico': '#27ae60',
  'Reciclável': '#f1c40f',
  'Eletrônico': '#3498db',
};

export default function OfertasScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const tema = darkMode ? darkTheme : lightTheme;

  const OfertaItem = ({ item }) => (
    <View style={[styles.itemCard, { backgroundColor: tema.card }]}>
      <View style={[styles.pontoTag, { backgroundColor: tipoCor[item.tipo] || '#95a5a6' }]}>
        <Text style={styles.pontoText}>{item.ponto}</Text>
      </View>
      <View style={styles.details}>
        <Text style={[styles.typeText, { color: tema.text }]}>{item.tipo} - {item.user}</Text>
        <Text style={[styles.quantityText, { color: tema.subtext }]}>
          <Text style={{ fontWeight: 'bold' }}>{item.quantidade}</Text> kg
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: tema.bg }]}>
      <View style={[styles.header, { backgroundColor: tema.card, borderBottomColor: tema.border }]}>
        <View>
          <Text style={[styles.title, { color: tema.text }]}>Ofertas de Coleta</Text>
          <Text style={[styles.subtitle, { color: tema.subtext }]}>
            Visualização das quantidades de lixo disponíveis para coleta.
          </Text>
        </View>

        {/* Ícone clicável para alternar o modo */}
        <Pressable onPress={() => setDarkMode(!darkMode)}>
          <Ionicons
            name={darkMode ? "moon" : "sunny"}
            size={26}
            color={tema.icon}
          />
        </Pressable>
      </View>

      <FlatList
        data={ofertasData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <OfertaItem item={item} />}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

// Temas
const lightTheme = {
  bg: "#f5f6fa",
  card: "#ffffff",
  text: "#2f3640",
  subtext: "#636e72",
  border: "#dfe6e9",
  icon: "#0097e6",
};

const darkTheme = {
  bg: "#1e272e",
  card: "#2f3640",
  text: "#f5f6fa",
  subtext: "#b2bec3",
  border: "#3d3d3d",
  icon: "#ffd32a",
};

const styles = StyleSheet.create({
  safe: { 
    flex: 1, 
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    borderBottomWidth: 1,
  },
  title: { 
    fontSize: 22, 
    fontWeight: '700',
    marginBottom: 5 
  },
  subtitle: { 
    fontSize: 14,
  },
  listContainer: { 
    padding: 20, 
    gap: 10 
  },
  itemCard: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
    alignItems: 'center',
  },
  pontoTag: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  pontoText: {
    color: 'white',
    fontWeight: '900',
    fontSize: 18,
  },
  details: {
    flex: 1,
    justifyContent: 'center',
  },
  typeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  quantityText: {
    fontSize: 15,
    marginTop: 2,
  },
});
