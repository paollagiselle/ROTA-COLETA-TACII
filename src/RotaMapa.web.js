import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function RotaMapa() {
  return (
    <View style={styles.container}>
      <View style={styles.webPlaceholder}>
        <Text style={styles.webText}>
            O mapa interativo não está disponível na versão Web do Expo. 
            Execute no Android ou iOS.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        height: 300,
        width: '100%',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 20,
    },
    webPlaceholder: {
        flex: 1,
        backgroundColor: '#dfe6e9',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    webText: {
        textAlign: 'center',
        color: '#636e72',
        fontSize: 16,
        fontWeight: '600',
    }
});