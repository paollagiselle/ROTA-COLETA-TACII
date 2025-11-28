import React, { useState, useEffect } from 'react';
import { 
  SafeAreaView, ScrollView, StyleSheet, Text, View, Pressable, ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RotaMapa from './RotaMapa'; 
import { TIPO_COR_MAP } from './constants/data'; 
import { supabase } from './supabase'; 

// ---- LÓGICA DE CÁLCULO DE TOTAIS ----
const calcularTotais = (data) => {
  if (!data || data.length === 0) {
    return {
      totalSemana: 0,
      maxVolume: 0,
      totaisPorTipo: { organico: 0, reciclavel: 0, eletronico: 0 }
    };
  }

  const totalSemana = data.reduce((sum, d) => sum + d.volume_total, 0);
  const maxVolume = Math.max(...data.map(d => d.volume_total));

  const totaisPorTipo = data.reduce((acc, d) => ({
    organico: acc.organico + d.organico,
    reciclavel: acc.reciclavel + d.reciclavel,
    eletronico: acc.eletronico + d.eletronico,
  }), { organico: 0, reciclavel: 0, eletronico: 0 });

  return { totalSemana, maxVolume, totaisPorTipo };
};

// ---- COMPONENTE BARRA DO GRÁFICO ----
const Bar = ({ dia, volume, maxVolume, tema }) => {
  const maxHeight = 150;
  const height = maxVolume > 0 ? (volume / maxVolume) * maxHeight : 0; 

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
  const [extratoData, setExtratoData] = useState([]); 
  const [loading, setLoading] = useState(true);

  const tema = darkMode ? dark : light;

  // Efeito para buscar dados do Supabase
  useEffect(() => {
    async function fetchExtrato() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('extrato_semanal')
          .select('*')
          .order('data_registro', { ascending: true }); // Ordena por data

        if (error) throw error;
        
        setExtratoData(data);
      } catch (error) {
        console.error('Erro ao buscar extrato:', error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchExtrato();
  }, []); 


  const { totalSemana, maxVolume, totaisPorTipo } = calcularTotais(extratoData);

  if (loading) {
    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: tema.bg, justifyContent: 'center', alignItems: 'center' }]}>
            <ActivityIndicator size="large" color={tema.icon} />
            <Text style={{ color: tema.subtext, marginTop: 10 }}>Carregando extrato...</Text>
        </SafeAreaView>
    );
  }

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
            <Bar 
              key={d.dia_semana} 
              dia={d.dia_semana} 
              volume={d.volume_total} 
              maxVolume={maxVolume} 
              tema={tema} 
            />
          ))}
        </View>

        {/* Detalhamento por tipo */}
        <View style={[styles.resumoCard, { backgroundColor: tema.card, borderColor: tema.border }]}>
          <Text style={[styles.resumoTitle, { color: tema.text }]}>Detalhamento por Tipo</Text>
          <TipoResumoItem tipo="Orgânico"   total={totaisPorTipo.organico}   cor={TIPO_COR_MAP['Orgânico']}   tema={tema} />
          <TipoResumoItem tipo="Reciclavel" total={totaisPorTipo.reciclavel} cor={TIPO_COR_MAP['Reciclável']} tema={tema} />
          <TipoResumoItem tipo="Eletrônico" total={totaisPorTipo.eletronico} cor={TIPO_COR_MAP['Eletrônico']} tema={tema} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const light = {
  bg:     '#f5f6fa',
  card:   '#ffffff',
  text:   '#2f3640',
  subtext:'#636e72',
  border: '#dfe6e9',
  icon:   '#0097e6',
  accent: '#0097e6',  
};

const dark = {
  bg:     '#1e272e',
  card:   '#2f3640',
  text:   '#f5f6fa',
  subtext:'#b2bec3',
  border: '#3d3d3d',
  icon:   '#ffd32a',
  accent: '#00c6ff',  
};

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