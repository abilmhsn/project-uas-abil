"use client"

import { View, Text, ScrollView, TouchableOpacity, Button, Image, Switch, Alert } from "react-native"
import { useState, useEffect } from "react"
import tw from "twrnc"
import { Ionicons } from "@expo/vector-icons"
import { auth } from "../firebaseConfig"
import { onAuthStateChanged, signOut } from "firebase/auth"
import AddTransactionModal from "@/components/TransactionModal"

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [darkModeEnabled, setDarkModeEnabled] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email)
      }
    })
    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut(auth)
            console.log("User logged out successfully")
          } catch (error) {
            console.error("Logout error:", error)
            Alert.alert("Error", "Failed to logout. Please try again.")
          }
        },
      },
    ])
  }

  const menuItems = [
    { id: 1, title: "Edit Profile", icon: "person-outline", color: "#3B82F6" },
    { id: 2, title: "Privacy Settings", icon: "shield-outline", color: "#10B981" },
    { id: 3, title: "Help & Support", icon: "help-circle-outline", color: "#F59E0B" },
    { id: 4, title: "Terms of Service", icon: "document-text-outline", color: "#6B7280" },
  ]

  return (
    <ScrollView style={[tw`flex-1 bg-gray-50`, { paddingTop: 50 }]}>
      <View style={tw`p-6`}>
        {/* Profile Header */}
        <AddTransactionModal visible={modalVisible} onClose={() => setModalVisible(false)} />
        <Button title="Tambah Transaksi" onPress={() => setModalVisible(true)} />

        <View style={tw`bg-white rounded-xl p-6 mb-6 shadow-sm items-center`}>
          <Image source={{ uri: "https://github.com/octocat.png" }} style={tw`w-24 h-24 rounded-full mb-4`} />
          <Text style={tw`text-2xl font-bold text-gray-800 mb-1`}>Abil</Text>
          <Text style={tw`text-gray-600 text-base mb-4`}>{userEmail || "user@example.com"}</Text>
          <TouchableOpacity style={tw`bg-blue-500 px-6 py-2 rounded-full`}>
            <Text style={tw`text-white font-medium`}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Settings Section */}
        <View style={tw`bg-white rounded-xl p-6 mb-6 shadow-sm`}>
          <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>Preferences</Text>

          <View style={tw`flex-row items-center justify-between py-3 border-b border-gray-100`}>
            <View style={tw`flex-row items-center`}>
              <Ionicons name="notifications-outline" size={24} color="#3B82F6" />
              <Text style={tw`text-gray-800 font-medium ml-3`}>Push Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: "#E5E7EB", true: "#3B82F6" }}
              thumbColor={notificationsEnabled ? "#FFFFFF" : "#FFFFFF"}
            />
          </View>

          <View style={tw`flex-row items-center justify-between py-3`}>
            <View style={tw`flex-row items-center`}>
              <Ionicons name="moon-outline" size={24} color="#6B7280" />
              <Text style={tw`text-gray-800 font-medium ml-3`}>Dark Mode</Text>
            </View>
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{ false: "#E5E7EB", true: "#3B82F6" }}
              thumbColor={darkModeEnabled ? "#FFFFFF" : "#FFFFFF"}
            />
          </View>
        </View>

        {/* Menu Items */}
        <View style={tw`bg-white rounded-xl p-6 mb-6 shadow-sm`}>
          <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>Account</Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={tw`flex-row items-center py-4 ${index < menuItems.length - 1 ? "border-b border-gray-100" : ""}`}
            >
              <View
                style={[
                  tw`w-10 h-10 rounded-full items-center justify-center mr-3`,
                  { backgroundColor: item.color + "20" },
                ]}
              >
                <Ionicons name={item.icon as any} size={20} color={item.color} />
              </View>
              <Text style={tw`text-gray-800 font-medium flex-1`}>{item.title}</Text>
              <Ionicons name="chevron-forward-outline" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={tw`bg-red-500 rounded-xl p-4 items-center shadow-sm mb-10`} onPress={handleLogout}>
          <Text style={tw`text-white font-bold text-base`}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}
