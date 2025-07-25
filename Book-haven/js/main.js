document.addEventListener('DOMContentLoaded', () => {
  // NAV TOGGLE (all pages)
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav   = document.querySelector('.main-nav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      mainNav.classList.toggle('open');
      navToggle.textContent = mainNav.classList.contains('open') ? '✕' : '☰';
    });
  }

  window.addEventListener('scroll', () => {
  const header = document.querySelector('.site-header');
  header.classList.toggle('stuck', window.scrollY > 10);
});

  // CAROUSEL (only on homepage)
  const slides = document.querySelectorAll('.slide');
  if (slides.length) {
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const dots    = document.querySelectorAll('.dot');
    let current   = 0;
    function showSlide(i) {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = (i + slides.length) % slides.length;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
    }
    prevBtn.addEventListener('click', () => showSlide(current - 1));
    nextBtn.addEventListener('click', () => showSlide(current + 1));
    dots.forEach(d => d.addEventListener('click', e => showSlide(+e.target.dataset.index)));
    setInterval(() => showSlide(current + 1), 5000);
  }


  // Filter and Search functionality
    class BookFilter {
      constructor() {
        this.books = Array.from(document.querySelectorAll('.book-card'));
        this.categoryFilter = document.getElementById('category-filter');
        this.priceFilter = document.getElementById('price-filter');
        this.authorFilter = document.getElementById('author-filter');
        this.searchInput = document.getElementById('search-input');
        this.activeFiltersContainer = document.getElementById('active-filters');
        this.noResults = document.getElementById('no-results');
        this.galleryGrid = document.getElementById('gallery-grid');
        
        this.initEventListeners();
      }
      
      initEventListeners() {
        if (this.categoryFilter) this.categoryFilter.addEventListener('change', () => this.applyFilters());
        if (this.priceFilter) this.priceFilter.addEventListener('change', () => this.applyFilters());
        if (this.authorFilter) this.authorFilter.addEventListener('change', () => this.applyFilters());
        if (this.searchInput) this.searchInput.addEventListener('input', () => this.applyFilters());
      }
      
      applyFilters() {
        const category = this.categoryFilter?.value || '';
        const priceRange = this.priceFilter?.value || '';
        const author = this.authorFilter?.value || '';
        const searchTerm = this.searchInput?.value.toLowerCase() || '';
        
        let visibleCount = 0;
        
        this.books.forEach(book => {
          let showBook = true;
          
          // Category filter
          if (category && book.dataset.cat !== category) {
            showBook = false;
          }
          
          // Price filter
          if (priceRange && !this.matchesPriceRange(book.dataset.price, priceRange)) {
            showBook = false;
          }
          
          // Author filter
          if (author && book.dataset.author !== author) {
            showBook = false;
          }
          
          // Search filter
          if (searchTerm && !book.dataset.title.toLowerCase().includes(searchTerm)) {
            showBook = false;
          }
          
          if (showBook) {
            book.classList.remove('hidden');
            visibleCount++;
          } else {
            book.classList.add('hidden');
          }
        });
        
        this.updateActiveFilters();
        this.toggleNoResults(visibleCount === 0);
      }
      
      matchesPriceRange(price, range) {
        const bookPrice = parseInt(price);
        const [min, max] = range.split('-').map(Number);
        
        if (range === '1500-2000') {
          return bookPrice >= 1500;
        }
        
        return bookPrice >= min && bookPrice < max;
      }
      
      updateActiveFilters() {
        if (!this.activeFiltersContainer) return;
        
        const activeFilters = [];
        
        if (this.categoryFilter?.value) {
          activeFilters.push({
            type: 'category',
            value: this.categoryFilter.value,
            label: this.categoryFilter.options[this.categoryFilter.selectedIndex].text
          });
        }
        
        if (this.priceFilter?.value) {
          activeFilters.push({
            type: 'price',
            value: this.priceFilter.value,
            label: this.priceFilter.options[this.priceFilter.selectedIndex].text
          });
        }
        
        if (this.authorFilter?.value) {
          activeFilters.push({
            type: 'author',
            value: this.authorFilter.value,
            label: this.authorFilter.options[this.authorFilter.selectedIndex].text
          });
        }
        
        if (this.searchInput?.value) {
          activeFilters.push({
            type: 'search',
            value: this.searchInput.value,
            label: `"${this.searchInput.value}"`
          });
        }
        
        this.renderActiveFilters(activeFilters);
      }
      
      renderActiveFilters(filters) {
        if (!this.activeFiltersContainer) return;
        
        if (filters.length === 0) {
          this.activeFiltersContainer.classList.add('hidden');
          return;
        }
        
        this.activeFiltersContainer.classList.remove('hidden');
        
        let html = filters.map(filter => 
          `<span class="filter-tag">
            ${filter.label}
            <span class="remove" data-type="${filter.type}">×</span>
          </span>`
        ).join('');
        
        html += `<button class="clear-filters" onclick="bookFilter.clearAllFilters()">Clear All</button>`;
        
        this.activeFiltersContainer.innerHTML = html;
        
        // Add event listeners for remove buttons
        this.activeFiltersContainer.querySelectorAll('.remove').forEach(btn => {
          btn.addEventListener('click', (e) => {
            this.removeFilter(e.target.dataset.type);
          });
        });
      }
      
      removeFilter(type) {
        switch(type) {
          case 'category':
            if (this.categoryFilter) this.categoryFilter.value = '';
            break;
          case 'price':
            if (this.priceFilter) this.priceFilter.value = '';
            break;
          case 'author':
            if (this.authorFilter) this.authorFilter.value = '';
            break;
          case 'search':
            if (this.searchInput) this.searchInput.value = '';
            break;
        }
        this.applyFilters();
      }
      
      clearAllFilters() {
        if (this.categoryFilter) this.categoryFilter.value = '';
        if (this.priceFilter) this.priceFilter.value = '';
        if (this.authorFilter) this.authorFilter.value = '';
        if (this.searchInput) this.searchInput.value = '';
        this.applyFilters();
      }
      
      toggleNoResults(show) {
        if (!this.noResults || !this.galleryGrid) return;
        
        if (show) {
          this.noResults.classList.remove('hidden');
          this.galleryGrid.style.display = 'none';
        } else {
          this.noResults.classList.add('hidden');
          this.galleryGrid.style.display = 'grid';
        }
      }
    }
    
    // Initialize filter functionality only if elements exist (gallery page)
    if (document.getElementById('category-filter')) {
      const bookFilter = new BookFilter();
    }

