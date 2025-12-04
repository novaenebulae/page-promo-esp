/* ================================
   INTERACTIONS.JS - CUSTOM CURSOR & HOVER EFFECTS
   ================================ */

class CustomCursor {
    constructor() {
        this.cursor = document.querySelector('.custom-cursor');
        this.mouseX = 0;
        this.mouseY = 0;
        this.posX = 0;
        this.posY = 0;
        this.rafId = null;
        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => this.onMouseMove(e), { passive: true });
        document.addEventListener('mouseenter', () => this.showCursor());
        document.addEventListener('mouseleave', () => this.hideCursor());

        // Start render loop
        this.start();
    }

    onMouseMove(e) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;

        // Update cursor appearance on hover using closest to handle inner elements
        const target = e.target;
        const interactive = target && target.closest && target.closest('button, a, .clickable, input, select');
        this.cursor.dataset.hover = interactive ? 'true' : 'false';
    }

    start() {
        const render = () => {
            // Smoothly interpolate position (lerp)
            const ease = 0.18;
            this.posX += (this.mouseX - this.posX) * ease;
            this.posY += (this.mouseY - this.posY) * ease;

            // Use transform for better performance
            this.cursor.style.transform = `translate(${this.posX - 8}px, ${this.posY - 8}px)`;

            // Visual states
            if (this.cursor.dataset.hover === 'true') {
                this.cursor.style.scale = '1.5';
                this.cursor.style.borderColor = '#06B6D4';
                this.cursor.style.boxShadow = '0 0 15px rgba(6, 182, 212, 0.8)';
            } else {
                this.cursor.style.scale = '1';
                this.cursor.style.borderColor = '#06B6D4';
                this.cursor.style.boxShadow = '0 0 8px rgba(6, 182, 212, 0.6)';
            }

            this.rafId = requestAnimationFrame(render);
        };

        this.rafId = requestAnimationFrame(render);
    }

    showCursor() {
        this.cursor.style.opacity = '1';
    }

    hideCursor() {
        this.cursor.style.opacity = '0';
    }
}

// ================================
// BUTTON INTERACTIONS
// ================================

class ButtonInteractions {
    constructor() {
        this.buttons = document.querySelectorAll('button');
        this.init();
    }

    init() {
        this.buttons.forEach(button => {
            button.addEventListener('mouseenter', (e) => this.onButtonHover(e));
            button.addEventListener('mouseleave', (e) => this.onButtonLeave(e));
            button.addEventListener('click', (e) => this.onButtonClick(e));
        });
    }

    onButtonHover(e) {
        const button = e.currentTarget;
        button.style.transform = 'scale(1.05)';
    }

    onButtonLeave(e) {
        const button = e.currentTarget;
        button.style.transform = 'scale(1)';
    }

    onButtonClick(e) {
        const button = e.currentTarget;
        
        // Ripple effect
        this.createRipple(button, e);
        
        // Button press animation
        button.style.transform = 'scale(0.98)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 100);
    }

    createRipple(button, event) {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        button.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    }
}

// ================================
// CARD HOVER EFFECTS
// ================================

class CardHoverEffects {
    constructor() {
        this.cards = document.querySelectorAll('.pillar-card, .why-card, .insight-card');
        this.init();
    }

    init() {
        this.cards.forEach(card => {
            card.addEventListener('mouseenter', (e) => this.onCardHover(e));
            card.addEventListener('mouseleave', (e) => this.onCardLeave(e));
            card.addEventListener('mousemove', (e) => this.onCardMove(e));
        });
    }

    onCardHover(e) {
        const card = e.currentTarget;
        card.style.transform = 'translateY(-10px)';
        card.style.boxShadow = '0 20px 60px rgba(139, 92, 246, 0.3)';
    }

    onCardLeave(e) {
        const card = e.currentTarget;
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
    }

