const CSV_FILE = "products.csv";

// Change this to your WhatsApp number, including country code.
// Example Sri Lanka: 94771234567
const WHATSAPP_NUMBER = "94771234567";

async function loadProducts() {
  const response = await fetch(CSV_FILE);
  if (!response.ok) throw new Error("Could not load products.csv");
  const text = await response.text();
  return parseCSV(text);
}

function parseCSV(text) {
  const rows = [];
  let row = [], value = "", quoted = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i], next = text[i + 1];
    if (c === '"' && next === '"') { value += '"'; i++; }
    else if (c === '"') quoted = !quoted;
    else if (c === "," && !quoted) { row.push(value.trim()); value = ""; }
    else if ((c === "\n" || c === "\r") && !quoted) {
      if (c === "\r" && next === "\n") i++;
      row.push(value.trim()); value = "";
      if (row.some(x => x !== "")) rows.push(row);
      row = [];
    } else value += c;
  }
  if (value || row.length) {
    row.push(value.trim());
    if (row.some(x => x !== "")) rows.push(row);
  }

  const headers = rows.shift().map(h => h.trim());
  return rows.map(r => Object.fromEntries(headers.map((h, i) => [h, r[i] || ""])));
}

function productCard(p) {
  const image = p.image
    ? `<img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}">`
    : `<div class="placeholder">${p.category === "Laptop" ? "💻" : "📱"}</div>`;

  return `
    <article class="product-card">
      <a href="detail.html?id=${encodeURIComponent(p.id)}">
        <div class="product-image">${image}</div>
        <div class="product-info">
          <span class="badge">${escapeHtml(p.condition)}</span>
          <h3>${escapeHtml(p.name)}</h3>
          <div class="specs">${escapeHtml(p.short_specs)}</div>
          <div class="price">${escapeHtml(p.price)}</div>
          <div class="view-button">View Details</div>
        </div>
      </a>
    </article>`;
}

async function renderHome() {
  const laptopGrid = document.querySelector("#laptop-grid");
  if (!laptopGrid) return;

  try {
    const products = await loadProducts();
    const laptops = products.filter(p => p.category.toLowerCase() === "laptop");
    const phones = products.filter(p => p.category.toLowerCase() === "phone");

    laptopGrid.innerHTML = laptops.map(productCard).join("");
    document.querySelector("#phone-grid").innerHTML = phones.map(productCard).join("");
    document.querySelector("#laptop-count").textContent = `${laptops.length} items`;
    document.querySelector("#phone-count").textContent = `${phones.length} items`;
  } catch (e) {
    document.querySelector("#message").textContent =
      "Products could not be loaded. Run the website through a local web server.";
  }
}

async function renderDetail() {
  const container = document.querySelector("#product-detail");
  if (!container) return;

  const id = new URLSearchParams(location.search).get("id");
  try {
    const products = await loadProducts();
    const p = products.find(x => x.id === id);

    if (!p) {
      container.innerHTML = "<p>Product not found.</p>";
      return;
    }

    const image = p.image
      ? `<img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}">`
      : `<div class="placeholder">${p.category === "Laptop" ? "💻" : "📱"}</div>`;

    const message = `Hi TEKWORKS, I'm interested in ${p.name} (${p.id}). Is it still available?`;

    container.innerHTML = `
      <div class="detail-card">
        <div class="detail-image">${image}</div>
        <div class="detail-content">
          <span class="badge">${escapeHtml(p.condition)}</span>
          <h1>${escapeHtml(p.name)}</h1>
          <div class="detail-price">${escapeHtml(p.price)}</div>
          <p class="detail-description">${p.description}</p>
          <table class="spec-table">
            <tr><td>Category</td><td>${escapeHtml(p.category)}</td></tr>
            <tr><td>Model</td><td>${escapeHtml(p.model)}</td></tr>
            <tr><td>Condition</td><td>${escapeHtml(p.condition)}</td></tr>
            <tr><td>CPU</td><td>${escapeHtml(p.cpu)}</td></tr>
            <tr><td>RAM</td><td>${escapeHtml(p.ram)}</td></tr>
            <tr><td>Storage</td><td>${escapeHtml(p.storage)}</td></tr>
            <tr><td>Display</td><td>${escapeHtml(p.display)}</td></tr>
            <tr><td>Battery</td><td>${escapeHtml(p.battery)}</td></tr>
            <tr><td>Warranty</td><td>${escapeHtml(p.warranty)}</td></tr>
          </table>
          <a class="whatsapp"
             target="_blank"
             href="https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}">
             WhatsApp Us
          </a>
        </div>
      </div>`;
  } catch (e) {
    container.innerHTML = "<p>Product details could not be loaded.</p>";
  }
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  }[c]));
}

renderHome();
renderDetail();
