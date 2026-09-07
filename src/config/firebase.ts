import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// ArcDraco Web3 App Firebase Configuration (data-nft)
const firebaseConfig = {
  apiKey: "AIzaSyCegP_G-SEJ9ac9YVvyY0QUyBGdLomniTw",
  authDomain: "data-nft.firebaseapp.com",
  projectId: "data-nft",
  storageBucket: "data-nft.firebasestorage.app",
  messagingSenderId: "697063380576",
  appId: "1:697063380576:web:f701ab638e8a03178b5505",
  measurementId: "G-933G6JVSTM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);