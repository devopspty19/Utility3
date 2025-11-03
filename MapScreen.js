import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Network from 'expo-network';

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    checkConnectivity();
    getLocation();
  }, []);

  const checkConnectivity = async () => {
    try {
      const networkState = await Network.getNetworkStateAsync();
      setIsConnected(networkState.isConnected && networkState.isInternetReachable);
    } catch (error) {
      console.log('Error checking connectivity:', error);
    }
  };

  const getLocation = async () => {
    try {
      // Solicitar permisos de ubicación
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setErrorMsg('Permiso de ubicación denegado');
        setLoading(false);
        Alert.alert(
          'Permiso Denegado',
          'La aplicación necesita acceso a tu ubicación para funcionar'
        );
        return;
      }

      // Obtener ubicación actual
      let currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      setLoading(false);
    } catch (error) {
      setErrorMsg('Error al obtener ubicación');
      setLoading(false);
      Alert.alert('Error', 'No se pudo obtener tu ubicación');
    }
  };

  const refreshLocation = () => {
    setLoading(true);
    checkConnectivity();
    getLocation();
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4285F4" />
        <Text style={styles.loadingText}>Obteniendo ubicación...</Text>
      </View>
    );
  }

  if (errorMsg || !location) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>❌ {errorMsg || 'Error al cargar el mapa'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refreshLocation}>
          <Text style={styles.retryButtonText}>🔄 Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Banner de conectividad */}
      <View style={[styles.banner, isConnected ? styles.connected : styles.disconnected]}>
        <Text style={styles.bannerText}>
          {isConnected ? '✅ Conectado a Internet' : '❌ Sin conexión a Internet'}
        </Text>
      </View>

      {/* Mapa */}
      <MapView
        style={styles.map}
        initialRegion={location}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="Mi Ubicación"
          description="Estás aquí"
          pinColor="red"
        />
      </MapView>

      {/* Información de ubicación */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>📍 Tu Ubicación:</Text>
        <Text style={styles.infoText}>
          Latitud: {location.latitude.toFixed(6)}
        </Text>
        <Text style={styles.infoText}>
          Longitud: {location.longitude.toFixed(6)}
        </Text>
        <TouchableOpacity style={styles.refreshButton} onPress={refreshLocation}>
          <Text style={styles.refreshButtonText}>🔄 Actualizar Ubicación</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 18,
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#4285F4',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  banner: {
    paddingVertical: 12,
    paddingTop: 50,
    alignItems: 'center',
    zIndex: 1,
  },
  connected: {
    backgroundColor: '#4CAF50',
  },
  disconnected: {
    backgroundColor: '#f44336',
  },
  bannerText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  map: {
    flex: 1,
  },
  infoContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  refreshButton: {
    backgroundColor: '#4285F4',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
