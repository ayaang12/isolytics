import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Activity, Mail, Lock, ArrowRight } from 'lucide-react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function SignInScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    const { error } = await signIn(email, password);
    
    if (error) {
      setIsLoading(false);
      Alert.alert('Error', error);
    } else {
      setIsLoading(false);
      router.replace('/(tabs)/meals');
    }
  };

  const handleSignUp = () => {
    router.push('/auth/signup');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1F2937', '#111827']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={['#8B5CF6', '#A855F7']}
              style={styles.logoGradient}
            >
              <Activity size={32} color="#FFFFFF" />
            </LinearGradient>
          </View>
          <Text style={styles.appTitle}>Isolytics</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <View style={styles.inputIcon}>
              <Mail size={20} color="#9CA3AF" />
            </View>
            <TextInput
              style={styles.textInput}
              placeholder="Email address"
              placeholderTextColor="#6B7280"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputIcon}>
              <Lock size={20} color="#9CA3AF" />
            </View>
            <TextInput
              style={styles.textInput}
              placeholder="Password"
              placeholderTextColor="#6B7280"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity 
            style={styles.signInButton} 
            onPress={handleSignIn}
            disabled={isLoading}
          >
            <LinearGradient
              colors={['#8B5CF6', '#A855F7']}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Text>
              <ArrowRight size={20} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={handleSignUp}>
            <Text style={styles.signUpLink}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  formContainer: {
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#FFFFFF',
  },
  signInButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  forgotPassword: {
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: '#A855F7',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: '#9CA3AF',
    fontSize: 16,
  },
  signUpLink: {
    color: '#A855F7',
    fontSize: 16,
    fontWeight: 'bold',
  },
});