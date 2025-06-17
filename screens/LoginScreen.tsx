"use client"

// src/screens/LoginScreen.tsx
import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native"
import tw from "twrnc"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { AuthStackParamList } from "../src/navigation/AuthStack"
import { auth } from "../firebaseConfig"
import { signInWithEmailAndPassword } from "firebase/auth"

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, "Login">

export default function LoginScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Email and password cannot be empty.")
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address.")
      return
    }

    setLoading(true)
    try {
      console.log("Attempting to sign in with:", email)
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password)
      console.log("User logged in successfully:", userCredential.user.email)
      // Navigation will be handled automatically by onAuthStateChanged in App.tsx
    } catch (error: any) {
      console.error("Login error:", error)
      let errorMessage = "An unexpected error occurred."

      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "No account found with this email address."
          break
        case "auth/wrong-password":
        case "auth/invalid-credential":
          errorMessage = "Incorrect email or password."
          break
        case "auth/invalid-email":
          errorMessage = "Invalid email address."
          break
        case "auth/user-disabled":
          errorMessage = "This account has been disabled."
          break
        case "auth/too-many-requests":
          errorMessage = "Too many failed attempts. Please try again later."
          break
        case "auth/network-request-failed":
          errorMessage = "Network error. Please check your connection."
          break
        case "auth/configuration-not-found":
          errorMessage = "Firebase configuration error. Please try again."
          break
        default:
          errorMessage = error.message || "Login failed."
      }

      Alert.alert("Login Failed", errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView style={tw`flex-1 bg-gray-50`} contentContainerStyle={tw`flex-grow justify-center p-6`}>
      <View style={tw`items-center mb-10`}>
        <Ionicons name="pricetags-outline" size={80} color="#3B82F6" style={tw`mb-4`} />
        <Text style={tw`text-4xl font-extrabold text-gray-800`}>Cabibul-Thrift</Text>
        <Text style={tw`text-lg text-gray-600`}>E-commerce Thrifting</Text>
      </View>

      <View style={tw`bg-white rounded-xl p-8 shadow-sm`}>
        <Text style={tw`text-2xl font-bold text-gray-800 mb-6 text-center`}>Login to Your Account</Text>

        <View style={tw`mb-4`}>
          <Text style={tw`text-gray-700 text-base font-medium mb-2`}>Email Address</Text>
          <TextInput
            style={tw`border border-gray-300 rounded-lg p-4 text-lg text-gray-800`}
            placeholder="Enter your email"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
            editable={!loading}
          />
        </View>

        <View style={tw`mb-6`}>
          <Text style={tw`text-gray-700 text-base font-medium mb-2`}>Password</Text>
          <TextInput
            style={tw`border border-gray-300 rounded-lg p-4 text-lg text-gray-800`}
            placeholder="Enter your password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            editable={!loading}
          />
        </View>

        <TouchableOpacity
          style={tw`bg-blue-500 rounded-lg p-4 items-center mb-4 ${loading ? "opacity-70" : ""}`}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={tw`text-white text-lg font-bold`}>Log In</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={tw`mb-6`} disabled={loading}>
          <Text style={tw`text-blue-500 text-base text-center font-medium`}>Forgot Password?</Text>
        </TouchableOpacity>

        <View style={tw`flex-row items-center justify-center`}>
          <Text style={tw`text-gray-600`}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Signup")} disabled={loading}>
            <Text style={tw`text-blue-500 font-bold ml-2`}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}
