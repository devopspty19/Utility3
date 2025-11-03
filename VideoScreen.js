import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { WebView } from 'react-native-webview';
import * as ScreenOrientation from 'expo-screen-orientation';

export default function VideoScreen() {
  const [orientation, setOrientation] = useState('portrait');
  const [dimensions, setDimensions] = useState({
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  });

  useEffect(() => {
    // Detectar cambios de orientación
    const subscription = ScreenOrientation.addOrientationChangeListener((event) => {
      const orientationType = event.orientationInfo.orientation;
      
      if (
        orientationType === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
        orientationType === ScreenOrientation.Orientation.LANDSCAPE_RIGHT
      ) {
        setOrientation('landscape');
      } else {
        setOrientation('portrait');
      }
    });

    // Detectar cambios de dimensiones
    const dimensionSubscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({
        width: window.width,
        height: window.height,
      });
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const unlockOrientation = async () => {
    await ScreenOrientation.unlockAsync();
  };

  const lockPortrait = async () => {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT_UP
    );
    setOrientation('portrait');
  };

  const lockLandscape = async () => {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE
    );
    setOrientation('landscape');
  };

  // ID del video de YouTube (ejemplo: dQw4w9WgXcQ)
  // Puedes cambiar este ID por cualquier video de YouTube
  const videoId = 'dQw4w9WgXcQ';
  const videoUrl = `https://www.youtube.com/embed/${videoId}`;

  const videoHeight = orientation === 'landscape' 
    ? dimensions.height - 120 
    : 250;

  return (
    <View style={styles.container}>
      {/* Indicador de orientación */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎥 Reproductor de Video</Text>
        <View style={styles.orientationBadge}>
          <Text style={styles.orientationText}>
            {orientation === 'landscape' ? '📱 Horizontal' : '📱 Vertical'}
          </Text>
        </View>
      </View>

      {/* Reproductor de video */}
      <View style={[styles.videoContainer, { height: videoHeight }]}>
        <WebView
          style={styles.video}
          javaScriptEnabled={true}
          source={{ uri: videoUrl }}
          allowsFullscreenVideo={true}
        />
      </View>

      {/* Información */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>ℹ️ Información de Orientación</Text>
        <Text style={styles.infoText}>
          Orientación actual: <Text style={styles.bold}>{orientation.toUpperCase()}</Text>
        </Text>
        <Text style={styles.infoText}>
          Ancho: <Text style={styles.bold}>{dimensions.width.toFixed(0)}px</Text>
        </Text>
        <Text style={styles.infoText}>
          Alto: <Text style={styles.bold}>{dimensions.height.toFixed(0)}px</Text>
        </Text>
        <Text style={styles.tipText}>
          💡 Gira tu dispositivo para cambiar la orientación del video
        </Text>
      </View>

      {/* Controles de orientación */}
      <View style={styles.controlsContainer}>
        <Text style={styles.controlsTitle}>Controles Manuales:</Text>
        
        <TouchableOpacity style={styles.button} onPress={unlockOrientation}>
          <Text style={styles.buttonText}>🔓 Desbloquear Rotación</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.buttonSecondary]} 
          onPress={lockPortrait}
        >
          <Text style={styles.buttonText}>📱 Bloquear Vertical</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.buttonTertiary]} 
          onPress={lockLandscape}
        >
          <Text style={styles.buttonText}>📱 Bloquear Horizontal</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#FF6347',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  orientationBadge: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  orientationText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  videoContainer: {
    backgroundColor: 'black',
    margin: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  video: {
    flex: 1,
  },
  infoContainer: {
    backgroundColor: 'white',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  bold: {
    fontWeight: 'bold',
    color: '#333',
  },
  tipText: {
    fontSize: 13,
    color: '#4CAF50',
    marginTop: 10,
    fontStyle: 'italic',
  },
  controlsContainer: {
    padding: 15,
  },
  controlsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonSecondary: {
    backgroundColor: '#4CAF50',
  },
  buttonTertiary: {
    backgroundColor: '#FF9800',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
