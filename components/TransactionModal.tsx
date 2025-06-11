import React, { useState } from "react"
import { Modal, View, Text, TextInput, Button, StyleSheet, Alert } from "react-native"
import { db, auth } from "../firebaseConfig"
import { collection, addDoc, Timestamp } from "firebase/firestore"
import { onAuthStateChanged } from "firebase/auth"

const AddTransactionModal = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
  const [productId, setProductId] = useState("")
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [quantity, setQuantity] = useState("")

  const handleSave = async () => {
    const currentUser = auth.currentUser

    if (!currentUser || typeof currentUser.uid !== "string") {
      Alert.alert("Error", "User is not authenticated or ID is invalid")
      return
    }

    const priceNum = parseFloat(price)
    const qtyNum = parseInt(quantity)

    if (isNaN(priceNum) || isNaN(qtyNum)) {
      Alert.alert("Error", "Price and quantity must be valid numbers")
      return
    }

    try {
      await addDoc(collection(db, "transactions"), {
        userId: currentUser.uid, // <-- sesuai rule
        productId,
        name,
        price: priceNum,
        quantity: qtyNum,
        total: priceNum * qtyNum,
        createdAt: Timestamp.now(),
      })

      Alert.alert("Success", "Transaction saved successfully!")
      onClose()
    } catch (error) {
      console.error("Error saving transaction:", error)
      Alert.alert("Error", "Failed to save transaction. Check Firestore rules.")
    }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Add Transaction</Text>

          <TextInput
            style={styles.input}
            placeholder="Product ID"
            value={productId}
            onChangeText={setProductId}
          />
          <TextInput
            style={styles.input}
            placeholder="Product Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Price"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Quantity"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
          />

          <View style={styles.buttonRow}>
            <Button title="Cancel" onPress={onClose} />
            <Button title="Save" onPress={handleSave} />
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 16,
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 10,
    paddingVertical: 5,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
})

export default AddTransactionModal
