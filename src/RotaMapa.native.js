import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps'; 

// Dados de Exemplo
const pontosColeta = {
  A: { latitude: -14.7972, longitude: -39.2734, title: 'Início (Base)' },
  B: { latitude: -14.7925, longitude: -39.2752, title: 'Ponto B - Orgânico' },
  C: { latitude: -14.7822, longitude: -39.2691, title: 'Ponto C - Reciclável' },
  D: { latitude: -14.7861, longitude: -39.2564, title: 'Ponto D - Eletrônico' },
  E: { latitude: -14.7923, longitude: -39.2825, title: 'Ponto E - Orgânico' },
};

const rotaSimulada = [ // A -> D -> C -> E
  pontosColeta.A,
  pontosColeta.D,
  pontosColeta.C,
  pontosColeta.E,
];

const interpolate = (p1, p2, factor) => ({ // Calcula o ponto intermediário entre dois pontos
    latitude: p1.latitude + (p2.latitude - p1.latitude) * factor,
    longitude: p1.longitude + (p2.longitude - p1.longitude) * factor,
});

export default function RotaMapa() {
  const [currentPosition, setCurrentPosition] = useState(rotaSimulada[0]);
  const [segmentIndex, setSegmentIndex] = useState(0); // qual trecho da rota está sendo percorrido
  const [progress, setProgress] = useState(0); // marca o progresso do caminhão

  //SIMULAÇÃO DE MOVIMENTO
  useEffect(() => {
    let interval = null;

    if (segmentIndex < rotaSimulada.length - 1) { // se aidna há trechos pra percorrer
        interval = setInterval(() => {
            setProgress(p => {
                const newProgress = p + 0.01; // Aumenta 1% a cada 100ms
                if (newProgress >= 1) { // se o trecho atual foi concluído, começa o próximo
                    setSegmentIndex(s => s + 1);
                    return 0; 
                }
                return newProgress;
            });
        }, 100);
    } else {
        clearInterval(interval); // Para a simulação (chegou ao destino final)
        setCurrentPosition(rotaSimulada[rotaSimulada.length - 1]);
    }

    return () => clearInterval(interval); // limpa o intervalo antigo toda vez que o efeito é reexecutado.
  }, [segmentIndex]);


  useEffect(() => {  // Atualiza a posição do veículo com base no progresso
    if (segmentIndex < rotaSimulada.length - 1) { // Verifica se tem trecho para andar
        const startPoint = rotaSimulada[segmentIndex];
        const endPoint = rotaSimulada[segmentIndex + 1];
        
        const newPosition = interpolate(startPoint, endPoint, progress); // Calcula a posição intermediária entre os pontos
        setCurrentPosition(newPosition);
    }
  }, [segmentIndex, progress]);


  const initialRegion = { 
    latitude: -14.79, 
    longitude: -39.27,
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