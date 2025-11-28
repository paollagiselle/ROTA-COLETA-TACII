import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps'; 
import { supabase } from './supabase'; // Importa a conexão Supabase

export default function RotaMapa() {
  const [pontosColeta, setPontosColeta] = useState({});
  const [loading, setLoading] = useState(true);

  // EFEITO PARA CARREGAR AS COORDENADAS DO SUPABASE
  useEffect(() => {
    async function fetchCoordenadas() {
        try {
            const { data, error } = await supabase
                .from('coordenadas_pontos')
                .select('ponto, latitude, longitude, titulo');

            if (error) throw error;

            const coordenadasMapeadas = {};
            data.forEach(item => {
                coordenadasMapeadas[item.ponto] = {
                    latitude: item.latitude,
                    longitude: item.longitude,
                    title: item.titulo,
                };
            });
            setPontosColeta(coordenadasMapeadas);
        } catch (error) {
            console.error('Erro ao carregar coordenadas:', error.message);
            Alert.alert("Erro de Conexão", "Não foi possível carregar as coordenadas do mapa.");
        } finally {
            setLoading(false);
        }
    }
    fetchCoordenadas();
  }, []); 

  const rotaSimuladaKeys = ['A', 'D', 'C', 'E'];
  const rotaSimulada = rotaSimuladaKeys
    .map(key => pontosColeta[key])
    .filter(point => point !== undefined); // Filtra para garantir que o ponto exista

  if (loading || Object.keys(pontosColeta).length === 0) {
    return (
        <View style={styles.container}>
             <ActivityIndicator size="large" color="#0097e6" style={styles.loading} />
             <Text style={styles.loadingText}>Carregando mapa...</Text>
        </View>
    );
  }
  
  // Região inicial baseada no ponto de início 'A'
  const pontoA = pontosColeta['A'];
  const initialRegion = {
    latitude: pontoA.latitude, 
    longitude: pontoA.longitude,
    latitudeDelta: 0.03,
    longitudeDelta: 0.03,
  };

  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map}
        initialRegion={initialRegion}
      >
        {/* Marcadores dos Pontos de Coleta */}
        {Object.keys(pontosColeta).map((key) => {
          const ponto = pontosColeta[key];
          return (
            <Marker
              key={key}
              coordinate={ponto}
              title={ponto.title}
              pinColor={key === 'A' ? '#0097e6' : '#2ecc71'} 
            />
          );
        })}

        {rotaSimulada.length > 1 && (
            <Polyline
              coordinates={rotaSimulada}
              strokeColor="#e65100" 
              strokeWidth={4}
            />
        )}

      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 300, 
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden', 
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
    justifyContent: 'center', 
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loading: {
    paddingVertical: 10,
  },
  loadingText: {
    textAlign: 'center',
    color: '#636e72',
    marginTop: 5,
  }
});