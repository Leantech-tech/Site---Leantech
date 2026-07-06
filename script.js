// Hero Slideshow Auto-Change
let heroSlideIndex = 0;
let heroSlideTimer;
const heroSlides = document.querySelectorAll('.slideshow-container .slide');
const heroDots = document.querySelectorAll('.slideshow-dot');

function showHeroSlide(index) {
    heroSlides.forEach((slide, i) => {
        slide.classList.remove('active');
        heroDots[i]?.classList.remove('active');
    });
    heroSlideIndex = (index + heroSlides.length) % heroSlides.length;
    heroSlides[heroSlideIndex].classList.add('active');
    heroDots[heroSlideIndex]?.classList.add('active');
}

function changeHeroSlide(direction) {
    showHeroSlide(heroSlideIndex + direction);
    resetHeroTimer();
}

function goToHeroSlide(index) {
    showHeroSlide(index);
    resetHeroTimer();
}

function startHeroTimer() {
    if (heroSlideTimer) clearInterval(heroSlideTimer);
    heroSlideTimer = setInterval(() => {
        showHeroSlide(heroSlideIndex + 1);
    }, 3000);
}

function resetHeroTimer() {
    clearInterval(heroSlideTimer);
    startHeroTimer();
}

// Pause on hover
const slideshowContainer = document.querySelector('.slideshow-container');
if (slideshowContainer) {
    slideshowContainer.addEventListener('mouseenter', () => clearInterval(heroSlideTimer));
    slideshowContainer.addEventListener('mouseleave', startHeroTimer);
}

// Start auto-play
if (heroSlides.length > 0) {
    startHeroTimer();
}

// Header Scroll Effect
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
function initMobileMenu() {
    const headerNav = document.querySelector('.container-fluid.nav') || document.querySelector('#header .nav');
    const navLinks = document.querySelector('.nav-links');
    if (!headerNav || !navLinks) return;

    // Create Hamburger Menu if not exists
    if (!document.querySelector('.mobile-menu-btn')) {
        const btn = document.createElement('button');
        btn.className = 'mobile-menu-btn';
        btn.setAttribute('aria-label', 'Abrir menu de navegação');
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-controls', 'main-navigation');
        btn.type = 'button';
        btn.innerHTML = '<i class="fas fa-bars" aria-hidden="true"></i>';
        headerNav.appendChild(btn);

        btn.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('nav-active');
            btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            btn.setAttribute('aria-label', isOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
            const icon = btn.querySelector('i');
            icon.classList.toggle('fa-bars', !isOpen);
            icon.classList.toggle('fa-times', isOpen);
        });

        // Close mobile menu when clicking a link (except dropdown toggles)
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768 && !link.closest('.dropdown-menu')) {
                    navLinks.classList.remove('nav-active');
                    btn.setAttribute('aria-expanded', 'false');
                    btn.setAttribute('aria-label', 'Abrir menu de navegação');
                    const icon = btn.querySelector('i');
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            });
        });
    }

    // Dropdown for mobile
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        if (!link) return;
        link.setAttribute('aria-haspopup', 'true');
        link.setAttribute('aria-expanded', 'false');

        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                const target = e.target.closest('a');
                if (target && target.getAttribute('href').startsWith('#')) {
                    e.preventDefault();
                    const isActive = dropdown.classList.toggle('active');
                    link.setAttribute('aria-expanded', isActive ? 'true' : 'false');
                }
            }
        });
    });
}

// Cart Logic
function parsePrice(priceString) {
    if (!priceString) return 0;
    return parseFloat(priceString.replace('R$ ', '').replace(/\./g, '').replace(',', '.'));
}

function formatPrice(value) {
    return 'R$ ' + value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function addToCart(title, price, imgSrc) {
    let cart = JSON.parse(localStorage.getItem('leantech_cart')) || [];

    // Check if product already in cart
    const existingIndex = cart.findIndex(item => item.title === title);
    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({
            title: title,
            price: price,
            img: imgSrc,
            quantity: 1
        });
    }

    localStorage.setItem('leantech_cart', JSON.stringify(cart));
    updateCartCounter();
}

