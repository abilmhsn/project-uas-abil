import { View, Text, ScrollView, TouchableOpacity, Linking } from "react-native"
import tw from "twrnc"
import { Ionicons } from "@expo/vector-icons"

export default function AbilScreen() {
  const openLink = (url: string) => {
    Linking.openURL(url)
  }

  const teamMembers = [
    { name: "John Smith", role: "Lead Developer", avatar: "/placeholder.svg?height=60&width=60" },
    { name: "Sarah Johnson", role: "UI/UX Designer", avatar: "/placeholder.svg?height=60&width=60" },
    { name: "Mike Chen", role: "Backend Developer", avatar: "/placeholder.svg?height=60&width=60" },
  ]

  const features = [
    "Cross-platform compatibility",
    "Real-time synchronization",
    "Secure data encryption",
    "Offline functionality",
    "Push notifications",
    "Analytics dashboard",
  ]

  return (
    <ScrollView style={tw`flex-1 bg-gray-50 pt-10`}>
      <View style={tw`p-6`}>
        {/* App Info Header */}
        <View style={tw`bg-white rounded-xl p-6 mb-6 shadow-sm items-center`}>
          <View style={tw`w-20 h-20 bg-blue-500 rounded-xl items-center justify-center mb-4`}>
            <Ionicons name="phone-portrait-outline" size={40} color="white" />
          </View>
          <Text style={tw`text-2xl font-bold text-gray-800 mb-2`}>My Expo App</Text>
          <Text style={tw`text-gray-600 text-base mb-2`}>Version 1.0.0</Text>
          <Text style={tw`text-gray-500 text-sm text-center`}>
            A modern React Native application built with Expo and styled with Tailwind CSS
          </Text>
        </View>

        {/* Features */}
        <View style={tw`bg-white rounded-xl p-6 mb-6 shadow-sm`}>
          <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>Key Features</Text>
          {features.map((feature, index) => (
            <View key={index} style={tw`flex-row items-center py-2`}>
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              <Text style={tw`text-gray-700 ml-3`}>{feature}</Text>
            </View>
          ))}
        </View>

        {/* Team */}
        <View style={tw`bg-white rounded-xl p-6 mb-6 shadow-sm`}>
          <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>Development Team</Text>
          {teamMembers.map((member, index) => (
            <View
              key={index}
              style={tw`flex-row items-center py-3 ${index < teamMembers.length - 1 ? "border-b border-gray-100" : ""}`}
            >
              <View style={tw`w-12 h-12 bg-gray-200 rounded-full items-center justify-center mr-4`}>
                <Ionicons name="person" size={24} color="#6B7280" />
              </View>
              <View>
                <Text style={tw`text-gray-800 font-medium`}>{member.name}</Text>
                <Text style={tw`text-gray-500 text-sm`}>{member.role}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Contact & Links */}
        <View style={tw`bg-white rounded-xl p-6 mb-6 shadow-sm`}>
          <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>Get in Touch</Text>

          <TouchableOpacity
            style={tw`flex-row items-center py-3 border-b border-gray-100`}
            onPress={() => openLink("mailto:support@example.com")}
          >
            <Ionicons name="mail-outline" size={24} color="#3B82F6" />
            <Text style={tw`text-gray-800 font-medium ml-3 flex-1`}>support@example.com</Text>
            <Ionicons name="open-outline" size={16} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`flex-row items-center py-3 border-b border-gray-100`}
            onPress={() => openLink("https://example.com")}
          >
            <Ionicons name="globe-outline" size={24} color="#10B981" />
            <Text style={tw`text-gray-800 font-medium ml-3 flex-1`}>www.example.com</Text>
            <Ionicons name="open-outline" size={16} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`flex-row items-center py-3`}
            onPress={() => openLink("https://github.com/example/repo")}
          >
            <Ionicons name="logo-github" size={24} color="#6B7280" />
            <Text style={tw`text-gray-800 font-medium ml-3 flex-1`}>GitHub Repository</Text>
            <Ionicons name="open-outline" size={16} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Legal */}
        <View style={tw`bg-white rounded-xl p-6 mb-6 shadow-sm`}>
          <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>Legal</Text>

          <TouchableOpacity style={tw`flex-row items-center justify-between py-3 border-b border-gray-100`}>
            <Text style={tw`text-gray-800 font-medium`}>Privacy Policy</Text>
            <Ionicons name="chevron-forward-outline" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={tw`flex-row items-center justify-between py-3 border-b border-gray-100`}>
            <Text style={tw`text-gray-800 font-medium`}>Terms of Service</Text>
            <Ionicons name="chevron-forward-outline" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={tw`flex-row items-center justify-between py-3`}>
            <Text style={tw`text-gray-800 font-medium`}>Open Source Licenses</Text>
            <Ionicons name="chevron-forward-outline" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Copyright */}
        <View style={tw`items-center py-4`}>
          <Text style={tw`text-gray-500 text-sm text-center`}>© 2024 My Expo App. All rights reserved.</Text>
          <Text style={tw`text-gray-400 text-xs text-center mt-1`}>Made with ❤️ using Expo and React Native</Text>
        </View>
      </View>
    </ScrollView>
  )
}
