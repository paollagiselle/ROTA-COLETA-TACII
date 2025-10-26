import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RotaMapa from './RotaMapa'; // Expo resolve .web.js ou .native.js

// ---- DADOS DE EXEMPLO ----
const extratoData = [
  { dia: 'Seg', volume: 8.5,  organico: 5.0,  reciclavel: 3.0, eletronico: 0.5 },
  { dia: 'Ter', volume: 15.0, organico: 8.0,  reciclavel: 6.0, eletronico: 1.0 },
  { dia: 'Qua', volume: 5.0,  organico: 3.5,  reciclavel: 1.0, eletronico: 0.5 },
  { dia: 'Qui', volume: 11.2, organico: 7.0,  reciclavel: 4.0, eletronico: 0.2 },
  { dia: 'Sex', volume: 18.0, organico: 10.0, reciclavel: 7.0, eletronico: 1.0 },
  { dia: 'Sáb', volume: 6.8,  organico: 5.0,  reciclavel: 1.5, eletronico: 0.3 },
  { dia: 'Dom', volume: 2.1,  organico: 1.5,  reciclavel: 0.5, eletronico: 0.1 },
];

const totalSemana = extratoData.reduce((sum, d) => sum + d.volume, 0);
const maxVolume   = Math.max(...extratoData.map(d => d.volume));

const totaisPorTipo = extratoData.reduce((acc, d) => ({
  organico:   acc.organico   + d.organico,
  reciclavel: acc.reciclavel + d.reciclavel,
  eletronico: acc.eletronico + d.eletronico,
}), { organico: 0, reciclavel: 0, eletronico: 0 });

const tipoCor = {
  'Orgânico':   '#27ae60',
  'Reciclável': '#f1c40f',
  'Eletrônico': '#3498db',
};

// ---- COMPONENTE BARRA DO GRÁFICO ----
const Bar = ({ dia, volume, maxVolume, tema }) => {
  const maxHeight = 150;
  const height = (volume / maxVolume) * maxHeight;

  return (
    <View style={styles.barContainer}>
      <Text style={[styles.barValue, { color: tema.text }]}>{volume.toFixed(1)}kg</Text>
      <View style={[styles.bar, { height, backgroundColor: tema.accent }]} />
      <Text style={[styles.barLabel, { color: tema.subtext }]}>{dia}</Text>
    </View>
  );
};

// ---- TIPO DE RESUMO ----
const TipoResumoItem = ({ tipo, total, cor, tema }) => (
  <View style={styles.resumoItem}>
    <View style={[styles.resumoCor, { backgroundColor: cor }]} />
    <Text style={[styles.resumoTipo, { color: tema.subtext }]}>{tipo}:</Text>
    <Text style={[styles.resumoTotal, { color: tema.text }]}>{total.toFixed(1)} kg</Text>
  </View>
);

export default function ExtratoScreen() {
  const [darkMode, setDarkMode] = useState(false);

  const tema = darkMode ? dark : light;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: tema.bg }]}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header com ícone para alternar o tema */}
        <View style={styles.header}>
          <Text style={[styles.screenTitle, { color: tema.text }]}>Extrato</Text>
          <Pressable onPress={() => setDarkMode(v => !v)}>
            <Ionicons name={darkMode ? 'moon' : 'sunny'} size={24} color={tema.icon} />
          </Pressable>
        </View>

        {/* Mapa */}
        <Text style={[styles.sectionTitle, { color: tema.text }]}>Última Rota Realizada</Text>
        <View style={[styles.card, { backgroundColor: tema.card, borderColor: tema.border }]}>
          <RotaMapa />
        </View>

        {/* Total da semana */}
        <Text style={[styles.sectionTitle, { color: tema.text }]}>Extrato Semanal de Lixo</Text>
        <Text style={[styles.totalText, { color: tema.subtext }]}>
          Total coletado na semana: <Text style={[styles.totalValue, { color: tema.text }]}>{totalSemana.toFixed(1)} kg</Text>
        </Text>

        {/* Gráfico de barras */}
        <View style={[styles.chartArea, { backgroundColor: tema.card, borderColor: tema.border }]}>
          {extratoData.map((d) => (
            <Bar key={d.dia} dia={d.dia} volume={d.volume} maxVolume={maxVolume} tema={tema} />
          ))}
        </View>

        {/* Detalhamento por tipo */}
        <View style={[styles.resumoCard, { backgroundColor: tema.card, borderColor: tema.border }]}>
          <Text style={[styles.resumoTitle, { color: tema.text }]}>Detalhamento por Tipo</Text>
          <TipoResumoItem tipo="Orgânico"   total={totaisPorTipo.organico}   cor={tipoCor['Orgânico']}   tema={tema} />
          <TipoResumoItem tipo="Reciclável" total={totaisPorTipo.reciclavel} cor={tipoCor['Reciclável']} tema={tema} />
          <TipoResumoItem tipo="Eletrônico" total={totaisPorTipo.eletronico} cor={tipoCor['Eletrônico']} tema={tema} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* Temas */
const light = {
  bg:     '#f5f6fa',
  card:   '#ffffff',
  text:   '#2f3640',
  subtext:'#636e72',
  border: '#dfe6e9',
  icon:   '#0097e6',
  accent: '#0097e6',  // barras do gráfico
};

const dark = {
  bg:     '#1e272e',
  card:   '#2f3640',
  text:   '#f5f6fa',
  subtext:'#b2bec3',
  border: '#3d3d3d',
  icon:   '#ffd32a',
  accent: '#00c6ff',  // barras no dark
};

/* Estilos base */
const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: 20, alignItems: 'center' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 12,
  },
  screenTitle: { fontSize: 18, fontWeight: '700' },

  sectionTitle: { 
    fontSize: 18, fontWeight: '700', marginBottom: 10, alignSelf: 'flex-start',
  },

  card: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    padding: 6,
    marginBottom: 18,
  },

  totalText: { fontSize: 16, marginBottom: 20 },
  totalValue: { fontWeight: '700' },

  chartArea: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    width: '100%',
    height: 200,
    paddingHorizontal: 10,
    paddingBottom: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  barContainer: { alignItems: 'center', justifyContent: 'flex-end', height: '100%' },
  bar: { width: 25, borderRadius: 4 },
  barLabel: { marginTop: 5, fontSize: 12, fontWeight: '600' },
  barValue: { position: 'absolute', top: 5, fontSize: 12, fontWeight: 'bold' },

  resumoCard: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  resumoTitle: { fontSize: 18, fontWeight: '700', marginBottom: 10 },
  resumoItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 5 },
  resumoCor: { width: 12, height: 12, borderRadius: 6, marginRight: 10 },
  resumoTipo: { fontSize: 16, flex: 1 },
  resumoTotal: { fontSize: 16, fontWeight: '700' },
});