function updateCartCounter() {
    const cart = JSON.parse(localStorage.getItem('leantech_cart')) || [];
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const counterElement = document.getElementById('cart-count');
    if (counterElement) {
        counterElement.innerText = count;
        counterElement.style.display = count > 0 ? 'flex' : 'none';
    }
}

function loadCart() {
    const cart = JSON.parse(localStorage.getItem('leantech_cart')) || [];
    const container = document.getElementById('cart-content');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-basket"></i>
                <h3>Seu carrinho está vazio</h3>
                <p style="margin: 1rem 0 2rem;">Explore nossos produtos e adicione seus itens favoritos.</p>
                <a href="produtos-informatica.html" class="btn-cta">Ver Computadores & Peças</a>
            </div>
        `;
        return;
    }

    let html = `<table class="cart-table"><tbody>`;
    let total = 0;

    cart.forEach((item, index) => {
        const itemPrice = parsePrice(item.price);
        total += itemPrice * item.quantity;

        html += `
            <tr class="cart-item">
                <td><img src="${item.img}" alt="${item.title}"></td>
                <td>
                    <div class="cart-item-title">${item.title}</div>
                </td>
                <td>
                    <div class="cart-item-price">${item.price}</div>
                </td>
                <td>
                    <div class="quantity-control">
                        <button class="btn-qty" onclick="updateQuantity(${index}, -1)" aria-label="Diminuir quantidade"><i class="fas fa-minus"></i></button>
                        <span>${item.quantity}</span>
                        <button class="btn-qty" onclick="updateQuantity(${index}, 1)" aria-label="Aumentar quantidade"><i class="fas fa-plus"></i></button>
                    </div>
                </td>
                <td>
                    <button class="remove-item" onclick="removeItem(${index})" aria-label="Remover item" style="background: none; border: none;"><i class="fas fa-trash-alt"></i></button>
                </td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
        <div class="cart-summary">
            <div class="summary-row">
                <span>Produtos:</span>
                <span>${cart.length} itens</span>
            </div>
            <div class="summary-row summary-total">
                <span>Total:</span>
                <span>${formatPrice(total)}</span>
            </div>
            <button onclick="checkout()" class="btn-cta" style="width: 100%; border: none; margin-top: 1.5rem; cursor: pointer;">
                <i class="fab fa-whatsapp"></i> Finalizar Pedido
            </button>
        </div>
    `;

    container.innerHTML = html;
}

function updateQuantity(index, delta) {
    let cart = JSON.parse(localStorage.getItem('leantech_cart')) || [];
    cart[index].quantity += delta;

    if (cart[index].quantity < 1) {
        cart.splice(index, 1);
    }

    localStorage.setItem('leantech_cart', JSON.stringify(cart));
    loadCart();
    updateCartCounter();
}

function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('leantech_cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('leantech_cart', JSON.stringify(cart));
    loadCart();
    updateCartCounter();
}

function checkout() {
    const cart = JSON.parse(localStorage.getItem('leantech_cart')) || [];
    let message = "Olá! Gostaria de fazer um pedido:\n\n";
    let total = 0;

    cart.forEach(item => {
        message += `• ${item.title} (${item.quantity}x) - ${item.price}\n`;
        total += parsePrice(item.price) * item.quantity;
    });

    message += `\n*Total estimado: ${formatPrice(total)}*`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/551238333927?text=${encodedMessage}`, '_blank');
}

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    updateCartCounter();
    initProductCards();
    initMapLazyLoad();

    // Initialize cart page if on cart page
    if (document.getElementById('cart-content') && typeof loadCart === 'function') {
        loadCart();
    }
});

