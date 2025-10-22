import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import * as Location from "expo-location";
import { LinearGradient } from "expo-linear-gradient";

export default function CardioTracker() {
  const [route, setRoute] = useState<Location.LocationObjectCoords[]>([]);
  const [distance, setDistance] = useState(0); // meters
  const [errorMsg, setErrorMsg] = useState("");

  // Request location permissions and start GPS tracking
  useEffect(() => {
    let locationSubscriber: Location.LocationSubscription | undefined;

    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          return;
        }

        locationSubscriber = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.BestForNavigation,
            timeInterval: 1000, // every 1 second
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
      } catch (err: any) {
        setErrorMsg(err?.message ?? String(err));
      }
    })();

    return () => {
      try {
        locationSubscriber?.remove();
      } catch {}
    };
  }, []);

  // Distance helper
  function getDistanceFromLatLonInMeters(
    coord1: Location.LocationObjectCoords,
    coord2: Location.LocationObjectCoords
  ) {
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

  // Convert meters → feet
  const distanceFeet = distance * 3.28084;
  const displayDistance =
    distanceFeet >= 5280
      ? `${(distanceFeet / 5280).toFixed(2)} mi`
      : `${distanceFeet.toFixed(2)} ft`;

  // Elevation (feet) with null safety
  const lastPoint = route[route.length - 1];
  const elevationFeet =
    lastPoint?.altitude != null
      ? (lastPoint.altitude * 3.28084).toFixed(2)
      : "N/A";

  // Reset function
  const handleReset = () => {
    setRoute([]);
    setDistance(0);
    setErrorMsg("");
  };

  return (
    <LinearGradient
      colors={["#000000", "#1a0033", "#2d0052"]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Cardio Tracker</Text>
        {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

        <View style={styles.card}>
          <Text style={styles.label}>Distance</Text>
          <Text style={styles.value}>{displayDistance}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Route Points</Text>
          <Text style={styles.value}>{route.length}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Elevation</Text>
          <Text style={styles.value}>{elevationFeet} ft</Text>
        </View>

        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    padding: 24,
    paddingTop: 50,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 30,
  },
  error: { color: "#ef4444", marginBottom: 16, fontSize: 14 },
  card: {
    width: "100%",
    backgroundColor: "#1f2937",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#d1d5db",
    marginBottom: 8,
  },
  value: { fontSize: 20, fontWeight: "bold", color: "#ffffff" },
  resetButton: {
    backgroundColor: "#a855f7",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
    width: "100%",
  },
  resetText: { color: "#ffffff", fontSize: 16, fontWeight: "bold" },
});
