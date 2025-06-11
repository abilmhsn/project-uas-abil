import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions } from "react-native"
import tw from "twrnc"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"

type HomeStackParamList = {
  HomeMain: undefined
  Dashboard: undefined
}

const { width } = Dimensions.get("window")

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>()

  const categories = [
    { id: 1, title: "Men", icon: "man-outline", color: "#3B82F6" },
    { id: 2, title: "Women", icon: "woman-outline", color: "#EC4899" },
    { id: 3, title: "Kids", icon: "happy-outline", color: "#10B981" },
    { id: 4, title: "Sports", icon: "football-outline", color: "#F59E0B" },
  ]

  const featuredProducts = [
    {
      id: 1,
      name: "Ultraboost 22",
      price: "$180",
      image: "https://assets.adidas.com/images/w_600,f_auto,q_auto/ultraboost22.jpg",
      category: "Running",
    },
    {
      id: 2,
      name: "Stan Smith",
      price: "$100",
      image: "https://assets.adidas.com/images/w_600,f_auto,q_auto/stansmith.jpg",
      category: "Lifestyle",
    },
    {
      id: 3,
      name: "NMD R1",
      price: "$140",
      image: "https://assets.adidas.com/images/w_600,f_auto,q_auto/nmdr1.jpg",
      category: "Originals",
    },
  ]

  return (
    <ScrollView style={tw`flex-1 bg-white pt-10`} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={tw`px-6 pt-4 pb-6`}>
        <View style={tw`flex-row items-center justify-between`}>
          <View>
            <Text style={tw`text-3xl font-bold text-black`}>Thrift-Bill</Text>
            <Text style={tw`text-gray-600 text-sm`}>Impossible is Nothing</Text>
          </View>
          <TouchableOpacity style={tw`relative`}>
            <Ionicons name="notifications-outline" size={24} color="#000" />
            <View style={tw`absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full`} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Hero Banner */}
      <View style={tw`mx-6 mb-8`}>
        <View style={[tw`bg-black rounded-3xl overflow-hidden relative`, { height: 200 }]}>
          <Image
            source={{ uri: "https://assets.adidas.com/images/w_600,f_auto,q_auto/hero-banner.jpg" }}
            style={tw`absolute inset-0 w-full h-full opacity-30`}
            resizeMode="cover"
          />
          <View style={tw`absolute inset-0 bg-black bg-opacity-40`} />
          <View style={tw`flex-1 justify-center px-6`}>
            <Text style={tw`text-white text-3xl font-bold mb-2`}>New Collection</Text>
            <Text style={tw`text-white text-lg mb-4 opacity-90`}>Discover the latest trends</Text>
            <TouchableOpacity
              style={tw`bg-white px-8 py-3 rounded-full self-start`}
              onPress={() => navigation.navigate("Dashboard")}
            >
              <Text style={tw`text-black font-bold text-lg`}>Shop Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Categories */}
      <View style={tw`mb-8`}>
        <Text style={tw`text-2xl font-bold text-black px-6 mb-6`}>Shop by Category</Text>
        <View style={tw`flex-row justify-between px-6`}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={tw`items-center flex-1 mx-1`}
              onPress={() => navigation.navigate("Dashboard")}
            >
              <View
                style={[
                  tw`w-16 h-16 rounded-2xl items-center justify-center mb-3`,
                  { backgroundColor: category.color + "15" },
                ]}
              >
                <Ionicons name={category.icon as any} size={28} color={category.color} />
              </View>
              <Text style={tw`text-gray-800 font-medium text-sm text-center`}>{category.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Featured Products */}
      <View style={tw`mb-8`}>
        <View style={tw`flex-row items-center justify-between px-6 mb-6`}>
          <Text style={tw`text-2xl font-bold text-black`}>Featured Products</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Dashboard")}>
            <Text style={tw`text-blue-600 font-semibold text-base`}>View All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={tw`px-6`}>
          {featuredProducts.map((product) => (
            <TouchableOpacity
              key={product.id}
              style={[
                tw`mr-4 bg-gray-50 rounded-2xl p-4`,
                { width: width * 0.45 }
              ]}
              onPress={() => navigation.navigate("Dashboard")}
            >
              <Image
                source={{ uri: product.image }}
                style={tw`w-full h-32 rounded-xl bg-white mb-3`}
                resizeMode="cover"
              />
              <Text style={tw`text-xs text-gray-500 uppercase tracking-wide mb-1`}>{product.category}</Text>
              <Text style={tw`text-black font-bold text-base mb-2`} numberOfLines={1}>
                {product.name}
              </Text>
              <Text style={tw`text-black font-bold text-lg`}>{product.price}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Trending Section */}
      <View style={tw`mx-6`}>
        <View style={tw`bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-6 relative overflow-hidden`}>
          <View style={tw`absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16`} />
          <Text style={tw`text-white text-2xl font-bold mb-2`}>Trending Now</Text>
          <Text style={tw`text-white opacity-90 text-base mb-4`}>Get up to 50% off on selected items</Text>
          <TouchableOpacity
            style={tw`bg-white px-6 py-3 rounded-full self-start`}
            onPress={() => navigation.navigate("Dashboard")}
          >
          <Text style={tw`text-4xl font-bold text-black pl-8`}>Explore Deals</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Brand Story */}
      <View style={tw`mx-6 mb-8`}>
        <View style={tw`bg-black rounded-3xl p-6`}>
          <Text style={tw`text-white text-2xl font-bold mb-3`}>Our Story</Text>
          <Text style={tw`text-white opacity-90 text-base leading-6 mb-4`}>
            Discover sustainable fashion with our curated collection of pre-loved designer pieces. Quality meets
            affordability in every item.
          </Text>
          <TouchableOpacity style={tw`flex-row items-center`}>
            <Text style={tw`text-white font-semibold mr-2`}>Learn More</Text>
            <Ionicons name="arrow-forward" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={tw`px-6 mb-10`}>
        <Text style={tw`text-2xl font-bold text-black mb-6`}>Quick Actions</Text>
        <View style={tw`flex-row justify-between`}>
          <TouchableOpacity
            style={tw`bg-white border border-gray-200 rounded-2xl p-4 flex-1 mr-2 items-center shadow-sm`}
            onPress={() => navigation.navigate("Dashboard")}
          >
            <Ionicons name="storefront-outline" size={32} color="#3B82F6" style={tw`mb-2`} />
            <Text style={tw`text-black font-semibold text-center`}>Browse Shop</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`bg-white border border-gray-200 rounded-2xl p-4 flex-1 ml-2 items-center shadow-sm`}
          >
            <Ionicons name="heart-outline" size={32} color="#EC4899" style={tw`mb-2`} />
            <Text style={tw`text-black font-semibold text-center`}>Wishlist</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Spacing */}
      <View style={tw`h-20`} />
    </ScrollView>
  )
}
