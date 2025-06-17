"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
  FlatList,
} from "react-native"
import tw from "twrnc"
import { Ionicons } from "@expo/vector-icons"
import { db, auth } from "../firebaseConfig"
import { collection, addDoc, Timestamp, query, where, getDocs, orderBy } from "firebase/firestore"
import { onAuthStateChanged } from "firebase/auth"

interface Order {
  id: string
  productId: number
  name: string
  price: number
  quantity: number
  total: number
  createdAt: any
}

const categories = [
  { id: "all", name: "All", icon: "grid-outline" },
  { id: "tshirt", name: "T-Shirts", icon: "shirt-outline" },
  { id: "shoes", name: "Shoes", icon: "footsteps-outline" },
  { id: "pants", name: "Pants", icon: "body-outline" },
  { id: "jacket", name: "Jackets", icon: "layers-outline" },
]

const products = [
  {
    id: 1,
    name: "Adidas Ultraboost 22",
    category: "shoes",
    price: 180,
    originalPrice: 220,
    image: "https://down-id.img.susercontent.com/file/sg-11134201-7reng-m2986ac1n9nnbe",
    rating: 4.8,
    isNew: true,
  },
  {
    id: 2,
    name: "Essential T-Shirt",
    category: "tshirt",
    price: 35,
    originalPrice: 45,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZZ_R9l_PNLb6V_aRuG6bKyeJRa1poss-GYg&s",
    rating: 4.5,
    isNew: false,
  },
  {
    id: 3,
    name: "Track Pants",
    category: "pants",
    price: 65,
    originalPrice: 80,
    image: "https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full/catalog-image/98/MTA-170624644/prodigo_footwear_prodigo_-_track_pants_pria_namo_i_celana_cargo_i_cargo_track_pants_i_celana_trackpants_full01_c7nkky7q.jpg",
    rating: 4.6,
    isNew: true,
  },
  {
    id: 4,
    name: "Wind Jacket",
    category: "jacket",
    price: 120,
    originalPrice: 150,
    image: "https://preloved.co.id/_ipx/f_webp,q_80,fit_cover,s_380x380/https://assets.preloved.co.id/products/330180/904c6988-6717-4905-b796-f05bd8357de2_thumbnail.jpg",
    rating: 4.7,
    isNew: false,
  },
  {
    id: 5,
    name: "Stan Smith Sneakers",
    category: "shoes",
    price: 100,
    originalPrice: 120,
    image: "https://assets.adidas.com/images/w_600,f_auto,q_auto/62f55933cd3c46c4a15cac7701278d75_9366/Stan_Smith_Shoes_Black_FX7523.jpg",
    rating: 4.9,
    isNew: false,
  },
  {
    id: 6,
    name: "Performance Tee",
    category: "tshirt",
    price: 40,
    originalPrice: 50,
    image: "https://banditrunning.com/cdn/shop/files/Frame507_423d49c2-0291-4810-a8fd-da251afd4cc4_2000x.png?v=1739055234",
    rating: 4.4,
    isNew: true,
  },
  {
    id: 7,
    name: "Jogger Pants",
    category: "pants",
    price: 75,
    originalPrice: 90,
    image: "https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/466662/sub/goods_466662_sub15_3x4.jpg?width=494",
    rating: 4.5,
    isNew: false,
  },
  {
    id: 8,
    name: "Hoodie Jacket",
    category: "jacket",
    price: 95,
    originalPrice: 110,
    image: "https://down-id.img.susercontent.com/file/id-11134207-23020-ti97iv4rfmnvb8",
    rating: 4.6,
    isNew: true,
  },
]