// CART & "ADD TO CART" - Fixed Implementation
const cartBtn   = document.getElementById('cart-btn');
const modal     = document.getElementById('cart-modal');
const closeBtn  = document.getElementById('cart-close');
const itemsList = document.getElementById('cart-items');
const totalEl   = document.getElementById('cart-total');
const clearBtn  = document.getElementById('cart-clear');
const checkout  = document.getElementById('cart-checkout');
const countEl   = document.getElementById('cart-count');

function getCart() {
  return JSON.parse(localStorage.getItem('cart') || '[]');
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const qty = getCart().reduce((s,i) => s + i.qty, 0);
  if (countEl) countEl.textContent = qty;
}

// Make updateQuantity global so it can be called from onclick
window.updateQuantity = function(index, change) {
  let cart = getCart();
  if (cart[index]) {
    cart[index].qty += change;
    if (cart[index].qty <= 0) {
      cart.splice(index, 1);
    }
    saveCart(cart);
    renderCart();
  }
};

function renderCart() {
  if (!itemsList || !totalEl) return;
  const cart = getCart();
  itemsList.innerHTML = '';
  let total = 0;
  
  if (cart.length === 0) {
    itemsList.innerHTML = '<li class="empty-cart">Your cart is empty</li>';
    totalEl.textContent = 'Total: $0';
    if (checkout) checkout.disabled = true;
    return;
  }
  
  cart.forEach((item, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="cart-item">
        <span>${item.title} – $${item.price}</span>
        <div class="qty-controls">
          <button class="qty-btn" onclick="updateQuantity(${index}, -1)">-</button>
          <span class="qty-display">${item.qty}</span>
          <button class="qty-btn" onclick="updateQuantity(${index}, 1)">+</button>
        </div>
      </div>
    `;
    itemsList.appendChild(li);
    total += item.price * item.qty;
  });
  
  totalEl.textContent = `Total: $${total.toFixed(2)}`;
  if (checkout) checkout.disabled = false;
}

// Cart Modal Functions
function openCartModal() {
  renderCart();
  modal.classList.remove('hidden');
  showCart();
  closeBtn && closeBtn.focus();
}

function closeCartModal() {
  modal.classList.add('hidden');
}

function showCart() {
  document.getElementById('cart-view').style.display = 'block';
  document.getElementById('checkout-view').classList.remove('active');
  document.getElementById('success-view').classList.remove('active');
}

function showCheckout() {
  const cart = getCart();
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }
  
  // Update order summary
  const orderItems = document.getElementById('order-items');
  const subtotalEl = document.getElementById('subtotal');
  const taxEl = document.getElementById('tax');
  const finalTotalEl = document.getElementById('final-total');
  
  let subtotal = 0;
  orderItems.innerHTML = '';
  
  cart.forEach(item => {
    const div = document.createElement('div');
    div.className = 'order-item';
    div.innerHTML = `<span>${item.title} × ${item.qty}</span><span>$${(item.price * item.qty).toFixed(2)}</span>`;
    orderItems.appendChild(div);
    subtotal += item.price * item.qty;
  });
  
  const tax = subtotal * 0.08; // 8% tax
  const shipping = 5.99;
  const finalTotal = subtotal + tax + shipping;
  
  subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  taxEl.textContent = `$${tax.toFixed(2)}`;
  finalTotalEl.textContent = `$${finalTotal.toFixed(2)}`;
  
  document.getElementById('cart-view').style.display = 'none';
  document.getElementById('checkout-view').classList.add('active');
}

function clearCart() {
  if (confirm('Are you sure you want to clear your cart?')) {
    saveCart([]);
    renderCart();
  }
}

// Event Listeners
if (cartBtn) {
  cartBtn.addEventListener('click', openCartModal);
}

closeBtn?.addEventListener('click', closeCartModal);
clearBtn?.addEventListener('click', clearCart);
checkout?.addEventListener('click', showCheckout);

// Back to cart button
document.getElementById('back-to-cart')?.addEventListener('click', showCart);

// single ADD-TO-CART listener
const gallery = document.getElementById('gallery-grid');
gallery?.addEventListener('click', e => {
  if (!e.target.matches('.add-cart')) return;
  const card  = e.target.closest('.book-card');
  const id    = card.dataset.id;
  const title = card.querySelector('h3').textContent;
  const price = parseFloat(card.dataset.price);
  let cart = getCart();
  const existing = cart.find(i => i.id === id);
  if (existing) existing.qty++;
  else cart.push({ id, title, price, qty: 1 });
  saveCart(cart);
  alert(`Added "${title}" to cart.`);
});

// Checkout form submission
document.getElementById('checkout-form')?.addEventListener('submit', function(e) {
  e.preventDefault();
  
  // Simulate processing
  const submitBtn = this.querySelector('button[type="submit"]');
  submitBtn.textContent = 'Processing...';
  submitBtn.disabled = true;
  
  setTimeout(() => {
    document.getElementById('checkout-view').classList.remove('active');
    document.getElementById('success-view').classList.add('active');
    submitBtn.textContent = 'Complete Order';
    submitBtn.disabled = false;
    
    // Clear cart after successful order
    saveCart([]);
  }, 2000);
});

// Close modal when clicking outside
modal?.addEventListener('click', function(e) {
  if (e.target === this) {
    closeCartModal();
  }
});

// Format card number input
document.getElementById('cardNumber')?.addEventListener('input', function(e) {
  let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
  let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
  e.target.value = formattedValue;
});

// Format expiry date
document.getElementById('expiry')?.addEventListener('input', function(e) {
  let value = e.target.value.replace(/\D/g, '');
  if (value.length >= 2) {
    value = value.substring(0, 2) + '/' + value.substring(2, 4);
  }
  e.target.value = value;
});

// Initialize cart count on page load
updateCartCount();



  // --- FOOTER SUBSCRIBE FORM ---
// ✅ Newsletter subscribe form logic (no page reload)
const subscribeForm = document.getElementById('subscribe-form');
if (subscribeForm) {
  subscribeForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Optional: validate email here
    const emailInput = this.querySelector('input[type="email"]');
    const email = emailInput.value.trim();
    if (!email) {
      alert("Please enter a valid email.");
      return;
    }

    const confirmDiv = document.getElementById('subscribe-confirm');
    if (confirmDiv) {
      confirmDiv.classList.remove('hidden');
      setTimeout(() => confirmDiv.classList.add('hidden'), 3000);
    }
    this.reset();
  });
}

  // ✅ Feedback form logic (stores in sessionStorage)
const feedbackForm = document.getElementById('feedback-form');
if (feedbackForm) {
  feedbackForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('cust-name').value;
    const email = document.getElementById('cust-email').value;
    const details = document.getElementById('cust-details').value;

    const feedbackData = {
      name,
      email,
      details,
      submittedAt: new Date().toISOString()
    };

    sessionStorage.setItem('contactFeedback', JSON.stringify(feedbackData));

    const confirmDiv = document.getElementById('feedback-confirm');
    if (confirmDiv) {
      confirmDiv.classList.remove('hidden');
      setTimeout(() => confirmDiv.classList.add('hidden'), 3000);
    }
    this.reset();
  });
}

  // 5. GALLERY "LOAD MORE" & FILTER (page‐specific)
  const loadMore = document.getElementById('load-more');
  if (loadMore && gallery) {
    loadMore.addEventListener('click', () => {
      const cards = Array.from(gallery.querySelectorAll('.book-card'));
      cards.slice(0,8).forEach(c => gallery.appendChild(c.cloneNode(true)));
    });
  }
  const params = new URLSearchParams(location.search);
  const cat    = params.get('cat'), promo = params.get('promo');
  if ((cat||promo) && gallery) {
    gallery.querySelectorAll('.book-card').forEach(card => {
      if (
        (cat   && card.dataset.cat   !== cat) ||
        (promo && card.dataset.promo !== promo)
      ) card.style.display = 'none';
    });
  }

  // --- TESTIMONIALS SLIDER ---
const testiSlides = document.querySelectorAll('.testi-slide');
const testiPrev = document.querySelector('.testi-btn.prev');
const testiNext = document.querySelector('.testi-btn.next');

if (testiSlides.length && testiPrev && testiNext) {
  let testiIndex = 0;

  function showTestimonial(index) {
    // Remove active class from all slides
    testiSlides.forEach(slide => slide.classList.remove('active'));
    // Add active class to current slide
    testiSlides[index].classList.add('active');
  }

  // Initialize first slide as active
  showTestimonial(testiIndex);

  testiPrev.addEventListener('click', () => {
    testiIndex = (testiIndex - 1 + testiSlides.length) % testiSlides.length;
    showTestimonial(testiIndex);
  });

  testiNext.addEventListener('click', () => {
    testiIndex = (testiIndex + 1) % testiSlides.length;
    showTestimonial(testiIndex);
  });

  // Auto-rotate every 4s
  setInterval(() => {
    testiIndex = (testiIndex + 1) % testiSlides.length;
    showTestimonial(testiIndex);
  }, 4000);
}

});

document.addEventListener('DOMContentLoaded', () => {
  // --- TESTIMONIALS SLIDER ---
const testiSlides = document.querySelectorAll('.testi-slide');
const testiPrev = document.querySelector('.testi-btn.prev');
const testiNext = document.querySelector('.testi-btn.next');

if (testiSlides.length && testiPrev && testiNext) {
  let testiIndex = 0;

  function showTestimonial(index) {
    // Remove active class from all slides
    testiSlides.forEach(slide => slide.classList.remove('active'));
    // Add active class to current slide
    testiSlides[index].classList.add('active');
  }

  // Initialize first slide as active
  showTestimonial(testiIndex);

  testiPrev.addEventListener('click', () => {
    testiIndex = (testiIndex - 1 + testiSlides.length) % testiSlides.length;
    showTestimonial(testiIndex);
  });

  testiNext.addEventListener('click', () => {
    testiIndex = (testiIndex + 1) % testiSlides.length;
    showTestimonial(testiIndex);
  });

  // Auto-rotate every 4s
  setInterval(() => {
    testiIndex = (testiIndex + 1) % testiSlides.length;
    showTestimonial(testiIndex);
  }, 4000);
}
});

// FullCalendar setup - separate initialization
window.addEventListener('load', function() {
  const calendarEl = document.getElementById('fc-calendar');
  if (calendarEl) {
    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,listWeek'
      },
      events: [
        { title: 'Author Reading', date: '2025-07-10' },
        { title: 'Kids Story Hour', date: '2025-07-12' },
        { title: 'Poetry Workshop', date: '2025-07-18' },
        { title: 'Book Signing', date: '2025-07-20' },
        { title: 'Literary Festival', date: '2025-07-25' }
      ]
    });
    calendar.render();
  }
});
