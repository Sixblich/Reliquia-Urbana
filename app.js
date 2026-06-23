import { auth } from "./firebase.js";

import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


// FORM LOGIN
const loginForm = document.getElementById("loginForm");


// INICIAR SESIÓN
if(loginForm){

  loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const mensaje = document.getElementById("mensaje");

    try {

      await signInWithEmailAndPassword(auth, email, password);

      mensaje.style.color = "green";
      mensaje.textContent = "Inicio de sesión exitoso";

      // REDIRECCIONAR AL MENU
      setTimeout(() => {

        window.location.href = "catalogo.html";

      }, 1000);

    } catch (error) {

      mensaje.style.color = "red";

      if(error.code === "auth/user-not-found"){
        mensaje.textContent = "Usuario no encontrado";
      }

      else if(error.code === "auth/wrong-password"){
        mensaje.textContent = "Contraseña incorrecta";
      }

      else if(error.code === "auth/invalid-email"){
        mensaje.textContent = "Correo inválido";
      }

      else{
        mensaje.textContent = error.message;
      }

    }

  });

}


// VERIFICAR SESIÓN ACTIVA
onAuthStateChanged(auth, (user) => {

  if(user){

    console.log("Usuario activo:", user.email);

  } else {

    console.log("No hay sesión iniciada");

  }

});


// CERRAR SESIÓN
window.cerrarSesion = async function(){

  await signOut(auth);

  alert("Sesión cerrada");

  window.location.href = "login.html";

}