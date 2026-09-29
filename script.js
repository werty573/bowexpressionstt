/* =========================================================
   EDITABLE DATA: update products, budgets and categories here
   ========================================================= */
const CATEGORIES = ["Hair Bows", "Flower Crowns", "Fascinators", "Wrist Corsages", "Boutonnieres"];

const BUDGET_RANGES = [
  "Under $100",
  "$100 - $250",
  "$250 - $500",
  "$500 - $1,000",
  "$1,000+"
];

const PRODUCTS = [
  { id: 1,  category: "Hair Bows",      title: "Satin Signature Bow",     description: "Double-layered satin with a hand-wrapped center knot and alligator clip.", price: "From $85.00", image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=70" },
  { id: 2,  category: "Hair Bows",      title: "Velvet Holiday Bow",      description: "Rich velvet with gold-edged ribbon, made for festive occasions.",         price: "From $70.00", image: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?auto=format&fit=crop&w=800&q=70" },
  { id: 3,  category: "Flower Crowns",  title: "Blush Bloom Tiara",       description: "Silk florals and pearl accents wired onto a flexible, comfortable band.", price: "From $120.00", image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=70" },
  { id: 4,  category: "Flower Crowns",  title: "Kanzashi Satin Headband", description: "Hand-folded satin Kanzashi flowers stitched petal by petal.",             price: "From $95.00", image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=800&q=70" },
  { id: 5,  category: "Fascinators",    title: "Bridal Feather Fascinator", description: "Feathers, tulle and crystal detailing on a secure headband base.",      price: "From $150.00", image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=70" },
  { id: 6,  category: "Fascinators",    title: "Garden Party Fascinator", description: "Sculpted florals and netting, balanced for all-day wear.",               price: "From $130.00", image: "https://images.unsplash.com/photo-1525268771113-32d9e9021a97?auto=format&fit=crop&w=800&q=70" },
  { id: 7,  category: "Wrist Corsages", title: "Pearl Rose Corsage",      description: "Preserved roses with pearl beading on a stretch satin wristband.",       price: "From $55.00", image: "https://images.unsplash.com/photo-1487530811176-3780de880c2d?auto=format&fit=crop&w=800&q=70" },
  { id: 8,  category: "Wrist Corsages", title: "Prom Night Corsage",      description: "Color-matched florals and ribbon tailored to your outfit.",              price: "From $50.00", image: "https://images.unsplash.com/photo-1455659817273-f96807779a8a?auto=format&fit=crop&w=800&q=70" },
  { id: 9,  category: "Boutonnieres",   title: "Classic Rose Boutonniere", description: "Single silk rose with greenery, wrapped in satin and pinned.",          price: "From $30.00", image: "https://images.unsplash.com/photo-1626875387820-c3d626938fe5?auto=format&fit=crop&w=800&q=70" },
  { id: 10, category: "Boutonnieres",   title: "Wedding Party Boutonniere", description: "Coordinated florals for groom and groomsmen, made to match the bouquet.", price: "From $35.00", image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=70" }
];
/* ================== END EDITABLE DATA ================== */

const $ = (sel) => document.querySelector(sel);
const filtersEl = $("#filters");
const gridEl = $("#galleryGrid");
const form = $("#inquiryForm");
const typeSelect = $("#type");
const budgetSelect = $("#budget");
const toastEl = $("#toast");
let activeCategory = "All";
let toastTimer;

function escapeHTML(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

/* ---------- Gallery ---------- */
function renderFilters() {
  filtersEl.innerHTML = ["All", ...CATEGORIES].map((cat) =>
    `<button type="button" class="filter-btn${cat === activeCategory ? " active" : ""}" role="tab" aria-selected="${cat === activeCategory}" data-cat="${escapeHTML(cat)}">${escapeHTML(cat)}</button>`
  ).join("");
}

function renderGallery() {
  const items = activeCategory === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === activeCategory);
  if (!items.length) {
    gridEl.innerHTML = `<p class="section-head">No pieces in this category yet. Use the form below to request a custom design.</p>`;
    return;
  }
  gridEl.innerHTML = items.map((p) => `
    <article class="card">
      <div class="card-img"><img src="${escapeHTML(p.image)}" alt="${escapeHTML(p.title)}" loading="lazy"></div>
      <div class="card-body">
        <p class="card-cat">${escapeHTML(p.category)}</p>
        <h3>${escapeHTML(p.title)}</h3>
        <p class="card-desc">${escapeHTML(p.description)}</p>
        <p class="card-price">${escapeHTML(p.price)}</p>
        <a href="#inquiry" class="btn btn-outline" data-inquire="${escapeHTML(p.category)}" data-title="${escapeHTML(p.title)}">Inquire About This Style</a>
      </div>
    </article>`).join("");
}

filtersEl.addEventListener("click", (e) => {
  const btn = e.target.closest(".filter-btn");
  if (!btn) return;
  activeCategory = btn.dataset.cat;
  renderFilters();
  renderGallery();
});

/* "Inquire" buttons pre-fill the form's accessory type and notes */
gridEl.addEventListener("click", (e) => {
  const link = e.target.closest("[data-inquire]");
  if (!link) return;
  typeSelect.value = link.dataset.inquire;
  const notes = $("#notes");
  if (!notes.value.trim()) notes.value = `I'm interested in the "${link.dataset.title}" style. `;
});

/* ---------- Form setup ---------- */
function populateSelects() {
  CATEGORIES.forEach((c) => typeSelect.add(new Option(c, c)));
  typeSelect.add(new Option("Something else / not sure yet", "Other"));
  BUDGET_RANGES.forEach((b) => budgetSelect.add(new Option(b, b)));
  $("#date").min = new Date().toISOString().split("T")[0];
}

function setError(input, message) {
  const field = input.closest(".field");
  let err = field.querySelector(".error");
  if (message) {
    field.classList.add("invalid");
    if (!err) { err = document.createElement("span"); err.className = "error"; err.setAttribute("role", "alert"); field.appendChild(err); }
    err.textContent = message;
  } else {
    field.classList.remove("invalid");
    if (err) err.remove();
  }
}

function validate() {
  let firstBad = null;
  const rules = {
    name: (v) => (v.trim().length < 2 ? "Enter your full name." : ""),
    email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Enter a valid email address."),
    phone: (v) => (v.replace(/\D/g, "").length < 7 ? "Enter a phone or WhatsApp number." : ""),
    date: (v) => (!v ? "Choose your event date." : ""),
    type: (v) => (!v ? "Choose an accessory type." : ""),
    budget: (v) => (!v ? "Choose a budget range." : "")
  };
  Object.keys(rules).forEach((id) => {
    const input = form.elements[id];
    const msg = rules[id](input.value);
    setError(input, msg);
    if (msg && !firstBad) firstBad = input;
  });
  if (firstBad) firstBad.focus();
  return !firstBad;
}

form.addEventListener("input", (e) => { if (e.target.closest(".field.invalid")) setError(e.target, ""); });

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!validate()) { showToast("Please fix the highlighted fields.", true); return; }
  const data = Object.fromEntries(new FormData(form).entries());
  data.submittedAt = new Date().toISOString();
  console.log("Inquiry received:", data); // Replace with fetch() to your backend/email service
  form.reset();
  showToast("Inquiry Submitted Successfully! We will contact you via email shortly.");
});

/* ---------- Toast ---------- */
function showToast(message, isError = false) {
  toastEl.textContent = message;
  toastEl.style.borderLeftColor = isError ? "#B3372F" : "";
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), 5000);
}

/* ---------- Navigation ---------- */
const header = $("#header");
const navToggle = $("#navToggle");
const navLinks = $("#navLinks");

window.addEventListener("scroll", () => header.classList.toggle("scrolled", window.scrollY > 10), { passive: true });

navToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(open));
});
navLinks.addEventListener("click", (e) => {
  if (e.target.closest("a")) { navLinks.classList.remove("open"); navToggle.setAttribute("aria-expanded", "false"); }
});

/* Highlight the nav link for the section in view */
const sections = document.querySelectorAll("main section[id]");
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.querySelectorAll("a:not(.btn)").forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${entry.target.id}`));
  });
}, { rootMargin: "-45% 0px -50% 0px" });
sections.forEach((s) => observer.observe(s));

/* ---------- Init ---------- */
$("#year").textContent = new Date().getFullYear();
populateSelects();
renderFilters();
renderGallery();
