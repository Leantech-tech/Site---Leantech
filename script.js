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
    const headerNav = document.querySelector('.container.nav');
    const navLinks = document.querySelector('.nav-links');

    // Create Hamburger Menu if not exists
    if (!document.querySelector('.mobile-menu-btn')) {
        const btn = document.createElement('div');
        btn.className = 'mobile-menu-btn';
        btn.innerHTML = '<i class="fas fa-bars"></i>';
        headerNav.appendChild(btn);

        btn.addEventListener('click', () => {
            navLinks.classList.toggle('nav-active');
            btn.querySelector('i').classList.toggle('fa-bars');
            btn.querySelector('i').classList.toggle('fa-times');
        });
    }

    // Dropdown for mobile
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                const target = e.target.closest('a');
                if (target && target.getAttribute('href').startsWith('#')) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                }
            }
        });
    });
}

// Cart Logic
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

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    updateCartCounter();
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