export default function DashboardScreen() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [modalVisible, setModalVisible] = useState(false)
  const [cartModalVisible, setCartModalVisible] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [quantity, setQuantity] = useState(1)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [cartLoading, setCartLoading] = useState(false)

  useEffect(() => {
    return onAuthStateChanged(auth, setCurrentUser)
  }, [])

  useEffect(() => {
    if (currentUser) {
      fetchOrders()
    }
  }, [currentUser])

  const fetchOrders = async () => {
    if (!currentUser?.uid) return

    setCartLoading(true)
    try {
      const q = query(
        collection(db, "transactions"),
        where("userId", "==", currentUser.uid),
        orderBy("createdAt", "desc"),
      )
      const querySnapshot = await getDocs(q)
      const ordersList: Order[] = []
      querySnapshot.forEach((doc) => {
        ordersList.push({ id: doc.id, ...doc.data() } as Order)
      })
      setOrders(ordersList)
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setCartLoading(false)
    }
  }

  const openProductModal = (product: any) => {
    setSelectedProduct(product)
    setQuantity(1)
    setModalVisible(true)
  }

  const closeProductModal = () => {
    setModalVisible(false)
    setSelectedProduct(null)
    setQuantity(1)
  }

  const handlePurchase = async () => {
    if (!currentUser?.uid || typeof currentUser.uid !== "string") {
      Alert.alert("Error", "Invalid user ID.")
      return
    }

    setLoading(true)
    try {
      await addDoc(collection(db, "transactions"), {
        userId: currentUser.uid,
        productId: selectedProduct.id,
        name: selectedProduct.name,
        price: selectedProduct.price,
        quantity,
        total: selectedProduct.price * quantity,
        createdAt: Timestamp.now(),
      })

      Alert.alert("Success", "Purchase successful!")
      closeProductModal()
      fetchOrders() // Refresh orders after purchase
    } catch (err) {
      console.log("Error saat record transaction:", err)
      Alert.alert("Error", "Failed to record transaction.")
    }
    setLoading(false)
  }

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((product) => product.category === selectedCategory.toLowerCase())

  const featuredProducts = products.filter((product) => product.isNew).slice(0, 3)

  const getTotalItems = () => {
    return orders.reduce((total, order) => total + order.quantity, 0)
  }

  const getTotalAmount = () => {
    return orders.reduce((total, order) => total + order.total, 0)
  }

  const renderOrderItem = ({ item }: { item: Order }) => (
    <View style={tw`bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100`}>
      <View style={tw`flex-row justify-between items-start mb-2`}>
        <Text style={tw`text-gray-800 font-semibold text-base flex-1`} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={tw`text-black font-bold text-lg ml-2`}>${item.total}</Text>
      </View>
      <View style={tw`flex-row justify-between items-center`}>
        <Text style={tw`text-gray-600 text-sm`}>
          ${item.price} × {item.quantity}
        </Text>
        <Text style={tw`text-gray-500 text-xs`}>{item.createdAt?.toDate?.()?.toLocaleDateString() || "Recently"}</Text>
      </View>
    </View>
  )

  return (
    <>
      <ScrollView style={tw`flex-1 bg-gray pt-8`} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={tw`bg-white px-6 pt-4 pb-6`}>
          <View style={tw`flex-row items-center justify-between mb-4`}>
            <View>
              <Text style={tw`text-2xl font-bold text-gray-800`}>Cabibul Store</Text>
              <Text style={tw`text-gray-600`}>Impossible is Nothing</Text>
            </View>
            <TouchableOpacity style={tw`relative`} onPress={() => setCartModalVisible(true)}>
              <Ionicons name="bag-outline" size={24} color="#000" />
              {getTotalItems() > 0 && (
                <View style={tw`absolute -top-2 -right-2 bg-red-500 w-5 h-5 rounded-full items-center justify-center`}>
                  <Text style={tw`text-white text-xs font-bold`}>{getTotalItems()}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          {/* Search Bar */}
          <View style={tw`flex-row items-center bg-gray-100 rounded-xl px-4 py-3`}>
            <Ionicons name="search-outline" size={20} color="#666" />
            <TextInput
              placeholder="Search products..."
              style={tw`flex-1 ml-3 text-gray-800`}
              placeholderTextColor="#666"
            />
            <TouchableOpacity>
              <Ionicons name="options-outline" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Featured Banner */}
        <View style={tw`mx-6 mb-6`}>
          <View style={tw`bg-black rounded-2xl p-6 relative overflow-hidden`}>
            <View style={tw`absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16`} />
            <Text style={tw`text-white text-2xl font-bold mb-2`}>New Collection</Text>
            <Text style={tw`text-gray-300 mb-4`}>Up to 50% off on selected items</Text>
            <TouchableOpacity style={tw`bg-white px-6 py-3 rounded-full self-start`}>
              <Text style={tw`text-black font-bold`}>Shop Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories */}
        <View style={tw`mb-6`}>
          <Text style={tw`text-xl font-bold text-gray-800 px-6 mb-4`}>Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={tw`px-6`}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={tw`mr-4 items-center ${
                  selectedCategory === category.name ? "bg-black" : "bg-white"
                } px-4 py-3 rounded-xl shadow-sm min-w-20`}
                onPress={() => setSelectedCategory(category.name)}
              >
                <Ionicons
                  name={category.icon as any}
                  size={24}
                  color={selectedCategory === category.name ? "white" : "#666"}
                />
                <Text
                  style={tw`text-sm font-medium mt-2 ${
                    selectedCategory === category.name ? "text-white" : "text-gray-600"
                  }`}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Products */}
        {selectedCategory === "All" && (
          <View style={tw`mb-6`}>
            <View style={tw`flex-row items-center justify-between px-6 mb-4`}>
              <Text style={tw`text-xl font-bold text-gray-800`}>New Arrivals</Text>
              <TouchableOpacity>
                <Text style={tw`text-blue-600 font-medium`}>See All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={tw`px-6`}>
              {featuredProducts.map((product) => (
                <TouchableOpacity key={product.id} style={tw`mr-4 w-40`} onPress={() => openProductModal(product)}>
                  <View style={tw`bg-white rounded-xl p-4 shadow-sm`}>
                    <View style={tw`relative`}>
                      <Image source={{ uri: product.image }} style={tw`w-full h-32 rounded-lg bg-gray-100`} />
                      {product.isNew && (
                        <View style={tw`absolute top-2 left-2 bg-red-500 px-2 py-1 rounded-full`}>
                          <Text style={tw`text-white text-xs font-bold`}>NEW</Text>
                        </View>
                      )}
                      <TouchableOpacity
                        style={tw`absolute top-2 right-2 bg-white w-8 h-8 rounded-full items-center justify-center`}
                      >
                        <Ionicons name="heart-outline" size={16} color="#666" />
                      </TouchableOpacity>
                    </View>
                    <Text style={tw`text-gray-800 font-medium mt-3 text-sm`} numberOfLines={2}>
                      {product.name}
                    </Text>
                    <View style={tw`flex-row items-center mt-1`}>
                      <Ionicons name="star" size={12} color="#FFC107" />
                      <Text style={tw`text-gray-600 text-xs ml-1`}>{product.rating}</Text>
                    </View>
                    <View style={tw`flex-row items-center mt-2`}>
                      <Text style={tw`text-black font-bold text-lg`}>${product.price}</Text>
                      <Text style={tw`text-gray-400 text-sm line-through ml-2`}>${product.originalPrice}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Products Grid */}
        <View style={tw`px-6 mb-6`}>
          <View style={tw`flex-row items-center justify-between mb-4`}>
            <Text style={tw`text-xl font-bold text-gray-800`}>
              {selectedCategory === "All" ? "All Products" : selectedCategory}
            </Text>
            <View style={tw`flex-row items-center`}>
              <TouchableOpacity style={tw`mr-3`}>
                <Ionicons name="swap-vertical-outline" size={20} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity>
                <Ionicons name="grid-outline" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={tw`flex-row flex-wrap justify-between`}>
            {filteredProducts.map((product) => (
              <TouchableOpacity key={product.id} style={tw`w-[48%] mb-4`} onPress={() => openProductModal(product)}>
                <View style={tw`bg-white rounded-xl p-4 shadow-sm`}>
                  <View style={tw`relative`}>
                    <Image source={{ uri: product.image }} style={tw`w-full h-40 rounded-lg bg-gray-100`} />
                    {product.isNew && (
                      <View style={tw`absolute top-2 left-2 bg-red-500 px-2 py-1 rounded-full`}>
                        <Text style={tw`text-white text-xs font-bold`}>NEW</Text>
                      </View>
                    )}
                    <TouchableOpacity
                      style={tw`absolute top-2 right-2 bg-white w-8 h-8 rounded-full items-center justify-center shadow-sm`}
                    >
                      <Ionicons name="heart-outline" size={16} color="#666" />
                    </TouchableOpacity>
                  </View>
                  <Text style={tw`text-gray-800 font-medium mt-3 text-sm`} numberOfLines={2}>
                    {product.name}
                  </Text>
                  <View style={tw`flex-row items-center mt-1`}>
                    <Ionicons name="star" size={12} color="#FFC107" />
                    <Text style={tw`text-gray-600 text-xs ml-1`}>{product.rating}</Text>
                  </View>
                  <View style={tw`flex-row items-center justify-between mt-2`}>
                    <View>
                      <Text style={tw`text-black font-bold text-lg`}>${product.price}</Text>
                      <Text style={tw`text-gray-400 text-sm line-through`}>${product.originalPrice}</Text>
                    </View>
                    <TouchableOpacity style={tw`bg-black w-8 h-8 rounded-full items-center justify-center`}>
                      <Ionicons name="add" size={16} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={tw`h-20`} />
      </ScrollView>

      {/* Modal Pembelian */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={closeProductModal}>
        <View style={tw`flex-1 bg-black/50 justify-center items-center`}>
          <View style={tw`bg-white w-80 rounded-2xl p-6`}>
            {selectedProduct && (
              <>
                <Image source={{ uri: selectedProduct.image }} style={tw`w-full h-40 rounded-lg bg-gray-100 mb-4`} />
                <Text style={tw`text-xl font-bold mb-2`}>{selectedProduct.name}</Text>
                <Text style={tw`text-black font-semibold text-lg mb-1`}>${selectedProduct.price}</Text>
                <Text style={tw`text-gray-500 text-sm mb-4`}>
                  Original: <Text style={tw`line-through`}>${selectedProduct.originalPrice}</Text>
                </Text>
                <Text style={tw`font-medium mb-2`}>Quantity</Text>
                <View style={tw`flex-row items-center mb-4`}>
                  <TouchableOpacity
                    style={tw`bg-gray-200 px-4 py-2 rounded-l`}
                    onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                  >
                    <Ionicons name="remove" size={20} color="#000" />
                  </TouchableOpacity>
                  <Text style={tw`px-4 py-2 border-t border-b border-gray-300`}>{quantity}</Text>
                  <TouchableOpacity
                    style={tw`bg-gray-200 px-4 py-2 rounded-r`}
                    onPress={() => setQuantity((q) => q + 1)}
                  >
                    <Ionicons name="add" size={20} color="#000" />
                  </TouchableOpacity>
                </View>
                <Text style={tw`mb-4`}>
                  Total: <Text style={tw`font-bold`}>${selectedProduct.price * quantity}</Text>
                </Text>
                <TouchableOpacity style={tw`bg-black rounded-xl py-3 mb-2`} onPress={handlePurchase} disabled={loading}>
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={tw`text-white text-center font-bold`}>Buy Now</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity onPress={closeProductModal}>
                  <Text style={tw`text-center text-blue-500 font-medium`}>Cancel</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Cart Modal */}
      <Modal
        visible={cartModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCartModalVisible(false)}
      >
        <View style={tw`flex-1 bg-black/50 justify-end`}>
          <View style={tw`bg-white rounded-t-3xl max-h-[80%]`}>
            {/* Cart Header */}
            <View style={tw`flex-row items-center justify-between p-6 border-b border-gray-100`}>
              <Text style={tw`text-xl font-bold text-gray-800`}>Your Orders</Text>
              <TouchableOpacity onPress={() => setCartModalVisible(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Cart Content */}
            {cartLoading ? (
              <View style={tw`flex-1 justify-center items-center p-6`}>
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text style={tw`text-gray-600 mt-2`}>Loading orders...</Text>
              </View>
            ) : orders.length === 0 ? (
              <View style={tw`flex-1 justify-center items-center p-6`}>
                <Ionicons name="bag-outline" size={64} color="#D1D5DB" />
                <Text style={tw`text-gray-500 text-lg font-medium mt-4`}>No orders yet</Text>
                <Text style={tw`text-gray-400 text-center mt-2`}>Start shopping to see your orders here</Text>
              </View>
            ) : (
              <>
                {/* Orders List */}
                <FlatList
                  data={orders}
                  renderItem={renderOrderItem}
                  keyExtractor={(item) => item.id}
                  style={tw`flex-1 px-6 pt-4`}
                  showsVerticalScrollIndicator={false}
                />

                {/* Cart Summary */}
                <View style={tw`p-6 border-t border-gray-100 bg-gray-50`}>
                  <View style={tw`flex-row justify-between items-center mb-2`}>
                    {/* <Text style={tw`text-gray-600 text-base`}>Produk dipilih: {selectedProduct.name}</Text> */}
                    <Text style={tw`text-gray-600 text-base`}>Total Items:</Text>
                    <Text style={tw`text-gray-800 font-semibold text-base`}>{getTotalItems()}</Text>
                  </View>
                  <View style={tw`flex-row justify-between items-center mb-4`}>
                    <Text style={tw`text-gray-800 font-bold text-lg`}>Total Amount:</Text>
                    <Text style={tw`text-black font-bold text-xl`}>${getTotalAmount()}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setCartModalVisible(false)} style={tw`bg-black rounded-xl py-4 items-center`}>
                    <Text style={tw`text-white font-bold text-lg`}>Continue Shopping</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </>
  )
}
