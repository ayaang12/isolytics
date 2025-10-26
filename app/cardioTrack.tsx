import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import * as Location from "expo-location";
import { LinearGradient } from "expo-linear-gradient";

export default function CardioTracker() {
  const [history, setHistory] = useState<Array<{
    distance: string;
    time: string;
    routePoints: number;
    elevation: string;
    date: string;
  }>>([]);
  const router = useRouter();
  const [route, setRoute] = useState<Location.LocationObjectCoords[]>([]);
  const [distance, setDistance] = useState(0); // meters
  const [errorMsg, setErrorMsg] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(true);

  // Request location permissions and start GPS tracking
  useEffect(() => {
    let locationSubscriber: Location.LocationSubscription | undefined;
    let timer: ReturnType<typeof setInterval> | undefined;

    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          setTimerActive(false);
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
        setTimerActive(true);
        timer = setInterval(() => {
          setSeconds((s) => s + 1);
        }, 1000);
      } catch (err: any) {
        setErrorMsg(err?.message ?? String(err));
        setTimerActive(false);
      }
    })();

    return () => {
      try {
        locationSubscriber?.remove();
      } catch {}
      if (timer) clearInterval(timer);
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
    setSeconds(0);
    setTimerActive(false);
  };

  // Finish workout and save to local history
  const handleFinish = () => {
    const workout = {
      distance: displayDistance,
      time: formatTime(seconds),
      routePoints: route.length,
      elevation: `${elevationFeet} ft`,
      date: new Date().toLocaleString(),
    };
    setHistory((prev) => [workout, ...prev]);
    handleReset();
    setErrorMsg('Workout saved to history!');
  };

  // Format timer as mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <LinearGradient
      colors={["#000000", "#1a0033", "#2d0052"]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity
          style={{ marginTop: 40, marginLeft: 16, marginBottom: 8, alignSelf: 'flex-start', backgroundColor: '#533a80', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8 }}
          onPress={() => router.back()}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Cardio Tracker</Text>
        <View style={[styles.card, { marginBottom: 10, backgroundColor: '#2d0052' }]}> 
          <Text style={[styles.label, { color: '#fff' }]}>Elapsed Time</Text>
          <Text style={[styles.value, { color: '#fff' }]}>{formatTime(seconds)}</Text>
        </View>
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
        <TouchableOpacity style={[styles.resetButton, { backgroundColor: '#4CAF50', marginTop: 8 }]} onPress={handleFinish}>
          <Text style={styles.resetText}>Finish Workout</Text>
        </TouchableOpacity>

        {history.length > 0 && (
          <View style={{ marginTop: 24, width: '100%' }}>
            <Text style={[styles.label, { color: '#fff', fontSize: 18, marginBottom: 8 }]}>Workout History</Text>
            {history.map((h, idx) => (
              <View key={idx} style={[styles.card, { backgroundColor: '#22223b', marginBottom: 10 }]}> 
                <Text style={[styles.value, { color: '#fff' }]}>Date: {h.date}</Text>
                <Text style={styles.label}>Distance: {h.distance}</Text>
                <Text style={styles.label}>Time: {h.time}</Text>
                <Text style={styles.label}>Route Points: {h.routePoints}</Text>
                <Text style={styles.label}>Elevation: {h.elevation}</Text>
              </View>
            ))}
          </View>
        )}
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