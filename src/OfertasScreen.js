import React from 'react';
import { 
  SafeAreaView,  
  StyleSheet, 
  Text, 
  View, 
  FlatList 
} from 'react-native';

// Dados de exemplo
const ofertasData = [
  { id: '1', ponto: 'B', tipo: 'Orgânico', quantidade: 5.2, user: 'Maria' },
  { id: '2', ponto: 'D', tipo: 'Reciclável', quantidade: 1.8, user: 'João' },
  { id: '3', ponto: 'C', tipo: 'Eletrônico', quantidade: 0.5, user: 'Ana' },
  { id: '4', ponto: 'E', tipo: 'Orgânico', quantidade: 3.0, user: 'Pedro' },
  { id: '5', ponto: 'B', tipo: 'Reciclável', quantidade: 2.5, user: 'Carla' },
];

const tipoCor = {
  'Orgânico': '#27ae60', // Verde
  'Reciclável': '#f1c40f', // Amarelo
  'Eletrônico': '#3498db', // Azul
};

// Componente para renderizar um item da lista
const OfertaItem = ({ item }) => (
  <View style={styles.itemCard}>
    <View style={[styles.pontoTag, { backgroundColor: tipoCor[item.tipo] || '#95a5a6' }]}>
      <Text style={styles.pontoText}>{item.ponto}</Text>
    </View>
    <View style={styles.details}>
      <Text style={styles.typeText}>{item.tipo} - {item.user}</Text>
      <Text style={styles.quantityText}>
        <Text style={{ fontWeight: 'bold' }}>{item.quantidade}</Text> kg
      </Text>
    </View>
  </View>
);

export default function OfertasScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Ofertas de Coleta</Text>
        <Text style={styles.subtitle}>
          Visualização das quantidades de lixo disponíveis para coleta.
        </Text>
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

const styles = StyleSheet.create({
  safe: { 
    flex: 1, 
    backgroundColor: '#f5f6fa' 
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#dfe6e9',
    backgroundColor: 'white',
  },
  title: { 
    fontSize: 22, 
    fontWeight: '700', 
    color: '#2f3640', 
    marginBottom: 5 
  },
  subtitle: { 
    fontSize: 14, 
    color: '#636e72' 
  },
  listContainer: { 
    padding: 20, 
    gap: 10 
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
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
    color: '#2f3640',
  },
  quantityText: {
    fontSize: 15,
    color: '#636e72',
    marginTop: 2,
  },
});