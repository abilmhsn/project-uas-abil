"use client"

// App.tsx
import { useState, useEffect } from "react"
import { NavigationContainer, DefaultTheme } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { StatusBar } from "expo-status-bar"
import { View, Text, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"

// Import screens Anda
import ProfileScreen from "./screens/ProfileScreen"
import SettingsScreen from "./screens/SettingsScreen"
import AboutScreen from "./screens/AboutScreen"
import HomeStack from "./screens/HomeStack"
import DashboardScreen from "./screens/DashboardScreen"
import AuthNavigator from "./src/navigation/AuthStack"

// Import Firebase auth instance
import { auth } from "./firebaseConfig"
import { onAuthStateChanged, type User } from "firebase/auth"

const Tab = createBottomTabNavigator()

export type AppTabParamList = {
  Shop: undefined
  HomeStack: undefined
  Profile: undefined
  About: undefined
  Settings: undefined
}

// Definisikan warna background global
const GLOBAL_BACKGROUND_COLOR = "#f5f5f5"

// Buat custom theme berdasarkan DefaultTheme
const CustomTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: GLOBAL_BACKGROUND_COLOR,
    card: GLOBAL_BACKGROUND_COLOR,
    primary: "#e44f31",
    border: "#e44f31",
  },
}

function AppRoutes() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed:", user?.email || "No user")
      setUser(user)
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    )
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <AuthNavigator />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap
            if (route.name === "Shop") {
              iconName = focused ? "pricetags" : "pricetags-outline"
            } else if (route.name === "HomeStack") {
              iconName = focused ? "home" : "home-outline"
            } else if (route.name === "Profile") {
              iconName = focused ? "person" : "person-outline"
            } else if (route.name === "Settings") {
              iconName = focused ? "settings" : "settings-outline"
            } else if (route.name === "About") {
              iconName = focused ? "information-circle" : "information-circle-outline"
            } else {
              iconName = "home-outline"
            }
            return <Ionicons name={iconName} size={size} color={color} />
          },
          tabBarActiveTintColor: "#010101",
          tabBarInactiveTintColor: "black",
          headerShown: false,
          tabBarStyle: {
            backgroundColor: GLOBAL_BACKGROUND_COLOR,
            borderTopColor: "#010101",
            borderTopWidth: 1,
          },
        })}
      >
        <Tab.Screen name="HomeStack" component={HomeStack} options={{ title: "Dashboard" }} />
        <Tab.Screen name="Shop" component={DashboardScreen} options={{ title: "Shop" }} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen name="About" component={AboutScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </View>
  )
}

export default function App() {
  return (
    <View style={styles.container}>
      <NavigationContainer theme={CustomTheme}>
        <StatusBar style="auto" backgroundColor={GLOBAL_BACKGROUND_COLOR} />
        <AppRoutes />
      </NavigationContainer>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GLOBAL_BACKGROUND_COLOR,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: GLOBAL_BACKGROUND_COLOR,
  },
  loadingText: {
    fontSize: 16,
    color: "#666666",
  },
})
