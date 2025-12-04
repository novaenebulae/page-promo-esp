/* ================================
   MAIN.JS - SCROLL & NAVIGATION LOGIC
   ================================ */

class PageController {
    constructor() {
        this.currentSection = 0;
        this.totalSections = 8;
        this.isScrolling = false;
        this.scrollThreshold = 2+10;
        this.sections = document.querySelectorAll('.section');
        this.dots = document.querySelectorAll('.dot');
        this.arrowUp = document.querySelector('.arrow-up');
        this.arrowDown = document.querySelector('.arrow-down');
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateActiveSection(0);
        this.animateStatsOnScroll();
    }

    setupEventListeners() {
        // Disable mouse wheel scrolling entirely (no section change on wheel)
        document.addEventListener('wheel', (e) => {
            e.preventDefault();
        }, { passive: false });
        
        // Disable touch swipe between sections but allow interactions on controls
        document.addEventListener('touchmove', (e) => {
            const target = e.target;
            const interactive = target && target.closest && target.closest('input, textarea, select, button, a, .clickable');
            if (!interactive) {
                e.preventDefault();
            }
        }, { passive: false });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Arrow buttons
        this.arrowUp.addEventListener('click', () => this.prevSection());
        this.arrowDown.addEventListener('click', () => this.nextSection());

        // Dot navigation
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSection(index));
        });
    }

    // Mouse wheel scrolling disabled – no handler

    handleKeyboard(e) {
        switch(e.key) {
            case 'ArrowDown':
            case ' ':
                e.preventDefault();
                this.nextSection();
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.prevSection();
                break;
        }
    }

    nextSection() {
        if (this.currentSection < this.totalSections - 1) {
            this.goToSection(this.currentSection + 1);
        }
    }

    prevSection() {
        if (this.currentSection > 0) {
            this.goToSection(this.currentSection - 1);
        }
    }

    goToSection(index) {
        if (index === this.currentSection || this.isScrolling) return;

        this.isScrolling = true;
        this.currentSection = index;

        const section = this.sections[index];
        // Instant jump without latency
        window.scrollTo({ top: section.offsetTop, left: 0, behavior: 'auto' });
        this.isScrolling = false;
        this.updateActiveSection(index);
        this.triggerSectionAnimation(index);
    }

    updateActiveSection(index) {
        // Update dots
        this.dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        // Update arrows visibility
        this.arrowUp.style.opacity = index === 0 ? '0.3' : '1';
        this.arrowUp.style.pointerEvents = index === 0 ? 'none' : 'auto';
        
        this.arrowDown.style.opacity = index === this.totalSections - 1 ? '0.3' : '1';
        this.arrowDown.style.pointerEvents = index === this.totalSections - 1 ? 'none' : 'auto';
    }

    triggerSectionAnimation(index) {
        const section = this.sections[index];
        const elements = section.querySelectorAll('.section-content > *');
        
        elements.forEach((el, i) => {
            el.style.animation = 'none';
            setTimeout(() => {
                el.style.animation = `fadeInUp 0.8s ease-out ${i * 0.1}s forwards`;
            }, 10);
        });
    }

    animateStatsOnScroll() {
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounters(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(stat => observer.observe(stat));
    }

    animateCounters(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const start = Date.now();

        const animate = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(progress * target);
            
            element.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = target;
            }
        };

        animate();
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    new PageController();
});

// Prevent default scroll behavior for smooth scroll snap
document.addEventListener('scroll', () => {
    // Custom scroll tracking
}, { passive: true });