    onCardMove(e) {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Subtle tilt effect
        const tiltX = (y - rect.height / 2) * 0.05;
        const tiltY = (x - rect.width / 2) * -0.05;

        card.style.transform = `translateY(-10px) perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    }
}

// ================================
// INPUT FOCUS EFFECTS
// ================================

class InputEffects {
    constructor() {
        this.inputs = document.querySelectorAll('input, textarea, select');
        this.init();
    }

    init() {
        this.inputs.forEach(input => {
            input.addEventListener('focus', (e) => this.onInputFocus(e));
            input.addEventListener('blur', (e) => this.onInputBlur(e));
        });
    }

    onInputFocus(e) {
        const input = e.target;
        input.style.borderColor = '#06B6D4';
        input.style.boxShadow = '0 0 20px rgba(6, 182, 212, 0.3)';
    }

    onInputBlur(e) {
        const input = e.target;
        input.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        input.style.boxShadow = 'none';
    }
}

// ================================
// SCROLL PROGRESS INDICATOR
// ================================

class ScrollProgress {
    constructor() {
        this.progressBar = document.createElement('div');
        this.progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: linear-gradient(90deg, #8B5CF6, #EC4899, #06B6D4, #F59E0B);
            z-index: 999;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(this.progressBar);
        
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.updateProgress(), { passive: true });
    }

    updateProgress() {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        this.progressBar.style.width = scrolled + '%';
    }
}

// ================================
// LINK HOVER EFFECTS
// ================================

class LinkEffects {
    constructor() {
        this.links = document.querySelectorAll('a');
        this.init();
    }

    init() {
        this.links.forEach(link => {
            link.addEventListener('mouseenter', (e) => this.onLinkHover(e));
            link.addEventListener('mouseleave', (e) => this.onLinkLeave(e));
        });
    }

    onLinkHover(e) {
        const link = e.target;
        if (!link.classList.contains('footer-link')) return;
        
        link.style.color = '#06B6D4';
        link.style.textDecoration = 'underline';
        link.style.textDecorationStyle = 'wavy';
    }

    onLinkLeave(e) {
        const link = e.target;
        link.style.textDecoration = 'none';
        link.style.color = 'rgba(255, 255, 255, 0.6)';
    }
}

// ================================
// SECTION OBSERVE FOR ANIMATIONS
// ================================

class SectionObserver {
    constructor() {
        this.sections = document.querySelectorAll('.section');
        this.observerOptions = {
            threshold: 0.3,
            rootMargin: '0px'
        };
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerSectionAnimation(entry.target);
                }
            });
        }, this.observerOptions);

        this.sections.forEach(section => observer.observe(section));
    }

    triggerSectionAnimation(section) {
        const cards = section.querySelectorAll('.pillar-card, .why-card, .timeline-item');
        cards.forEach((card, index) => {
            card.style.animation = `cardAppear 0.8s ease-out ${index * 0.1}s forwards`;
        });
    }
}

// ================================
// PAGE TRANSITION EFFECTS
// ================================

class PageTransition {
    constructor() {
        this.links = document.querySelectorAll('a[href^="http"], a[href^="/"]');
        this.init();
    }

    init() {
        this.links.forEach(link => {
            link.addEventListener('click', (e) => this.handleTransition(e));
        });
    }

    handleTransition(e) {
        const link = e.target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href');
        
        // Don't handle anchor links
        if (href.startsWith('#')) return;

        // Don't prevent default for external links in new tab
        if (link.target === '_blank') return;

        e.preventDefault();
        
        // Fade out animation
        const transition = document.createElement('div');
        transition.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #8B5CF6, #EC4899);
            z-index: 9998;
            animation: fadeInTransition 0.5s ease-in forwards;
        `;
        
        document.body.appendChild(transition);
        
        setTimeout(() => {
            window.location.href = href;
        }, 1000);
    }
}

// ================================
// LAZY LOAD IMAGES
// ================================

class LazyLoad {
    constructor() {
        this.images = document.querySelectorAll('img[data-src]');
        this.init();
    }

    init() {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src');
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        this.images.forEach(img => imageObserver.observe(img));
    }
}

// ================================
// INITIALIZATION
// ================================

document.addEventListener('DOMContentLoaded', () => {
    new CustomCursor();
    new ButtonInteractions();
    new CardHoverEffects();
    new InputEffects();
    new ScrollProgress();
    new LinkEffects();
    new SectionObserver();
    new PageTransition();
    new LazyLoad();

    // Theme toggle and sliders enhancements
    new ThemeToggle();
    RangeSlidersEnhancer.init();

    // Add ripple styles
    const style = document.createElement('style');
    style.textContent = `
        button {
            position: relative;
            overflow: hidden;
        }

        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: rippleAnimation 0.6s ease-out;
            pointer-events: none;
        }

        @keyframes rippleAnimation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }

        @keyframes fadeInTransition {
            0% {
                opacity: 0;
                transform: scaleY(0);
                transform-origin: top;
            }
            100% {
                opacity: 1;
                transform: scaleY(1);
            }
        }
    `;
    document.head.appendChild(style);
});

// Performance optimization: Use requestAnimationFrame for smooth animations
let animationId;
const optimizeAnimations = () => {
    const elements = document.querySelectorAll('[style*="transform"]');
    elements.forEach(el => {
        el.style.willChange = 'transform';
    });
};

setTimeout(optimizeAnimations, 1000);

// ================================
// THEME TOGGLE
// ================================

class ThemeToggle {
    constructor() {
        this.button = document.querySelector('.theme-toggle');
        if (!this.button) return;
        this.prefKey = 'esp-theme';
        this.applyStoredTheme();
        this.button.addEventListener('click', () => this.toggle());
        this.syncStyle();
    }

    applyStoredTheme() {
        const stored = localStorage.getItem(this.prefKey);
        if (stored === 'dark' || stored === 'light') {
            document.documentElement.setAttribute('data-theme', stored);
            this.button.setAttribute('aria-pressed', stored === 'dark' ? 'true' : 'false');
        }
    }

    toggle() {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem(this.prefKey, next);
        this.button.setAttribute('aria-pressed', next === 'dark' ? 'true' : 'false');
        this.syncStyle();
    }

    syncStyle() {
        // Optional visual feedback
        this.button.classList.toggle('active', document.documentElement.getAttribute('data-theme') === 'dark');
    }
}

// ================================
// RANGE SLIDERS ENHANCER
// ================================

class RangeSlidersEnhancer {
    static init() {
        const sliders = document.querySelectorAll('.slider-demo input[type="range"]');
        sliders.forEach(slider => {
            const valueEl = slider.parentElement?.querySelector('.slider-value');
            const update = () => {
                if (valueEl) valueEl.textContent = slider.value + '%';
            };
            slider.addEventListener('input', update);
            slider.addEventListener('change', update);
            update();
        });
    }
}
