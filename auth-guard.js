// ── auth-guard.js ─────────────────────────────────────────────────────────────
// Importa esto en CUALQUIER página que quieras proteger.
// Uso:
//   import { verificarSesion } from "./auth-guard.js";
//   const usuario = await verificarSesion("usuario");  // solo usuarios normales
//   const admin   = await verificarSesion("admin");    // solo admins
//   const any     = await verificarSesion();           // cualquier usuario autenticado
// ──────────────────────────────────────────────────────────────────────────────

import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc }        from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/**
 * Verifica que haya sesión activa y que el usuario tenga el rol requerido.
 * Si no cumple, redirige automáticamente.
 * @param {string|null} rolRequerido - "admin", "usuario", o null para cualquiera
 * @returns {Promise<{uid, email, rol, nombre, ...}>} datos del usuario
 */
export function verificarSesion(rolRequerido = null) {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, async (user) => {

      // Sin sesión → al login (guardando a dónde quería ir)
      if (!user) {
        const destino = window.location.pathname.split("/").pop();
        window.location.href = "login.html?redirect=" + encodeURIComponent(destino);
        return;
      }

      try {
        // Leer datos del usuario en Firestore
        const snap = await getDoc(doc(db, "usuarios", user.uid));

        if (!snap.exists()) {
          // Usuario en Auth pero no en Firestore (raro), mandarlo al login
          window.location.href = "login.html";
          return;
        }

        const datos = { uid: user.uid, email: user.email, ...snap.data() };

        // Verificar rol si se exige uno específico
        if (rolRequerido && datos.rol !== rolRequerido) {
          // Admin intentando entrar a página de usuario → al catálogo
          if (datos.rol === "admin") {
            window.location.href = "admin.html";
          } else {
            // Usuario normal intentando entrar a página de admin → al catálogo
            window.location.href = "catalogo.html";
          }
          return;
        }

        // Verificar que la cuenta esté activa
        if (datos.activo === false) {
          if (window.mostrarAviso) {
            window.mostrarAviso("Tu cuenta ha sido desactivada. Contacta al administrador.", "error");
            await new Promise(function(r) { setTimeout(r, 2200); });
          } else {
            alert("Tu cuenta ha sido desactivada. Contacta al administrador.");
          }
          await auth.signOut();
          window.location.href = "login.html";
          return;
        }

        resolve(datos);

      } catch (e) {
        console.error("Error verificando sesión:", e);
        window.location.href = "login.html";
      }
    });
  });
}

/**
 * Cierra la sesión y redirige al login
 */
export async function cerrarSesion() {
  const { signOut } = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js");
  await signOut(auth);
  window.location.href = "login.html";
}

/**
 * Verifica si hay sesión SIN redirigir si no la hay.
 * Útil para páginas públicas (como catalogo.html) que muestran
 * contenido distinto si el usuario está logueado o no, pero
 * no deben bloquear el acceso a quien no tiene cuenta.
 * @returns {Promise<{uid, email, rol, ...}|null>} datos del usuario o null
 */
export function verificarSesionOpcional() {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        resolve(null);
        return;
      }
      try {
        const snap = await getDoc(doc(db, "usuarios", user.uid));
        if (!snap.exists()) {
          resolve(null);
          return;
        }
        resolve({ uid: user.uid, email: user.email, ...snap.data() });
      } catch (e) {
        console.error("Error verificando sesión opcional:", e);
        resolve(null);
      }
    });
  });
}
