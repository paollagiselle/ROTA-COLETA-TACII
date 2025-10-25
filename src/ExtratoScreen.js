import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import RotaMapa from './RotaMapa'; // O Expo resolve para .web.js ou .native.js

// DADOS DE EXEMPLO
const extratoData = [
  { dia: 'Seg', volume: 8.5, organico: 5.0, reciclavel: 3.0, eletronico: 0.5 },
  { dia: 'Ter', volume: 15.0, organico: 8.0, reciclavel: 6.0, eletronico: 1.0 },
  { dia: 'Qua', volume: 5.0, organico: 3.5, reciclavel: 1.0, eletronico: 0.5 },
  { dia: 'Qui', volume: 11.2, organico: 7.0, reciclavel: 4.0, eletronico: 0.2 },
  { dia: 'Sex', volume: 18.0, organico: 10.0, reciclavel: 7.0, eletronico: 1.0 },
  { dia: 'Sáb', volume: 6.8, organico: 5.0, reciclavel: 1.5, eletronico: 0.3 },
  { dia: 'Dom', volume: 2.1, organico: 1.5, reciclavel: 0.5, eletronico: 0.1 },
];

const totalSemana = extratoData.reduce((sum, day) => sum + day.volume, 0);
const maxVolume = Math.max(...extratoData.map(d => d.volume));

const totaisPorTipo = extratoData.reduce((acc, day) => ({
    organico: acc.organico + day.organico,
    reciclavel: acc.reciclavel + day.reciclavel,
    eletronico: acc.eletronico + day.eletronico,
}), { organico: 0, reciclavel: 0, eletronico: 0 });

const tipoCor = {
  'Orgânico': '#27ae60', // Verde
  'Reciclável': '#f1c40f', // Amarelo
  'Eletrônico': '#3498db', // Azul
};

const Bar = ({ dia, volume, maxVolume }) => {
  const maxHeight = 150; 
  const height = (volume / maxVolume) * maxHeight;

  return (
    <View style={styles.barContainer}>
      <Text style={styles.barValue}>{volume.toFixed(1)}kg</Text>
      <View style={[styles.bar, { height: height, backgroundColor: '#0097e6' }]} />
      <Text style={styles.barLabel}>{dia}</Text>
    </View>
  );
};

const TipoResumoItem = ({ tipo, total, cor }) => (
    <View style={styles.resumoItem}>
        <View style={[styles.resumoCor, { backgroundColor: cor }]} />
        <Text style={styles.resumoTipo}>{tipo}:</Text>
        <Text style={styles.resumoTotal}>{total.toFixed(1)} kg</Text>
    </View>
);

export default function ExtratoScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        
        {/*MAPA INTERATIVO*/}
        <Text style={styles.sectionTitle}>Última Rota Realizada</Text>
        <RotaMapa />

        <Text style={styles.sectionTitle}>Extrato Semanal de Lixo</Text>
        <Text style={styles.totalText}>
          Total coletado na semana: <Text style={styles.totalValue}>{totalSemana.toFixed(1)} kg</Text>
        </Text>

        {/*Gráfico de Barras*/}
        <View style={styles.chartArea}>
          {extratoData.map((data) => (
            <Bar key={data.dia} dia={data.dia} volume={data.volume} maxVolume={maxVolume} />
          ))}
        </View>

        {/*Tipo de Resíduo*/}
        <View style={styles.resumoCard}>
            <Text style={styles.resumoTitle}>Detalhamento por Tipo</Text>
            <TipoResumoItem tipo="Orgânico" total={totaisPorTipo.organico} cor={tipoCor['Orgânico']} />
            <TipoResumoItem tipo="Reciclável" total={totaisPorTipo.reciclavel} cor={tipoCor['Reciclável']} />
            <TipoResumoItem tipo="Eletrônico" total={totaisPorTipo.eletronico} cor={tipoCor['Eletrônico']} />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f6fa' },
  container: { padding: 20, alignItems: 'center' },
  
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#2f3640', 
    marginBottom: 10,
    alignSelf: 'flex-start',
  },

  title: { fontSize: 22, fontWeight: '700', color: '#2f3640', marginBottom: 5 },
  totalText: { fontSize: 16, color: '#636e72', marginBottom: 20, },
  totalValue: { fontWeight: '700', color: '#2f3640', },
  
  chartArea: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    width: '100%',
    height: 200,
    paddingHorizontal: 10,
    paddingBottom: 10,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  barContainer: { alignItems: 'center', justifyContent: 'flex-end', height: '100%', },
  bar: { width: 25, borderRadius: 4, },
  barLabel: { marginTop: 5, fontSize: 12, fontWeight: '600', color: '#636e72', },
  barValue: { position: 'absolute', top: 5, fontSize: 12, fontWeight: 'bold', color: '#2f3640', },

  resumoCard: {
    width: '100%',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  resumoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2f3640',
    marginBottom: 10,
  },
  resumoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  resumoCor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  resumoTipo: {
    fontSize: 16,
    color: '#636e72',
    flex: 1,
  },
  resumoTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2f3640',
  },
  
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 5,
    color: '#e65100',
  },
  infoText: {
    fontSize: 14,
    color: '#e65100',
  },
});