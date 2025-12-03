/* ================================
   MAIN.JS - SCROLL & NAVIGATION LOGIC
   ================================ */

class PageController {
    constructor() {
        this.currentSection = 0;
        this.totalSections = 8;
        this.isScrolling = false;
        this.scrollThreshold = 50;
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
        // Wheel scroll
        document.addEventListener('wheel', (e) => this.handleScroll(e), { passive: true });
        
        // Touch scroll
        let touchStartY = 0;
        document.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchmove', (e) => {
            if (this.isScrolling) return;
            
            const touchEndY = e.touches[0].clientY;
            const diff = touchStartY - touchEndY;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.nextSection();
                } else {
                    this.prevSection();
                }
                touchStartY = touchEndY;
            }
        }, { passive: true });

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

    handleScroll(e) {
        if (this.isScrolling) return;

        const direction = e.deltaY > 0 ? 1 : -1;
        
        if (Math.abs(e.deltaY) > this.scrollThreshold) {
            direction > 0 ? this.nextSection() : this.prevSection();
        }
    }

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
        const duration = 800;
        const startPosition = window.scrollY;
        const endPosition = section.offsetTop;
        const distance = endPosition - startPosition;
        let start = null;

        const easeInOutCubic = (t) => {
            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        };

        const animation = (currentTime) => {
            if (start === null) start = currentTime;
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            const ease = easeInOutCubic(progress);

            window.scrollTo(0, startPosition + distance * ease);

            if (progress < 1) {
                requestAnimationFrame(animation);
            } else {
                this.isScrolling = false;
                this.updateActiveSection(index);
                this.triggerSectionAnimation(index);
            }
        };

        requestAnimationFrame(animation);
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