// Lazy load Google Maps iframe
function initMapLazyLoad() {
    const mapIframe = document.querySelector('iframe[data-src]');
    if (!mapIframe) return;

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    mapIframe.src = mapIframe.dataset.src;
                    observer.unobserve(mapIframe);
                }
            });
        }, { rootMargin: '200px' });
        observer.observe(mapIframe);
    } else {
        mapIframe.src = mapIframe.dataset.src;
    }
}

// Product Modal & Cart
function initProductCards() {
    document.querySelectorAll('.store-card').forEach(card => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `Ver detalhes de ${card.querySelector('.team-name')?.textContent || 'produto'}`);

        card.addEventListener('click', () => openCardProductModal(card));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openCardProductModal(card);
            }
        });
    });
}

function openCardProductModal(card) {
    const name = card.dataset.name || card.querySelector('.team-name')?.textContent || '';
    const image = card.dataset.image || card.querySelector('.team-photo img')?.src || '';
    const description = card.dataset.description || '';
    const price = card.dataset.price || card.querySelector('.product-price')?.textContent || '';
    const action = card.dataset.action || 'cart';
    openProductModal(name, image, description, price, action);
}

function openProductModal(name, image, description, price, action = 'cart') {
    const modal = document.getElementById('productModal');
    if (!modal) return;

    const nameEl = document.getElementById('modalProductName') || document.getElementById('modalTitle');
    const imageEl = document.getElementById('modalProductImage') || document.getElementById('modalImg');
    const descEl = document.getElementById('modalProductDescription') || document.getElementById('modalDesc');
    const priceEl = document.getElementById('modalProductPrice') || document.getElementById('modalPrice');
    const actionBtn = document.getElementById('modalActionBtn');

    if (nameEl) nameEl.textContent = name;
    if (descEl) descEl.textContent = description;
    if (priceEl) priceEl.textContent = price;

    if (imageEl) {
        if (image && image !== '') {
            imageEl.src = image;
            imageEl.style.display = 'block';
            if (imageEl.parentElement) {
                imageEl.parentElement.innerHTML = '';
                imageEl.parentElement.appendChild(imageEl);
                imageEl.parentElement.style.background = '#f8fafc';
            }
        } else {
            imageEl.style.display = 'none';
            if (imageEl.parentElement) {
                imageEl.parentElement.innerHTML = '<i class="fas fa-tag" style="font-size: 6rem; color: #94a3b8;"></i>';
                imageEl.parentElement.style.background = 'linear-gradient(135deg, #f1f5f9, #e2e8f0)';
                imageEl.parentElement.style.display = 'flex';
                imageEl.parentElement.style.alignItems = 'center';
                imageEl.parentElement.style.justifyContent = 'center';
                imageEl.parentElement.style.minHeight = '300px';
            }
        }
    }

    if (actionBtn) {
        window.currentProduct = { title: name, price, img: image };
        if (action === 'cart') {
            actionBtn.onclick = () => {
                addToCart(name, price, image);
                closeProductModal();
            };
            actionBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> Adicionar ao carrinho';
            actionBtn.removeAttribute('href');
            actionBtn.removeAttribute('target');
        } else {
            const msg = encodeURIComponent('Olá! Gostaria de um orçamento para: ' + name);
            actionBtn.href = 'https://wa.me/551238333927?text=' + msg;
            actionBtn.target = '_blank';
            actionBtn.onclick = null;
            actionBtn.innerHTML = '<i class="fab fa-whatsapp"></i> Solicitar Orçamento';
        }
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProductModal() {
    const modal = document.getElementById('productModal');
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';

    // Reset the modal image container
    const imgContainer = modal.querySelector('.modal-image');
    if (imgContainer) {
        imgContainer.innerHTML = '<img id="modalProductImage" src="" alt="">';
    }
}

function filterProducts(category) {
    const cards = document.querySelectorAll('.store-card');
    cards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'block';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            }, 10);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
}

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    const modal = document.getElementById('productModal');
    if (modal && event.target === modal) {
        closeProductModal();
    }
});

// Scroll Reveal Animation (Intersection Observer)
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

