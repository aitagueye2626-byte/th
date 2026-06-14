

(function() {
  const container = document.createElement("div");
  container.id = "toast-container";
  container.setAttribute("role", "alert");
  container.setAttribute("aria-live", "polite");
  container.style.cssText = `
    position: fixed; top: 70px; right: 20px;
    display: flex; flex-direction: column; gap: 10px;
    z-index: 99999; width: 320px; pointer-events: none;
  `;
  document.body.appendChild(container);

  const style = document.createElement("style");
  style.textContent = `
    .toast {
      display: flex; align-items: flex-start; gap: 10px;
      padding: 13px 15px; border-radius: 12px; border: 1px solid transparent;
      background: #fff; box-shadow: 0 4px 20px rgba(0,0,0,0.12);
      transform: translateX(120%); opacity: 0;
      transition: transform 0.35s cubic-bezier(.22,.68,0,1.2), opacity 0.25s ease;
      position: relative; overflow: hidden; pointer-events: auto;
    }
    .toast.show { transform: translateX(0); opacity: 1; }
    .toast.hide { transform: translateX(120%); opacity: 0; }
    .toast-success { border-color: #1D9E75; background: #E8FAF3; }
    .toast-error   { border-color: #E24B4A; background: #FEF0F0; }
    .toast-warning { border-color: #EF9F27; background: #FEF5E6; }
    .toast-info    { border-color: #378ADD; background: #EBF4FD; }
    .toast-icon { font-size: 20px; margin-top: 1px; flex-shrink: 0; }
    .toast-body { flex: 1; min-width: 0; }
    .toast-title { font-size: 14px; font-weight: 600; margin: 0 0 2px; line-height: 1.3; }
    .toast-msg   { font-size: 13px; margin: 0; line-height: 1.5; }
    .toast-success .toast-title, .toast-success .toast-msg { color: #085041; }
    .toast-error   .toast-title, .toast-error   .toast-msg { color: #791F1F; }
    .toast-warning .toast-title, .toast-warning .toast-msg { color: #633806; }
    .toast-info    .toast-title, .toast-info    .toast-msg { color: #0C447C; }
    .toast-close { background:none;border:none;cursor:pointer;padding:0;font-size:16px;opacity:.5;flex-shrink:0; }
    .toast-close:hover { opacity:1; }
    .toast-success .toast-close { color:#085041; }
    .toast-error   .toast-close { color:#791F1F; }
    .toast-warning .toast-close { color:#633806; }
    .toast-info    .toast-close { color:#0C447C; }
    .toast-progress {
      position:absolute;bottom:0;left:0;height:3px;width:100%;
      transform-origin:left;border-radius:0 0 12px 12px;
      animation: toast-shrink 3.8s linear forwards;
    }
    .toast-success .toast-progress { background:#1D9E75; }
    .toast-error   .toast-progress { background:#E24B4A; }
    .toast-warning .toast-progress { background:#EF9F27; }
    .toast-info    .toast-progress { background:#378ADD; }
    @keyframes toast-shrink { from{transform:scaleX(1)} to{transform:scaleX(0)} }
  `;
  document.head.appendChild(style);
})();

const TOAST_ICONS = { success: "✅", error: "❌", warning: "⚠️", info: "ℹ️" };

function toast(type, title, message, duration = 3800) {
  const container = document.getElementById("toast-container");
  if (!container) return;
  const el = document.createElement("div");
  el.className = `toast toast-${type}`;
  el.innerHTML = `
    <span class="toast-icon" aria-hidden="true">${TOAST_ICONS[type]}</span>
    <div class="toast-body">
      <p class="toast-title">${title}</p>
      <p class="toast-msg">${message}</p>
    </div>
    <button class="toast-close" aria-label="Fermer">✕</button>
    <div class="toast-progress" style="animation-duration:${duration}ms"></div>
  `;
  container.prepend(el);
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("show")));
  const timer = setTimeout(() => dismissToast(el), duration + 200);
  el.querySelector(".toast-close").addEventListener("click", () => { clearTimeout(timer); dismissToast(el); });
}

function dismissToast(el) {
  el.classList.add("hide");
  setTimeout(() => el.remove(), 400);
}

function confirmerAction(message, onOui) {
  _ouvrirModal(`
    <p style="font-size:15px;color:#333;margin:0 0 24px;line-height:1.6;">${message}</p>
    <div style="display:flex;gap:10px;justify-content:flex-end;">
      <button type="button" onclick="_fermerModal()" style="padding:10px 20px;border:1px solid #ddd;border-radius:6px;background:#f5f5f5;cursor:pointer;">Annuler</button>
      <button type="button" id="btnOuiConfirm" style="padding:10px 20px;border:none;border-radius:6px;background:#c62828;color:white;font-weight:bold;cursor:pointer;">Supprimer</button>
    </div>
  `);
  document.getElementById("btnOuiConfirm").onclick = () => { _fermerModal(); onOui(); };
}

function demanderValeur(titre, sousTitre, placeholder, valeurDefaut, onValider) {
  _ouvrirModal(`
    <h3 style="margin:0 0 6px;font-size:16px;color:#1565c0;">${titre}</h3>
    <p style="font-size:13px;color:#888;margin:0 0 16px;">${sousTitre}</p>
    <input id="inputModal" type="number" placeholder="${placeholder}" value="${valeurDefaut}"
      style="width:100%;padding:10px;border:1px solid #ddd;border-radius:6px;font-size:14px;box-sizing:border-box;margin-bottom:16px;"/>
   <div style="display:flex;gap:10px;justify-content:flex-end;">
      <button type="button" onclick="_fermerModal()" style="padding:10px 20px;border:1px solid #ddd;border-radius:6px;background:#f5f5f5;cursor:pointer;">Annuler</button>
      <button type="button" id="btnValiderModal" style="padding:10px 20px;border:none;border-radius:6px;background:#1565c0;color:white;font-weight:bold;cursor:pointer;">Valider</button>
    </div>
  `);
  const input = document.getElementById("inputModal");
  input.focus(); input.select();
  document.getElementById("btnValiderModal").onclick = () => { _fermerModal(); onValider(input.value); };
  input.addEventListener("keydown", e => { if (e.key === "Enter") { _fermerModal(); onValider(input.value); } });
}

function _ouvrirModal(contenuHtml) {
  let overlay = document.getElementById("modalOverlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "modalOverlay";
    overlay.style.cssText = `
      position:fixed;top:0;left:0;width:100%;height:100%;
      background:rgba(0,0,0,0.45);z-index:9998;
      display:flex;align-items:center;justify-content:center;
    `;
    overlay.onclick = (e) => { if (e.target === overlay) _fermerModal(); };
    document.body.appendChild(overlay);
  }
  overlay.innerHTML = `
    <div style="background:white;border-radius:12px;padding:28px;width:380px;max-width:90%;box-shadow:0 8px 32px rgba(0,0,0,.2);">
      ${contenuHtml}
    </div>
  `;
  overlay.style.display = "flex";
}

function _fermerModal() {
  const overlay = document.getElementById("modalOverlay");
  if (overlay) overlay.style.display = "none";
}