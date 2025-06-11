"use client"

import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert } from "react-native"
import tw from "twrnc"
import { Ionicons } from "@expo/vector-icons"

export default function SettingsScreen() {
  const [settings, setSettings] = useState({
    notifications: true,
    locationServices: false,
    autoSync: true,
    biometricAuth: false,
    dataUsage: true,
  })

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const showAlert = (title: string) => {
    Alert.alert("Settings", `${title} tapped`)
  }

  const settingsGroups = [
    {
      title: "General",
      items: [
        { key: "notifications", title: "Push Notifications", icon: "notifications-outline", hasSwitch: true },
        { key: "locationServices", title: "Location Services", icon: "location-outline", hasSwitch: true },
        { key: "autoSync", title: "Auto Sync", icon: "sync-outline", hasSwitch: true },
      ],
    },
    {
      title: "Security",
      items: [
        { key: "biometricAuth", title: "Biometric Authentication", icon: "finger-print-outline", hasSwitch: true },
        { key: "changePassword", title: "Change Password", icon: "lock-closed-outline", hasSwitch: false },
        { key: "twoFactor", title: "Two-Factor Authentication", icon: "shield-checkmark-outline", hasSwitch: false },
      ],
    },
    {
      title: "Data & Storage",
      items: [
        { key: "dataUsage", title: "Mobile Data Usage", icon: "cellular-outline", hasSwitch: true },
        { key: "clearCache", title: "Clear Cache", icon: "trash-outline", hasSwitch: false },
        { key: "exportData", title: "Export Data", icon: "download-outline", hasSwitch: false },
      ],
    },
  ]

  return (
  <ScrollView style={[tw`flex-1 bg-gray-50 pt-10`]}>
      <View style={tw`p-6`}>
        {/* Header */}
        <View style={tw`bg-white rounded-xl p-6 mb-6 shadow-sm`}>
          <Text style={tw`text-2xl font-bold text-gray-800 mb-2`}>Settings</Text>
          <Text style={tw`text-gray-600 text-base`}>Manage your app preferences and account settings</Text>
        </View>

        {/* Settings Groups */}
        {settingsGroups.map((group, groupIndex) => (
          <View key={groupIndex} style={tw`bg-white rounded-xl p-6 mb-4 shadow-sm`}>
            <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>{group.title}</Text>

            {group.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={item.key}
                style={tw`flex-row items-center py-4 ${itemIndex < group.items.length - 1 ? "border-b border-gray-100" : ""}`}
                onPress={() => !item.hasSwitch && showAlert(item.title)}
              >
                <View style={tw`w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-4`}>
                  <Ionicons name={item.icon as any} size={20} color="#3B82F6" />
                </View>

                <Text style={tw`text-gray-800 font-medium flex-1`}>{item.title}</Text>

                {item.hasSwitch ? (
                  <Switch
                    value={settings[item.key as keyof typeof settings] as boolean}
                    onValueChange={() => toggleSetting(item.key as keyof typeof settings)}
                    trackColor={{ false: "#E5E7EB", true: "#3B82F6" }}
                    thumbColor="#FFFFFF"
                  />
                ) : (
                  <Ionicons name="chevron-forward-outline" size={20} color="#9CA3AF" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* App Info */}
        <View style={tw`bg-white rounded-xl p-6 mb-4 shadow-sm`}>
          <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>App Information</Text>

          <View style={tw`flex-row justify-between py-3 border-b border-gray-100`}>
            <Text style={tw`text-gray-600`}>Version</Text>
            <Text style={tw`text-gray-800 font-medium`}>1.0.0</Text>
          </View>

          <View style={tw`flex-row justify-between py-3 border-b border-gray-100`}>
            <Text style={tw`text-gray-600`}>Build Number</Text>
            <Text style={tw`text-gray-800 font-medium`}>2024.1</Text>
          </View>

          <TouchableOpacity style={tw`flex-row justify-between py-3`} onPress={() => showAlert("Check for Updates")}>
            <Text style={tw`text-gray-600`}>Check for Updates</Text>
            <Ionicons name="chevron-forward-outline" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Reset Settings */}
        <TouchableOpacity
          style={tw`bg-red-500 rounded-xl p-4 items-center shadow-sm`}
          onPress={() => Alert.alert("Reset Settings", "Are you sure you want to reset all settings to default?")}
        >
          <Text style={tw`text-white font-bold text-base`}>Reset All Settings</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}
