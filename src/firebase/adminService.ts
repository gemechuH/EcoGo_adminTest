import { db } from "../firebase/config";
import { collection, addDoc, getDocs } from "firebase/firestore";

const adminCollection = collection(db, "admins"); // ✅ Correct

export async function addAdmin(adminData: {
  name: string;
  email: string;
  role: string;
}) {
  try {
    const docRef = await addDoc(adminCollection, adminData);
    console.log("Admin added with ID:", docRef.id);
  } catch (error) {
    console.error("Error adding admin:", error);
  }
}

export async function getAdmins() {
  const snapshot = await getDocs(adminCollection);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
