// Mobile nav
const burger=document.getElementById('burger');const navLinks=document.getElementById('navLinks');
if(burger)burger.addEventListener('click',()=>navLinks.classList.toggle('open'));
// Sticky nav shadow
const nav=document.getElementById('nav');
if(nav)window.addEventListener('scroll',()=>{nav.style.boxShadow=window.scrollY>10?'0 6px 24px rgba(0,0,0,.06)':'none';});
// Login modal after 5s (first visit)
const modal=document.getElementById('loginModal');
function openModal(){if(modal)modal.classList.add('open');}
function closeModal(){if(modal)modal.classList.remove('open');}
if(modal){
  if(!localStorage.getItem('rrk_member'))setTimeout(openModal,5000);
  modal.querySelectorAll('[data-close]').forEach(el=>el.addEventListener('click',closeModal));
  const form=document.getElementById('loginForm');
  if(form)form.addEventListener('submit',e=>{e.preventDefault();localStorage.setItem('rrk_member','1');closeModal();window.open('https://chat.whatsapp.com/YOUR_COMMUNITY_LINK','_blank');});
}
// Cart
const CART_KEY='rrk_cart';
function getCart(){return JSON.parse(localStorage.getItem(CART_KEY)||'[]');}
function saveCart(c){localStorage.setItem(CART_KEY,JSON.stringify(c));renderCart();}
function addToCart(name,price){const cart=getCart();const item=cart.find(i=>i.name===name);if(item)item.qty++;else cart.push({name,price,qty:1});saveCart(cart);openCart();}
function changeQty(name,delta){let cart=getCart();const item=cart.find(i=>i.name===name);if(!item)return;item.qty+=delta;if(item.qty<=0)cart=cart.filter(i=>i.name!==name);saveCart(cart);}
function removeItem(name){saveCart(getCart().filter(i=>i.name!==name));}
function cartTotal(){return getCart().reduce((s,i)=>s+i.price*i.qty,0);}
function renderCart(){
  const wrap=document.getElementById('cartItems');const totalEl=document.getElementById('cartTotal');const countEl=document.getElementById('cartCount');
  if(!wrap)return;const cart=getCart();
  if(countEl)countEl.textContent=cart.reduce((s,i)=>s+i.qty,0);
  if(cart.length===0){wrap.innerHTML='<div class="cart-empty"><div class="cart-empty__ic">🛍️</div><p>Your plate is empty</p><span>Add something delicious!</span></div>';}
  else{wrap.innerHTML=cart.map(i=>`<div class="cart-row"><div><b>${i.name}</b><span>₹${i.price}</span></div><div class="qty"><button onclick="changeQty('${i.name}',-1)">−</button><span>${i.qty}</span><button onclick="changeQty('${i.name}',1)">+</button><button class="del" onclick="removeItem('${i.name}')">🗑️</button></div></div>`).join('');}
  if(totalEl)totalEl.textContent='₹'+cartTotal();
  const upsell=document.getElementById('upsell');
  if(upsell&&cartTotal()>1000&&!sessionStorage.getItem('upsell_seen')){upsell.classList.add('open');sessionStorage.setItem('upsell_seen','1');}
}
function openCart(){const d=document.getElementById('cartDrawer');if(d)d.classList.add('open');}
function closeCart(){const d=document.getElementById('cartDrawer');if(d)d.classList.remove('open');}
function closeUpsell(){const u=document.getElementById('upsell');if(u)u.classList.remove('open');}
function checkout(){
  const cart=getCart();if(cart.length===0)return alert('Your cart is empty');
  const mode=document.querySelector('input[name="mode"]:checked');const type=mode?mode.value:'Takeaway';
  let msg=`*New RRK Chicken Order*%0A(${type})%0A%0A`;
  cart.forEach(i=>{msg+=`${i.qty} x ${i.name} - ₹${i.price*i.qty}%0A`;});
  msg+=`%0A*Total: ₹${cartTotal()}*`;
  window.open(`https://wa.me/919999999999?text=${msg}`,'_blank');
}
// Menu category filter
function filterCat(cat,el){
  document.querySelectorAll('.cat').forEach(c=>c.classList.remove('active'));
  if(el)el.classList.add('active');
  document.querySelectorAll('[data-cat]').forEach(card=>{card.style.display=(cat==='all'||card.dataset.cat===cat)?'':'none';});
}
// Craft my plate chips + summary
function pickChip(el,group){document.querySelectorAll(`.chip[data-group="${group}"]`).forEach(c=>c.classList.remove('active'));el.classList.add('active');}
document.addEventListener('DOMContentLoaded',renderCart);