// Select items to animate
const revealItems = document.querySelectorAll('.reveal');
revealItems.forEach(item => {
    observer.observe(item);
});

// Smooth Scroll for Nav Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Testimonials Carousel
const carousel = document.getElementById('testimonialsCarousel');
const track = carousel?.querySelector('.testimonials-track');
const cards = carousel?.querySelectorAll('.testimonial-card');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dotsContainer = document.getElementById('carouselDots');

if (carousel && track && cards.length > 0) {
    let currentIndex = 0;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = 0;

    // Get cards per view based on screen size
    function getCardsPerView() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    }

    let cardsPerView = getCardsPerView();
    let maxIndex = Math.max(0, cards.length - cardsPerView);

    // Create dots
    function createDots() {
        dotsContainer.innerHTML = '';
        const numDots = maxIndex + 1;
        for (let i = 0; i < numDots; i++) {
            const dot = document.createElement('div');
            dot.classList.add('carousel-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    // Update dots
    function updateDots() {
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    // Get card width including gap
    function getCardWidth() {
        const card = cards[0];
        const gap = 32; // 2rem gap
        return card.offsetWidth + gap;
    }

    // Go to slide
    function goToSlide(index) {
        currentIndex = Math.max(0, Math.min(index, maxIndex));
        const cardWidth = getCardWidth();
        currentTranslate = -currentIndex * cardWidth;
        prevTranslate = currentTranslate;
        track.style.transform = `translateX(${currentTranslate}px)`;
        updateDots();
    }

    // Next slide
    function nextSlide() {
        if (currentIndex < maxIndex) {
            goToSlide(currentIndex + 1);
        } else {
            goToSlide(0); // Loop back to start
        }
    }

    // Previous slide
    function prevSlide() {
        if (currentIndex > 0) {
            goToSlide(currentIndex - 1);
        } else {
            goToSlide(maxIndex); // Loop to end
        }
    }

    // Touch/Mouse events for dragging
    function touchStart(event) {
        isDragging = true;
        startPos = getPositionX(event);
        track.style.transition = 'none';
        animationID = requestAnimationFrame(animation);
    }

    function touchMove(event) {
        if (!isDragging) return;
        const currentPosition = getPositionX(event);
        currentTranslate = prevTranslate + currentPosition - startPos;
    }

    function touchEnd() {
        isDragging = false;
        cancelAnimationFrame(animationID);
        track.style.transition = 'transform 0.4s ease';

        const movedBy = currentTranslate - prevTranslate;
        const threshold = getCardWidth() / 4;

        if (movedBy < -threshold && currentIndex < maxIndex) {
            currentIndex++;
        } else if (movedBy > threshold && currentIndex > 0) {
            currentIndex--;
        }

        goToSlide(currentIndex);
    }

    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    function animation() {
        track.style.transform = `translateX(${currentTranslate}px)`;
        if (isDragging) requestAnimationFrame(animation);
    }

    // Event listeners
    prevBtn?.addEventListener('click', prevSlide);
    nextBtn?.addEventListener('click', nextSlide);

    // Touch events
    carousel.addEventListener('touchstart', touchStart, { passive: true });
    carousel.addEventListener('touchmove', touchMove, { passive: true });
    carousel.addEventListener('touchend', touchEnd);

    // Mouse events
    carousel.addEventListener('mousedown', touchStart);
    carousel.addEventListener('mousemove', touchMove);
    carousel.addEventListener('mouseup', touchEnd);
    carousel.addEventListener('mouseleave', () => {
        if (isDragging) touchEnd();
    });

    // Prevent context menu on long press
    carousel.addEventListener('contextmenu', e => e.preventDefault());

    // Handle resize
    window.addEventListener('resize', () => {
        cardsPerView = getCardsPerView();
        maxIndex = Math.max(0, cards.length - cardsPerView);
        if (currentIndex > maxIndex) currentIndex = maxIndex;
        createDots();
        goToSlide(currentIndex);
    });

    // Initialize
    createDots();
    goToSlide(0);
}
