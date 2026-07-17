# 🛍️ Reliquia Urbana

**Aplicación web de compra y venta de ropa con marketplace integrado.**

Reliquia Urbana es una plataforma de comercio electrónico que combina una tienda en línea tradicional con un marketplace colaborativo, donde los usuarios pueden ofrecer sus propias prendas para que la tienda las compre y las revenda como parte de su catálogo.

Proyecto desarrollado como trabajo final de la asignatura **Aplicaciones Web**, en el marco de la carrera de **Ingeniería en Tecnologías de la Información**.

---

## 📋 Tabla de contenido

- [Descripción del proyecto](#-descripción-del-proyecto)
- [Tecnologías utilizadas](#-tecnologías-utilizadas)
- [Ciclo de vida de desarrollo](#-ciclo-de-vida-de-desarrollo)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Funcionalidades principales](#-funcionalidades-principales)
- [Roles del sistema](#-roles-del-sistema)
- [Configuración e instalación](#-configuración-e-instalación)
- [Colecciones de Firestore](#-colecciones-de-firestore)
- [Flujo del marketplace](#-flujo-del-marketplace)
- [Capturas de pantalla](#-capturas-de-pantalla)
- [Autor](#-autor)

---

## 📖 Descripción del proyecto

Reliquia Urbana permite:

- 🛒 Explorar un catálogo de ropa público, sin necesidad de crear una cuenta.
- 🛍️ Agregar productos a un carrito de compras y pagar por transferencia bancaria.
- 📦 Elegir entre **recoger en tienda** o **envío a domicilio**.
- 🧾 Descargar un comprobante de compra una vez aprobado el pago.
- 👗 Publicar prendas propias para que la tienda las compre directamente (marketplace).
- 📊 Administrar productos, pagos, pedidos, prendas y usuarios desde un panel de administración completo.
- 📈 Generar reportes de ventas mensuales exportables a PDF.

---

## 🧰 Tecnologías utilizadas

| Componente               | Tecnología                                   |
|---------------------------|-----------------------------------------------|
| Frontend                  | HTML5, CSS3, JavaScript (Vanilla)             |
| Autenticación              | Firebase Authentication                       |
| Base de datos              | Firebase Firestore                            |
| Almacenamiento de archivos | Firebase Storage                              |
| Hosting                    | Firebase Hosting                              |
| Fuentes                    | Google Fonts (Playfair Display, DM Sans)      |
| Control de versiones       | Git / GitHub                                  |

No se utilizan frameworks de frontend (React, Vue, etc.) ni librerías de terceros para la lógica de negocio: todo el JavaScript es nativo (Vanilla JS) usando módulos ES6.

---

## 🔄 Ciclo de vida de desarrollo

Este proyecto fue construido siguiendo el **Modelo Incremental** como ciclo de vida de software, dividido en las siguientes fases:

| Fase | Descripción | Estado |
|------|-------------|--------|
| Fase 1 | Análisis y Diseño (SRS, diagrama ER, arquitectura, wireframes) | ✅ |
| Incremento 1 | Autenticación y gestión de usuarios | ✅ |
| Incremento 2 | Catálogo de productos | ✅ |
| Incremento 3 | Carrito de compras y proceso de pago | ✅ |
| Incremento 4 | Marketplace (compra de prendas a usuarios) | ✅ |
| Fase Final | Pruebas, reportes y despliegue | ✅ |

---

## 📁 Estructura del proyecto

```
reliquia-urbana/
│
├── index.html              # Splash screen / landing de entrada
├── login.html               # Inicio de sesión
├── registro.html            # Registro de nuevos usuarios
├── catalogo.html             # Catálogo público de productos
├── catalogo.css               # Estilos del catálogo
├── carrito.html               # Carrito, datos de entrega y pago
├── historial.html             # Historial de compras del usuario
├── vender.html                 # Formulario para ofrecer una prenda
├── mis-prendas.html             # Seguimiento del estado de prendas publicadas
├── admin.html                    # Panel de administración completo
│
├── ayuda.html                     # Centro de ayuda / FAQ
├── privacidad.html                 # Política de privacidad
├── terminos.html                     # Términos y condiciones
├── acerca.html                        # Información del proyecto y desarrollador
│
├── firebase.js                         # Configuración e inicialización de Firebase
├── auth-guard.js                        # Protección de rutas según sesión/rol
├── carrito-utils.js                      # Utilidades del carrito (localStorage)
│
└── README.md                              # Este archivo
```

---

## ⚙️ Funcionalidades principales

### 🛒 Catálogo y compras
- Catálogo público con búsqueda en tiempo real y filtros por categoría, estado y precio.
- Carrito de compras con panel lateral deslizante, persistido en `localStorage`.
- Validación de stock disponible al agregar o modificar cantidades.
- Registro de datos del comprador: nombre, cédula, teléfono, provincia, dirección.
- Selección de método de entrega: **recoger en tienda** o **envío a domicilio**.
- Pago por transferencia bancaria con subida de comprobante (Firebase Storage).
- Comprobante de compra descargable una vez aprobado el pago.

### 👗 Marketplace
- Formulario para publicar una prenda con hasta 3 fotos.
- Flujo de estados: `Pendiente de revisión → Aceptada → En inspección → Comprada → Publicada → Vendida` (o `Rechazada`).
- Seguimiento del estado desde "Mis prendas".
- Integración automática al catálogo una vez comprada la prenda.

### 🛠️ Panel de administración
- Dashboard con estadísticas generales y alertas de stock bajo/agotado.
- Gestión de productos (CRUD completo con subida de imágenes).
- Validación de pagos con visualización de comprobantes.
- Gestión de pedidos y actualización de estados.
- Revisión y aprobación/rechazo de prendas del marketplace.
- Gestión de usuarios (activar/desactivar cuentas).
- Reportes de ventas mensuales exportables a PDF.

---

## 👥 Roles del sistema

| Rol | Acceso |
|-----|--------|
| **Usuario** | Navega el catálogo, compra, vende prendas propias, revisa su historial. |
| **Administrador** | Gestiona productos, valida pagos, aprueba prendas, administra usuarios y genera reportes. |

El rol se asigna en el campo `rol` del documento del usuario en Firestore (`usuario` o `admin`).

---

## 🔧 Configuración e instalación

### Requisitos previos
- Cuenta de [Firebase](https://firebase.google.com/)
- Proyecto de Firebase con los siguientes servicios habilitados:
  - Authentication (método: Correo/Contraseña)
  - Firestore Database
  - Storage
  - Hosting (opcional, para despliegue)

### Pasos

1. Clona este repositorio:
   ```bash
   git clone https://github.com/tu-usuario/reliquia-urbana.git
   cd reliquia-urbana
   ```

2. Configura tus credenciales de Firebase en `firebase.js`:
   ```js
   const firebaseConfig = {
     apiKey: "TU_API_KEY",
     authDomain: "tu-proyecto.firebaseapp.com",
     projectId: "tu-proyecto",
     storageBucket: "tu-proyecto.firebasestorage.app",
     messagingSenderId: "TU_SENDER_ID",
     appId: "TU_APP_ID"
   };
   ```

3. Configura las reglas de **Firestore** (Firebase Console → Firestore → Reglas):
   ```js
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /productos/{id} {
         allow read: if true;
         allow write: if request.auth != null;
       }
       match /usuarios/{uid} {
         allow read, write: if request.auth != null;
       }
       match /pedidos/{id} {
         allow read, write: if request.auth != null;
       }
       match /pagos/{id} {
         allow read, write: if request.auth != null;
       }
       match /prendas_ofrecidas/{id} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

4. Configura las reglas de **Storage** (Firebase Console → Storage → Reglas):
   ```js
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /productos/{fileName} {
         allow read: if true;
         allow write: if request.auth != null;
       }
       match /comprobantes/{fileName} {
         allow read, write: if request.auth != null;
       }
       match /prendas_ofrecidas/{fileName} {
         allow read: if true;
         allow write: if request.auth != null;
       }
     }
   }
   ```

5. Crea tu primer usuario administrador:
   - Regístrate normalmente desde `registro.html`.
   - Ve a Firestore → colección `usuarios` → busca tu documento → cambia el campo `rol` de `"usuario"` a `"admin"`.

6. Abre `index.html` en un servidor local (recomendado usar Live Server de VS Code, ya que el proyecto usa módulos ES6).

---

## 🗄️ Colecciones de Firestore

| Colección | Descripción |
|-----------|-------------|
| `usuarios` | Datos de perfil, rol y estado de cada usuario. |
| `productos` | Catálogo de productos disponibles para la venta. |
| `pedidos` | Compras realizadas, con datos de entrega y estado. |
| `pagos` | Comprobantes de transferencia y su estado de validación. |
| `prendas_ofrecidas` | Prendas publicadas por usuarios en el marketplace. |

---

## 🔁 Flujo del marketplace

```
Usuario publica prenda
        ↓
Pendiente de revisión
        ↓
   ┌────┴────┐
Aceptada   Rechazada
   ↓
En inspección (usuario lleva la prenda a la tienda)
   ↓
Comprada (la tienda paga al vendedor)
   ↓
Publicada (aparece en el catálogo público)
   ↓
Vendida (un cliente la compró)
```

> Reliquia Urbana **no actúa como intermediario**. La tienda compra las prendas aceptadas y las revende como productos propios.

---

## 📸 Capturas de pantalla

> *(Agrega aquí capturas del catálogo, carrito, panel admin, etc. antes de subir a GitHub)*

---

## 👤 Autor

**Cazco Muyulema Sixto Stalin**
Estudiante de 4to semestre — Ingeniería en Tecnologías de la Información
Universidad Nacional de Chimborazo (UNACH)
Materia: Aplicaciones Web

📧 stalinmuy@gmail.com
📍 Riobamba, Chimborazo, Ecuador

---

## 📄 Licencia

Este proyecto fue desarrollado con fines académicos como parte de la asignatura de Aplicaciones Web. Su uso, distribución o reproducción fuera de este contexto debe contar con autorización del autor.

---

<p align="center">Hecho con 🖤 y mucho café — Reliquia Urbana © 2025</p>
