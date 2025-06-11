"use client"

// src/screens/SignupScreen.tsx
import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native"
import tw from "twrnc"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { AuthStackParamList } from "../src/navigation/AuthStack"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebaseConfig"

type SignupScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, "Signup">

export default function SignupScreen() {
  const navigation = useNavigation<SignupScreenNavigationProp>()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSignup = async () => {
    // Validation
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert("Error", "All fields are required.")
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address.")
      return
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.")
      return
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password should be at least 6 characters.")
      return
    }

    setLoading(true)
    try {
      console.log("Attempting to create user with:", email)
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password)
      console.log("User created successfully:", userCredential.user.email)
      Alert.alert("Success", "Account created successfully! You are now logged in.", [{ text: "OK" }])
      // Navigation will be handled automatically by onAuthStateChanged in App.tsx
    } catch (error: any) {
      console.error("Signup error:", error)
      let errorMessage = "An unexpected error occurred."

      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "An account with this email already exists."
          break
        case "auth/invalid-email":
          errorMessage = "Invalid email address."
          break
        case "auth/operation-not-allowed":
          errorMessage = "Email/password accounts are not enabled."
          break
        case "auth/weak-password":
          errorMessage = "Password is too weak. Please choose a stronger password."
          break
        case "auth/network-request-failed":
          errorMessage = "Network error. Please check your connection."
          break
        case "auth/configuration-not-found":
          errorMessage = "Firebase configuration error. Please try again."
          break
        default:
          errorMessage = error.message || "Signup failed."
      }

      Alert.alert("Signup Failed", errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView style={tw`flex-1 bg-gray-50`} contentContainerStyle={tw`flex-grow justify-center p-6`}>
      <View style={tw`items-center mb-10`}>
        <Ionicons name="pricetags-outline" size={80} color="#3B82F6" style={tw`mb-4`} />
        <Text style={tw`text-4xl font-extrabold text-gray-800`}>Join Thrift-Bill</Text>
        <Text style={tw`text-lg text-gray-600`}>Create your account to start thrifting</Text>
      </View>

      <View style={tw`bg-white rounded-xl p-8 shadow-sm`}>
        <Text style={tw`text-2xl font-bold text-gray-800 mb-6 text-center`}>Create New Account</Text>

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

        <View style={tw`mb-4`}>
          <Text style={tw`text-gray-700 text-base font-medium mb-2`}>Password</Text>
          <TextInput
            style={tw`border border-gray-300 rounded-lg p-4 text-lg text-gray-800`}
            placeholder="Create a password (min. 6 characters)"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            editable={!loading}
          />
        </View>

        <View style={tw`mb-6`}>
          <Text style={tw`text-gray-700 text-base font-medium mb-2`}>Confirm Password</Text>
          <TextInput
            style={tw`border border-gray-300 rounded-lg p-4 text-lg text-gray-800`}
            placeholder="Confirm your password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            editable={!loading}
          />
        </View>

        <TouchableOpacity
          style={tw`bg-blue-500 rounded-lg p-4 items-center mb-4 ${loading ? "opacity-70" : ""}`}
          onPress={handleSignup}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={tw`text-white text-lg font-bold`}>Sign Up</Text>}
        </TouchableOpacity>

        <View style={tw`flex-row items-center justify-center`}>
          <Text style={tw`text-gray-600`}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")} disabled={loading}>
            <Text style={tw`text-blue-500 font-bold ml-2`}>Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}
