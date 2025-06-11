"use client"

// App.tsx
import { useState, useEffect } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { StatusBar } from "expo-status-bar"
import { View, Text } from "react-native"
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
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    )
  }

  if (!user) {
    return <AuthNavigator />
  }

  return (
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
        tabBarActiveTintColor: "#3B82F6",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen name="HomeStack" component={HomeStack} options={{ title: "Dashboard" }} />
      <Tab.Screen name="Shop" component={DashboardScreen} options={{ title: "Shop" }} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="About" component={AboutScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  )
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <AppRoutes />
    </NavigationContainer>
  )
}
