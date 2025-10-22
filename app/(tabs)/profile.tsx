import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Button,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  User,
  Mail,
  Calendar,
  Ruler,
  Weight,
  LogOut,
} from "lucide-react-native";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import FieldEditorModal from "@/app/components/FieldEditorModal";
import { styles } from "./profile.styles";

interface UserProfile {
  name: string;
  age: number;
  height: number;
  weight: number;
  waist: number;
  neck: number;
  hip: number;
  created_at: string;
}

export default function Profile() {
  const { user } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const [ageModalVisible, setAgeModalVisible] = useState(false);
  const [ageInput, setAgeInput] = useState<string>("");
  const [heightModalVisible, setHeightModalVisible] = useState(false);
  const [heightInput, setHeightInput] = useState<string>("");
  const [weightModalVisible, setWeightModalVisible] = useState(false);
  const [weightInput, setWeightInput] = useState<string>("");
  const [waistModalVisible, setWaistModalVisible] = useState(false);
  const [waistInput, setWaistInput] = useState<string>("");
  const [neckModalVisible, setNeckModalVisible] = useState(false);
  const [neckInput, setNeckInput] = useState<string>("");
  const [hipModalVisible, setHipModalVisible] = useState(false);
  const [hipInput, setHipInput] = useState<string>("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (data) {
      setProfile(data);
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/auth");
  };

  if (loading) {
    return (
      <LinearGradient
        colors={["#000000", "#1a0033", "#2d0052"]}
        style={styles.container}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#a855f7" />
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#000000", "#1a0033", "#2d0052"]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <User size={48} color="#ffffff" />
          </View>
          <Text style={styles.name}>{profile?.name || "User"}</Text>
          <Text style={styles.email}>{user?.email || ""}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Mail size={20} color="#a855f7" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user?.email || "N/A"}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Calendar size={20} color="#a855f7" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Age</Text>
                <Text style={styles.infoValue}>
                  {profile?.age || "N/A"} years
                </Text>
                <Text
                  style={styles.infoLabel}
                  onPress={() => {
                    setAgeInput(profile?.age ? String(profile.age) : "");
                    setAgeModalVisible(true);
                  }}
                >
                  Edit
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ruler size={20} color="#a855f7" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Height</Text>
                <Text style={styles.infoValue}>
                  {profile?.height || "N/A"} in
                </Text>
                <Text
                  style={styles.infoLabel}
                  onPress={() => {
                    setHeightInput(
                      profile?.height ? String(profile.height) : ""
                    );
                    setHeightModalVisible(true);
                  }}
                >
                  Edit
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Weight size={20} color="#a855f7" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Weight</Text>
                <Text style={styles.infoValue}>
                  {profile?.weight || "N/A"} lbs
                </Text>
                <Text
                  style={styles.infoLabel}
                  onPress={() => {
                    setWeightInput(
                      profile?.weight ? String(profile.weight) : ""
                    );
                    setWeightModalVisible(true);
                  }}
                >
                  Edit
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ruler size={20} color="#a855f7" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Waist</Text>
                <Text style={styles.infoValue}>
                  {profile?.waist || "N/A"} in
                </Text>
                <Text
                  style={styles.infoLabel}
                  onPress={() => {
                    setWaistInput(profile?.waist ? String(profile.waist) : "");
                    setWaistModalVisible(true);
                  }}
                >
                  Edit
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ruler size={20} color="#a855f7" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Neck</Text>
                <Text style={styles.infoValue}>
                  {profile?.neck || "N/A"} in
                </Text>
                <Text
                  style={styles.infoLabel}
                  onPress={() => {
                    setNeckInput(profile?.neck ? String(profile.neck) : "");
                    setNeckModalVisible(true);
                  }}
                >
                  Edit
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ruler size={20} color="#a855f7" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Hip</Text>
                <Text style={styles.infoValue}>{profile?.hip || "N/A"} in</Text>
                <Text
                  style={styles.infoLabel}
                  onPress={() => {
                    setHipInput(profile?.hip ? String(profile.hip) : "");
                    setHipModalVisible(true);
                  }}
                >
                  Edit
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
          >
            <LogOut size={20} color="#ef4444" />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <FieldEditorModal
        visible={ageModalVisible}
        title="Edit Age"
        initialValue={ageInput}
        placeholder="Enter age"
        keyboardType="numeric"
        onCancel={() => setAgeModalVisible(false)}
        onSave={async (val) => {
          const parsed = Number(val);
          if (!val || isNaN(parsed) || parsed <= 0)
            throw new Error("Please enter a valid age.");
          if (!user) throw new Error("User not found.");
          setLoading(true);
          const { error } = await supabase
            .from("user_profiles")
            .update({ age: parsed })
            .eq("user_id", user.id);
          setLoading(false);
          if (error) throw error;
          setProfile((prev) => (prev ? { ...prev, age: parsed } : prev));
        }}
      />
      <FieldEditorModal
        visible={heightModalVisible}
        title="Edit Height (in)"
        initialValue={heightInput}
        placeholder="Enter height in in"
        keyboardType="numeric"
        onCancel={() => setHeightModalVisible(false)}
        onSave={async (val) => {
          const parsed = Number(val);
          if (!val || isNaN(parsed) || parsed <= 0)
            throw new Error("Please enter a valid height in in.");
          if (!user) throw new Error("User not found.");
          setLoading(true);
          const { error } = await supabase
            .from("user_profiles")
            .update({ height: parsed })
            .eq("user_id", user.id);
          setLoading(false);
          if (error) throw error;
          setProfile((prev) => (prev ? { ...prev, height: parsed } : prev));
        }}
      />
      <FieldEditorModal
        visible={weightModalVisible}
        title="Edit Weight (lbs)"
        initialValue={weightInput}
        placeholder="Enter weight in lbs"
        keyboardType="numeric"
        onCancel={() => setWeightModalVisible(false)}
        onSave={async (val) => {
          const parsed = Number(val);
          if (!val || isNaN(parsed) || parsed <= 0)
            throw new Error("Please enter a valid weight in lbs.");
          if (!user) throw new Error("User not found.");
          setLoading(true);
          const { error } = await supabase
            .from("user_profiles")
            .update({ weight: parsed })
            .eq("user_id", user.id);
          setLoading(false);
          if (error) throw error;
          setProfile((prev) => (prev ? { ...prev, weight: parsed } : prev));
        }}
      />
      <FieldEditorModal //waist done
        visible={waistModalVisible}
        title="Edit Waist (in)"
        initialValue={waistInput}
        placeholder="Enter waist measurement in in"
        keyboardType="numeric"
        onCancel={() => setWaistModalVisible(false)}
        onSave={async (val) => {
          const parsed = Number(val);
          if (!val || isNaN(parsed) || parsed <= 0)
            throw new Error("Please enter a valid measurement in in.");
          if (!user) throw new Error("User not found.");
          setLoading(true);
          const { error } = await supabase
            .from("user_profiles")
            .update({ waist: parsed })
            .eq("user_id", user.id);
          setLoading(false);
          if (error) throw error;
          setProfile((prev) => (prev ? { ...prev, waist: parsed } : prev));
        }}
      />
      <FieldEditorModal //neck done
        visible={neckModalVisible}
        title="Edit Neck (in)"
        initialValue={neckInput}
        placeholder="Enter neck measurement in in"
        keyboardType="numeric"
        onCancel={() => setNeckModalVisible(false)}
        onSave={async (val) => {
          const parsed = Number(val);
          if (!val || isNaN(parsed) || parsed <= 0)
            throw new Error("Please enter a valid measurement in in.");
          if (!user) throw new Error("User not found.");
          setLoading(true);
          const { error } = await supabase
            .from("user_profiles")
            .update({ neck: parsed })
            .eq("user_id", user.id);
          setLoading(false);
          if (error) throw error;
          setProfile((prev) => (prev ? { ...prev, neck: parsed } : prev));
        }}
      />
      <FieldEditorModal //hip done
        visible={hipModalVisible}
        title="Edit Hip (in)"
        initialValue={hipInput}
        placeholder="Enter hip measurement in in"
        keyboardType="numeric"
        onCancel={() => setHipModalVisible(false)}
        onSave={async (val) => {
          const parsed = Number(val);
          if (!val || isNaN(parsed) || parsed <= 0)
            throw new Error("Please enter a valid measurement in in.");
          if (!user) throw new Error("User not found.");
          setLoading(true);
          const { error } = await supabase
            .from("user_profiles")
            .update({ hip: parsed })
            .eq("user_id", user.id);
          setLoading(false);
          if (error) throw error;
          setProfile((prev) => (prev ? { ...prev, hip: parsed } : prev));
        }}
      />
    </LinearGradient>
  );
}
