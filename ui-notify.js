// ── ui-notify.js ─────────────────────────────────────────────────────────────
// Sistema de notificaciones visuales para Reliquia Urbana.
// Reemplaza alert(), confirm() y prompt() nativos por componentes con estilo propio.
//
// Uso:
//   mostrarAviso("Producto guardado correctamente", "success");
//   mostrarAviso("Ocurrio un error", "error");
//   const ok = await confirmarAccion("¿Eliminar este producto?");
//   const valor = await pedirValor("Ingresa el precio final:", "10.00");
// ──────────────────────────────────────────────────────────────────────────────

(function () {
  if (window.__reliquiaNotifyLoaded) return;
  window.__reliquiaNotifyLoaded = true;

  // ── ESTILOS ──────────────────────────────────────────────────────────────
  var style = document.createElement("style");
  style.textContent = [
    "#rlq-toast-wrap { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 99999; display: flex; flex-direction: column; gap: 10px; align-items: center; pointer-events: none; }",
    ".rlq-toast { min-width: 260px; max-width: 90vw; background: #111; color: #f7f4ef; padding: 14px 20px; border-radius: 10px; font-family: 'DM Sans', Arial, sans-serif; font-size: 13px; line-height: 1.5; box-shadow: 0 8px 24px rgba(0,0,0,0.25); display: flex; align-items: flex-start; gap: 10px; opacity: 0; transform: translateY(-12px); transition: all 0.3s ease; border-left: 4px solid #c8a96e; }",
    ".rlq-toast.show { opacity: 1; transform: translateY(0); }",
    ".rlq-toast.success { border-left-color: #70ad47; }",
    ".rlq-toast.error   { border-left-color: #e74c3c; }",
    ".rlq-toast.info    { border-left-color: #c8a96e; }",
    ".rlq-toast-icon { font-size: 16px; flex-shrink: 0; margin-top: 1px; }",
    ".rlq-toast-text { flex: 1; }",
    ".rlq-toast-close { background: none; border: none; color: #999; cursor: pointer; font-size: 14px; padding: 0 0 0 6px; flex-shrink: 0; }",
    ".rlq-toast-close:hover { color: #fff; }",

    "#rlq-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 99998; display: none; align-items: center; justify-content: center; padding: 20px; opacity: 0; transition: opacity 0.2s; }",
    "#rlq-modal-overlay.show { display: flex; opacity: 1; }",
    ".rlq-modal-box { background: #fff; border-radius: 14px; max-width: 380px; width: 100%; padding: 26px; font-family: 'DM Sans', Arial, sans-serif; box-shadow: 0 16px 40px rgba(0,0,0,0.25); transform: scale(0.94); transition: transform 0.2s; }",
    "#rlq-modal-overlay.show .rlq-modal-box { transform: scale(1); }",
    ".rlq-modal-icon { font-size: 30px; text-align: center; margin-bottom: 10px; }",
    ".rlq-modal-msg { font-size: 14px; color: #222; line-height: 1.6; text-align: center; margin-bottom: 20px; white-space: pre-line; }",
    ".rlq-modal-input { width: 100%; padding: 11px 14px; border: 1.5px solid #e5e5e5; border-radius: 8px; font-size: 14px; margin-bottom: 18px; font-family: 'DM Sans', Arial, sans-serif; background: #fafafa; box-sizing: border-box; }",
    ".rlq-modal-input:focus { outline: none; border-color: #c8a96e; box-shadow: 0 0 0 3px rgba(200,169,110,0.15); background: #fff; }",
    ".rlq-modal-btns { display: flex; gap: 10px; }",
    ".rlq-btn { flex: 1; padding: 11px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; border: none; font-family: 'DM Sans', Arial, sans-serif; transition: 0.2s; }",
    ".rlq-btn-cancel { background: #f0f0f0; color: #555; }",
    ".rlq-btn-cancel:hover { background: #e5e5e5; }",
    ".rlq-btn-ok { background: #111; color: #fff; }",
    ".rlq-btn-ok:hover { background: #c8a96e; color: #111; }",
    ".rlq-btn-ok.danger { background: #e74c3c; }",
    ".rlq-btn-ok.danger:hover { background: #c0392b; color: #fff; }"
  ].join("\n");
  document.head.appendChild(style);

  // ── CONTENEDOR DE TOASTS ─────────────────────────────────────────────────
  var toastWrap = document.createElement("div");
  toastWrap.id = "rlq-toast-wrap";
  document.body.appendChild(toastWrap);

  var ICONS = { success: "✅", error: "⚠️", info: "ℹ️" };

  window.mostrarAviso = function (mensaje, tipo) {
    tipo = tipo || "info";
    var toast = document.createElement("div");
    toast.className = "rlq-toast " + tipo;
    toast.innerHTML =
      '<span class="rlq-toast-icon">' + (ICONS[tipo] || ICONS.info) + '</span>' +
      '<span class="rlq-toast-text"></span>' +
      '<button class="rlq-toast-close">x</button>';
    toast.querySelector(".rlq-toast-text").textContent = mensaje;
    toastWrap.appendChild(toast);

    requestAnimationFrame(function () { toast.classList.add("show"); });

    function cerrar() {
      toast.classList.remove("show");
      setTimeout(function () { toast.remove(); }, 300);
    }
    toast.querySelector(".rlq-toast-close").onclick = cerrar;
    setTimeout(cerrar, 4200);
  };

  // ── MODAL DE CONFIRMACION (reemplaza confirm()) ──────────────────────────
  var overlay = document.createElement("div");
  overlay.id = "rlq-modal-overlay";
  document.body.appendChild(overlay);

  window.confirmarAccion = function (mensaje, opciones) {
    opciones = opciones || {};
    var textoOk = opciones.textoOk || "Confirmar";
    var textoCancelar = opciones.textoCancelar || "Cancelar";
    var peligro = opciones.peligro || false;

    return new Promise(function (resolve) {
      overlay.innerHTML =
        '<div class="rlq-modal-box">' +
          '<div class="rlq-modal-icon">' + (peligro ? "🗑️" : "❓") + '</div>' +
          '<div class="rlq-modal-msg"></div>' +
          '<div class="rlq-modal-btns">' +
            '<button class="rlq-btn rlq-btn-cancel">' + textoCancelar + '</button>' +
            '<button class="rlq-btn rlq-btn-ok' + (peligro ? ' danger' : '') + '">' + textoOk + '</button>' +
          '</div>' +
        '</div>';
      overlay.querySelector(".rlq-modal-msg").textContent = mensaje;
      overlay.classList.add("show");

      function cerrar(valor) {
        overlay.classList.remove("show");
        resolve(valor);
      }
      overlay.querySelector(".rlq-btn-cancel").onclick = function () { cerrar(false); };
      overlay.querySelector(".rlq-btn-ok").onclick = function () { cerrar(true); };
      overlay.onclick = function (e) { if (e.target === overlay) cerrar(false); };
    });
  };

  // ── MODAL DE ENTRADA DE TEXTO (reemplaza prompt()) ───────────────────────
  window.pedirValor = function (mensaje, valorInicial) {
    return new Promise(function (resolve) {
      overlay.innerHTML =
        '<div class="rlq-modal-box">' +
          '<div class="rlq-modal-icon">✏️</div>' +
          '<div class="rlq-modal-msg"></div>' +
          '<input type="text" class="rlq-modal-input" />' +
          '<div class="rlq-modal-btns">' +
            '<button class="rlq-btn rlq-btn-cancel">Cancelar</button>' +
            '<button class="rlq-btn rlq-btn-ok">Aceptar</button>' +
          '</div>' +
        '</div>';
      overlay.querySelector(".rlq-modal-msg").textContent = mensaje;
      var input = overlay.querySelector(".rlq-modal-input");
      input.value = valorInicial || "";
      overlay.classList.add("show");
      setTimeout(function () { input.focus(); input.select(); }, 100);

      function cerrar(valor) {
        overlay.classList.remove("show");
        resolve(valor);
      }
      overlay.querySelector(".rlq-btn-cancel").onclick = function () { cerrar(null); };
      overlay.querySelector(".rlq-btn-ok").onclick = function () { cerrar(input.value); };
      input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") cerrar(input.value);
        if (e.key === "Escape") cerrar(null);
      });
      overlay.onclick = function (e) { if (e.target === overlay) cerrar(null); };
    });
  };
})();
