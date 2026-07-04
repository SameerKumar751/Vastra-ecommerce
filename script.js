const products = [
  // sample product data (id, title, price, category, image)

  {id:1,title:'Banarasi Silk Saree - Ruby',price:7499,category:'saree',img:'https://cdn-image.blitzshopdeck.in/ShopdeckCatalogue/tr:f-webp,w-600,fo-auto/626a643eb6df8763158bbfe0/media/OUTSTANDING_RED_COLOUR_SOFT_COTTON_SAREE_WITH_HEAVY_BROCADE_BLOUSE_5OUC0YR6HF_2024-03-22_1.jpg'},

  {id:2,title:'Handloom Cotton Kurta - Indigo',price:2199,category:'kurta',img:'https://www.kusvaa.com/wp-content/uploads/2024/09/kusvaa-wkr001-nicika-cotton-handloom-kurta-pocket-hd.jpg'},

  {id:3,title:'Temple Jewellery Set - Gold Tone',price:4199,category:'jewelry',img:'https://priyaasi.com/cdn/shop/products/NL-PR-10685.CR.jpg?v=1636978905'},

  {id:4,title:'Kolhapuri Leather Sandals',price:1899,category:'footwear',img:'https://egoss.in/cdn/shop/files/KP-02_BROWN.jpg?v=1753876129&width=1950'},

  {id:5,title:'Kanchipuram Saree - Peacock',price:9999,category:'saree',img:'https://www.southindiaeshop.com/cdn/shop/files/sa-ga-h11519956-gree-fl-1-1-67f6568ccba40.webp?v=1744197286'},

  {id:6,title:'Chikankari Kurta - Ivory',price:2099,category:'kurta',img:'https://img.perniaspopupshop.com/catalog/product/r/b/RBRM122273_3.jpg?impolicy=detailimageprod'},

  {id:7,title:'Handmade Jutti - Embroidered',price:1,category:'footwear',img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNSYpFMmgYcpeXzpFnD4uZ9fkZNKFWNFzLKQ&s'},

  {id:8,title:'Silver Filigree Earrings',price:1699,category:'jewelry',img:'https://shop.gaatha.com/image/catalog/data/urban%20express/6-10-16/Filigry.jpg'},

  {id:9,title:'Handmade Embroidery Jacket',price:6799,category:'jacket',img:'https://cpimg.tistatic.com/10134030/b/4/Indian-Handmade-Embroidery-Jacket..jpg'},

  {id:10,title:'Sherwani Wedding Wear',price:5499,category:'kurta',img:'https://i.pinimg.com/736x/50/da/75/50da7510fb800f699a5fa1155d4ba042.jpg'}
];


// --- DOM references
const productsGrid = document.getElementById('productsGrid');
const categoryFilter = document.getElementById('categoryFilter');
const sortSelect = document.getElementById('sortSelect');
const searchToggle = document.getElementById('searchToggle');
const searchBar = document.getElementById('searchBar');
const searchInput = document.getElementById('searchInput');

const quickView = document.getElementById('quickView');
const quickBody = document.getElementById('quickBody');
const closeQuick = document.getElementById('closeQuick');

const cartBtn = document.getElementById('cartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.getElementById('closeCart');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const checkoutBtn = document.getElementById('checkoutBtn');

const newsletterForm = document.getElementById('newsletterForm');
const yearSpan = document.getElementById('year');

// --- Cart state (persisted in localStorage)
let cart = JSON.parse(localStorage.getItem('vastra_cart') || '[]');

function saveCart(){
  localStorage.setItem('vastra_cart', JSON.stringify(cart));
  updateCartUI();
}

function updateCartUI(){
  const totalItems = cart.reduce((s,i)=>s+i.qty,0);
  cartCount.textContent = totalItems;
  cartItemsContainer.innerHTML = '';
  if(cart.length === 0){
    cartItemsContainer.innerHTML = '<p style="color:var(--muted);padding:0.6rem">Your cart is empty.</p>';
    cartTotal.textContent = '₹0';
    return;
  }
  let total = 0;
  cart.forEach(item=>{
    const prod = products.find(p=>p.id===item.id);
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <img src="${prod.img}" alt="${prod.title}" />
      <div style="flex:1">
        <div style="display:flex;justify-content:space-between">
          <strong>${prod.title}</strong>
          <span>₹${(prod.price*item.qty).toLocaleString()}</span>
        </div>
        <div style="display:flex;align-items:center;gap:0.6rem;margin-top:0.5rem">
          <div class="qty-controls">
            <button data-action="dec" data-id="${prod.id}">−</button>
            <span style="padding:0 0.6rem">${item.qty}</span>
            <button data-action="inc" data-id="${prod.id}">+</button>
          </div>
          <button data-action="remove" data-id="${prod.id}" style="margin-left:auto;background:none;border:0;color:var(--muted);cursor:pointer">Remove</button>
        </div>
      </div>
    `;
    cartItemsContainer.appendChild(row);
    total += prod.price * item.qty;
  });
  cartTotal.textContent = `₹${total.toLocaleString()}`;
}

// --- Product rendering
function renderProducts(list){
  productsGrid.innerHTML = '';
  list.forEach(p=>{
    const col = document.createElement('div');
    col.className = 'product-card';
    col.innerHTML = `
      <div class="product-image">
        <img src="${p.img}" alt="${p.title}" />
      </div>
      <div class="product-info">
        <h4 class="product-title">${p.title}</h4>
        <div class="product-meta">
          <span class="price">₹${p.price.toLocaleString()}</span>
          <span style="color:var(--muted);text-transform:capitalize">${p.category}</span>
        </div>
      </div>
      <div class="card-actions">
        <button class="btn" data-action="quick" data-id="${p.id}">Quick View</button>
        <button class="btn btn-primary" data-action="add" data-id="${p.id}">Add to Cart</button>
      </div>
    `;
    productsGrid.appendChild(col);
  });
}

// --- Filtering / Sorting / Search
function applyFilters(){
  const cat = categoryFilter.value;
  const sort = sortSelect.value;
  const search = searchInput.value.trim().toLowerCase();
  let list = [...products];
  if(cat !== 'all'){
    list = list.filter(p => p.category === cat);
  }
  if(search){
    list = list.filter(p => p.title.toLowerCase().includes(search) || p.category.toLowerCase().includes(search));
  }
  if(sort === 'low') list.sort((a,b)=>a.price-b.price);
  if(sort === 'high') list.sort((a,b)=>b.price-a.price);
  renderProducts(list);
}

// --- Quick View
function openQuick(id){
  const p = products.find(x=>x.id===id);
  quickBody.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
      <div>
        <img src="${p.img}" style="width:100%;height:350px;object-fit:cover;border-radius:10px" alt="${p.title}" />
      </div>
      <div>
        <h2 style="margin-top:0;font-family:'Playfair Display'">${p.title}</h2>
        <p style="color:var(--muted);margin:0.4rem 0">Category: <strong style="color:var(--peacock)">${p.category}</strong></p>
        <p style="font-size:1.35rem;color:var(--maroon);font-weight:700;margin:0.6rem 0">₹${p.price.toLocaleString()}</p>
        <p style="color:var(--muted)">A curated artisan piece — perfect for festivals and special occasions.</p>
        <div style="margin-top:1rem;display:flex;gap:0.6rem">
          <button class="btn btn-primary" id="quickAdd" data-id="${p.id}">Add to Cart</button>
          <button class="btn" id="quickClose">Close</button>
        </div>
      </div>
    </div>
  `;
  quickView.classList.remove('hidden');
}

// --- Cart operations
function addToCart(id, qty=1){
  const exist = cart.find(i=>i.id===id);
  if(exist) exist.qty += qty;
  else cart.push({id,qty});
  saveCart();
  // small feedback
  flashMessage('Added to cart');
}

function changeQty(id,delta){
  const it = cart.find(i=>i.id===id);
  if(!it) return;
  it.qty += delta;
  if(it.qty <= 0) cart = cart.filter(i=>i.id !== id);
  saveCart();
}

function removeFromCart(id){
  cart = cart.filter(i=>i.id !== id);
  saveCart();
}

// --- Event listeners (delegated)
document.addEventListener('click', e=>{
  const target = e.target;
  // product actions
  if(target.dataset.action === 'add'){
    addToCart(Number(target.dataset.id));
  }
  if(target.dataset.action === 'quick'){
    openQuick(Number(target.dataset.id));
  }
  // quick view add / close
  if(target.id === 'quickAdd'){ addToCart(Number(target.dataset.id)); quickView.classList.add('hidden'); }
  if(target.id === 'quickClose' || target.id === 'closeQuick'){ quickView.classList.add('hidden'); }
  if(target === closeQuick) quickView.classList.add('hidden');

  // cart sidebar open / close
 if(target === cartBtn) {
  cartSidebar.classList.remove('hidden');
  cartSidebar.setAttribute('aria-hidden','false');
}
  // if(target === closeCart) { cartSidebar.classList.add('hidden'); cartSidebar.setAttribute('aria-hidden','true'); }

  // cart item buttons
  if(target.dataset.action === 'inc') changeQty(Number(target.dataset.id), 1);
  if(target.dataset.action === 'dec') changeQty(Number(target.dataset.id), -1);
  if(target.dataset.action === 'remove') removeFromCart(Number(target.dataset.id));

  // quick modal background close
  if(target === quickView) quickView.classList.add('hidden');

});

// search toggle
searchToggle.addEventListener('click', () => {
  if (searchBar.style.display === 'flex') {
    searchBar.style.display = 'none';
  } else {
    searchBar.style.display = 'flex';
  }
});

// filters
categoryFilter.addEventListener('change', applyFilters);
sortSelect.addEventListener('change', applyFilters);
searchInput.addEventListener('input', () => {
  // small debounce
  clearTimeout(searchInput._deb);
  searchInput._deb = setTimeout(applyFilters, 220);
});

// close cart button (selected after render)
closeCart.addEventListener('click', ()=>{ cartSidebar.classList.add('hidden') });

// checkout
checkoutBtn.addEventListener('click', ()=>{
  if(cart.length === 0) { flashMessage('Your cart is empty'); return; }
  // Mock checkout flow
  alert('Thank you! Your order has been placed (mock).');
  cart = [];
  saveCart();
  cartSidebar.classList.add('hidden');
});

// newsletter
newsletterForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  const em = document.getElementById('newsletterEmail').value.trim();
  if(!em) return flashMessage('Enter a valid email');
  flashMessage('Subscribed — check your inbox!');
  newsletterForm.reset();
});

// utility: small toast
function flashMessage(msg='') {
  const t = document.createElement('div');
  t.textContent = msg;
  t.style = "position:fixed;left:50%;transform:translateX(-50%);bottom:30px;background:var(--peacock);color:#fff;padding:0.6rem 1rem;border-radius:8px;z-index:120;font-weight:600";
  document.body.appendChild(t);
  setTimeout(()=> t.style.opacity = '0.02', 1600);
  setTimeout(()=> t.remove(), 2000);
}

// initialize
function init(){
  renderProducts(products);
  applyFilters();
  updateCartUI();
  yearSpan.textContent = new Date().getFullYear();
}
init();