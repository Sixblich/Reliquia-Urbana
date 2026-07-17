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
 * Guarda el stock disponible para poder limitar la cantidad despues.
 * @param {Object} producto - { id, nombre, precio, imagen, talla, marca, stock }
 */
export function agregarAlCarrito(producto) {
  const carrito = getCarrito();
  const existente = carrito.find(i => i.id === producto.id);
  const stockDisponible = parseInt(producto.stock) || 0;

  if (stockDisponible <= 0) {
    alert("Este producto no tiene stock disponible.");
    return false;
  }

  if (existente) {
    if (existente.cantidad >= stockDisponible) {
      alert("Ya tienes en el carrito todo el stock disponible de este producto (" + stockDisponible + ").");
      return false;
    }
    existente.cantidad++;
    existente.stock = stockDisponible; // mantener actualizado el limite
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen || "",
      talla: producto.talla || "",
      marca: producto.marca || "",
      stock: stockDisponible,
      cantidad: 1
    });
  }

  setCarrito(carrito);
  actualizarContadorCarrito();
  return true;
}

/**
 * Cambia la cantidad de un item del carrito respetando el limite de stock.
 * @returns {boolean} true si el cambio se aplico, false si se bloqueo por stock
 */
export function cambiarCantidadCarrito(idx, delta) {
  const carrito = getCarrito();
  const item = carrito[idx];
  if (!item) return false;

  const nuevaCantidad = item.cantidad + delta;

  if (delta > 0) {
    const limite = parseInt(item.stock) || 0;
    if (nuevaCantidad > limite) {
      alert("Solo hay " + limite + " unidad" + (limite === 1 ? "" : "es") + " disponible" + (limite === 1 ? "" : "s") + " de \"" + item.nombre + "\".");
      return false;
    }
  }

  if (nuevaCantidad <= 0) {
    carrito.splice(idx, 1);
  } else {
    item.cantidad = nuevaCantidad;
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
