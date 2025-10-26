import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps'; 

// Dados de Exemplo
const pontosColeta = {
  A: { latitude: -22.9519, longitude: -43.2105, title: 'Início (Base)' },
  B: { latitude: -22.9550, longitude: -43.2150, title: 'Ponto B - Orgânico' },
  C: { latitude: -22.9480, longitude: -43.2050, title: 'Ponto C - Reciclável' },
  D: { latitude: -22.9580, longitude: -43.2000, title: 'Ponto D - Eletrônico' },
  E: { latitude: -22.9600, longitude: -43.2180, title: 'Ponto E - Orgânico' },
};

const rotaSimulada = [
  pontosColeta.A,
  pontosColeta.D,
  pontosColeta.C,
  pontosColeta.E,
];

const interpolate = (p1, p2, factor) => ({
    latitude: p1.latitude + (p2.latitude - p1.latitude) * factor,
    longitude: p1.longitude + (p2.longitude - p1.longitude) * factor,
});

export default function RotaMapa() {
  const [currentPosition, setCurrentPosition] = useState(rotaSimulada[0]);
  const [segmentIndex, setSegmentIndex] = useState(0);
  const [progress, setProgress] = useState(0); // 0.0 a 1.0

  //SIMULAÇÃO DE MOVIMENTO
  useEffect(() => {
    let interval = null;

    if (segmentIndex < rotaSimulada.length - 1) {
        interval = setInterval(() => {
            setProgress(p => {
                const newProgress = p + 0.02; // Aumenta 2% a cada 100ms
                if (newProgress >= 1) {
                    setSegmentIndex(s => s + 1);
                    return 0; 
                }
                return newProgress;
            });
        }, 100);
    } else {
        clearInterval(interval);
        setCurrentPosition(rotaSimulada[rotaSimulada.length - 1]);
    }

    return () => clearInterval(interval);
  }, [segmentIndex]);


  useEffect(() => {
    if (segmentIndex < rotaSimulada.length - 1) {
        const startPoint = rotaSimulada[segmentIndex];
        const endPoint = rotaSimulada[segmentIndex + 1];
        
        const newPosition = interpolate(startPoint, endPoint, progress);
        setCurrentPosition(newPosition);
    }
  }, [segmentIndex, progress]);


  const initialRegion = {
    latitude: -22.95, 
    longitude: -43.21,
    latitudeDelta: 0.03,
    longitudeDelta: 0.03,
  };

  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map}
        initialRegion={initialRegion}
      >
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

        {currentPosition && (
            <Marker
                coordinate={currentPosition}
                title="Veículo de Coleta (Tempo Real)"
                pinColor="#e65100" 
            />
        )}


        <Polyline
          coordinates={rotaSimulada}
          strokeColor="#0097e6" 
          strokeWidth={4}
        />

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
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});