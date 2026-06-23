// ── carrito-utils.js ──────────────────────────────────────────────────────────
// Funciones compartidas para manejar el carrito en localStorage.
// Úsalo en catalogo.html para agregar productos al carrito.
// ──────────────────────────────────────────────────────────────────────────────

const CARRITO_KEY = "reliquia_carrito";

export function getCarrito() {
  return JSON.parse(localStorage.getItem(CARRITO_KEY) || "[]");
}

export function setCarrito(carrito) {
  localStorage.setItem(CARRITO_KEY, JSON.stringify(carrito));
}

/**
 * Agrega un producto al carrito. Si ya existe, suma 1 a la cantidad.
 * @param {Object} producto - { id, nombre, precio, imagen, talla, marca, stock }
 */
export function agregarAlCarrito(producto) {
  const carrito = getCarrito();
  const existente = carrito.find(i => i.id === producto.id);

  if (existente) {
    if (existente.cantidad >= producto.stock) {
      alert("No hay más stock disponible de este producto.");
      return false;
    }
    existente.cantidad++;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen || "",
      talla: producto.talla || "",
      marca: producto.marca || "",
      cantidad: 1
    });
  }

  setCarrito(carrito);
  actualizarContadorCarrito();
  return true;
}

/**
 * Actualiza visualmente el contador del carrito en el navbar (si existe el elemento #cartCount)
 */
export function actualizarContadorCarrito() {
  const el = document.getElementById("cartCount");
  if (!el) return;
  const carrito = getCarrito();
  const total = carrito.reduce((s, i) => s + i.cantidad, 0);
  el.textContent = total;
  el.style.display = total > 0 ? "flex" : "none";
  el.classList.add("bump");
  setTimeout(() => el.classList.remove("bump"), 300);
}