import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import { Accelerometer } from 'expo-sensors';

export default function CardioTracker() {
  const [route, setRoute] = useState<Location.LocationObjectCoords[]>([]);
  const [distance, setDistance] = useState(0); // in meters
  const [accelerometerData, setAccelerometerData] = useState({ x: 0, y: 0, z: 0 });
  const [errorMsg, setErrorMsg] = useState('');

  // Request location permissions and start GPS tracking
  useEffect(() => {
    let locationSubscriber: Location.LocationSubscription;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      locationSubscriber = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Highest,
          timeInterval: 1000, // every 1 sec
          distanceInterval: 1, // every 1 meter
        },
        (loc) => {
          setRoute((prev) => {
            const updated = [...prev, loc.coords];
            if (prev.length > 0) {
              const last = prev[prev.length - 1];
              const dist = getDistanceFromLatLonInMeters(last, loc.coords);
              setDistance((d) => d + dist);
            }
            return updated;
          });
        }
      );
    })();

    return () => {
      locationSubscriber?.remove();
    };
  }, []);

  // Start accelerometer
  useEffect(() => {
    Accelerometer.setUpdateInterval(1000); // 1 second
    const subscription = Accelerometer.addListener((data) => {
      setAccelerometerData(data);
    });

    return () => subscription.remove();
  }, []);

  // Helper function to calculate distance between two GPS points
  function getDistanceFromLatLonInMeters(coord1: Location.LocationObjectCoords, coord2: Location.LocationObjectCoords) {
    const R = 6371000; // Radius of Earth in meters
    const dLat = deg2rad(coord2.latitude - coord1.latitude);
    const dLon = deg2rad(coord2.longitude - coord1.longitude);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(coord1.latitude)) *
        Math.cos(deg2rad(coord2.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cardio Tracker</Text>
      {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

      <Text style={styles.label}>Distance:</Text>
      <Text style={styles.value}>{(distance / 1000).toFixed(2)} km</Text>

      <Text style={styles.label}>Route points:</Text>
      <Text style={styles.value}>{route.length}</Text>

      <Text style={styles.label}>Accelerometer:</Text>
      <Text style={styles.value}>
        x: {accelerometerData.x.toFixed(2)} | y: {accelerometerData.y.toFixed(2)} | z: {accelerometerData.z.toFixed(2)}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginTop: 15,
  },
  value: {
    fontSize: 16,
    color: '#333',
    marginTop: 5,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});
