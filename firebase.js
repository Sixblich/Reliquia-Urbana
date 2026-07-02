// ── Firebase App ──────────────────────────────────────────────────────────────
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

// ── Authentication ────────────────────────────────────────────────────────────
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// ── Firestore (productos, pedidos, etc.) ──────────────────────────────────────
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ── Storage (imágenes) ────────────────────────────────────────────────────────
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// ── Realtime Database (usuarios) ──────────────────────────────────────────────
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// ── Configuración Firebase (TU proyecto real) ─────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyDHyaGi8c560adgbe7CTY9dTzxJL0SN_rk",
  authDomain: "reliquia-urbana.firebaseapp.com",
  projectId: "reliquia-urbana",
  storageBucket: "reliquia-urbana.appspot.com",
  messagingSenderId: "1046553293789",
  appId: "1:1046553293789:web:316808a57723d7fdf33c34",
  measurementId: "G-WE3PNNKG9N"
};

// ── Inicializar Firebase ──────────────────────────────────────────────────────
const app = initializeApp(firebaseConfig);

// ── Exportar servicios ────────────────────────────────────────────────────────
export const auth    = getAuth(app);
export const db      = getFirestore(app);
export const storage = getStorage(app);
export const rtdb    = getDatabase(app);
