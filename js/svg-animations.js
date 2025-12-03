/* ================================
   SVG-ANIMATIONS.JS - SVG & PARALLAX CONTROL
   ================================ */

class SVGAnimationManager {
    constructor() {
        this.sections = document.querySelectorAll('.section');
        this.svgs = document.querySelectorAll('.bg-svg');
        this.init();
    }

    init() {
        this.setupParallax();
        this.setupSVGInteractions();
    }

    setupParallax() {
        window.addEventListener('scroll', () => {
            this.sections.forEach((section, index) => {
                const rect = section.getBoundingClientRect();
                const scrollPercent = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);

                if (scrollPercent > 0 && scrollPercent < 1) {
                    const parallaxAmount = scrollPercent * 20;
                    const svg = section.querySelector('.bg-svg');
                    
                    if (svg) {
                        svg.style.transform = `translateY(${parallaxAmount}px) scale(1.05)`;
                    }
                }
            });
        }, { passive: true });
    }

    setupSVGInteractions() {
        // Tree demo interaction
        const treeDemo = document.getElementById('treeDemo');
        if (treeDemo) {
            this.setupTreeInteraction(treeDemo);
        }
    }

    setupTreeInteraction(container) {
        const svg = container.querySelector('svg');
        const nodes = svg.querySelectorAll('.tree-node.clickable');

        nodes.forEach(node => {
            node.addEventListener('click', (e) => {
                e.stopPropagation();
                this.redrawTree(svg, node);
            });

            node.addEventListener('mouseover', () => {
                node.style.cursor = 'pointer';
                node.style.filter = 'drop-shadow(0 0 10px rgba(245, 158, 11, 0.8))';
            });

            node.addEventListener('mouseout', () => {
                node.style.filter = 'drop-shadow(0 0 4px rgba(245, 158, 11, 0.4))';
            });
        });
    }

    redrawTree(svg, newRoot) {
        const treeContent = svg.querySelector('.tree-content');
        
        // Remove previous lines
        const oldLines = treeContent.querySelectorAll('line');
        oldLines.forEach(line => line.remove());

        // Get current nodes
        const nodes = treeContent.querySelectorAll('.tree-node');
        const rootNode = newRoot;
        const rootCx = parseFloat(rootNode.getAttribute('cx'));
        const rootCy = parseFloat(rootNode.getAttribute('cy'));

        // Move clicked node to center
        rootNode.setAttribute('cx', 200);
        rootNode.setAttribute('cy', 50);
        rootNode.classList.add('clickable');

        // Redistribute other nodes
        const otherNodes = Array.from(nodes).filter(n => n !== rootNode);
        const angleStep = (Math.PI * 2) / otherNodes.length;

        otherNodes.forEach((node, index) => {
            const angle = angleStep * index;
            const radius = 100;
            const x = 200 + Math.cos(angle) * radius;
            const y = 150 + Math.sin(angle) * radius;

            node.setAttribute('cx', x);
            node.setAttribute('cy', y);

            // Draw line from root
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', 200);
            line.setAttribute('y1', 50);
            line.setAttribute('x2', x);
            line.setAttribute('y2', y);
            line.setAttribute('stroke', '#F59E0B');
            line.setAttribute('stroke-width', 2);
            line.setAttribute('opacity', 0.4);
            treeContent.insertBefore(line, treeContent.firstChild);
        });
    }
}

// ================================
// PARALLAX EFFECT ON CONTENT
// ================================

class ParallaxContent {
    constructor() {
        this.elements = document.querySelectorAll('[data-parallax]');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.updateParallax(), { passive: true });
    }

    updateParallax() {
        this.elements.forEach(element => {
            const speed = parseFloat(element.getAttribute('data-parallax')) || 0.5;
            const yPos = window.scrollY * speed;
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
}

// ================================
// SCROLL-BASED SVG MORPHING
// ================================

class SVGMorph {
    constructor() {
        this.init();
    }

    init() {
        const svgs = document.querySelectorAll('.bg-svg');
        window.addEventListener('scroll', () => {
            svgs.forEach((svg, index) => {
                this.morphSVGOnScroll(svg, index);
            });
        }, { passive: true });
    }

    morphSVGOnScroll(svg, index) {
        const shapes = svg.querySelectorAll('.shape');
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;

        shapes.forEach((shape, shapeIndex) => {
            const rotationAmount = (scrollPercent / 100) * 360;
            shape.style.transform = `rotate(${rotationAmount}deg)`;
        });
    }
}

// ================================
// SCROLL-BASED COLOR SHIFT
// ================================

class ColorShift {
    constructor() {
        this.colors = [
            { primary: '#8B5CF6', secondary: '#EC4899' },   // Purple-Pink
            { primary: '#06B6D4', secondary: '#8B5CF6' },   // Cyan-Purple
            { primary: '#EC4899', secondary: '#F59E0B' },   // Pink-Amber
            { primary: '#F59E0B', secondary: '#06B6D4' },   // Amber-Cyan
        ];
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.updateColors(), { passive: true });
    }

    updateColors() {
        const sections = document.querySelectorAll('.section');
        sections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
                const colorIndex = index % this.colors.length;
                const nextColorIndex = (index + 1) % this.colors.length;
                
                const progress = (window.innerHeight / 2 - rect.top) / (window.innerHeight + rect.height);
                this.interpolateColor(colorIndex, nextColorIndex, progress);
            }
        });
    }

    interpolateColor(fromIndex, toIndex, progress) {
        const from = this.colors[fromIndex];
        const to = this.colors[toIndex];
        
        // Interpolate colors
        // This can be extended to apply to elements
    }
}

// ================================
// ELEMENT ANIMATION ON SCROLL
// ================================

class ScrollReveal {
    constructor() {
        this.elements = document.querySelectorAll('[data-scroll-reveal]');
        this.observerOptions = {
            threshold: 0.3,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, this.observerOptions);

        this.elements.forEach(element => observer.observe(element));
    }
}

// ================================
// INITIALIZATION
// ================================

document.addEventListener('DOMContentLoaded', () => {
    new SVGAnimationManager();
    new ParallaxContent();
    new SVGMorph();
    new ColorShift();
    new ScrollReveal();

    // Apply parallax data attributes to sections
    const sections = document.querySelectorAll('.section-background');
    sections.forEach((section, index) => {
        section.setAttribute('data-parallax', 0.5);
    });
});

// ================================
// ADVANCED: SVG PATH ANIMATION
// ================================

class PathAnimation {
    constructor() {
        this.paths = document.querySelectorAll('[data-animate-path]');
        this.init();
    }

    init() {
        this.paths.forEach(path => {
            const length = path.getTotalLength();
            path.setAttribute('stroke-dasharray', length);
            path.setAttribute('stroke-dashoffset', length);
            
            window.addEventListener('scroll', () => {
                this.animatePath(path, length);
            }, { passive: true });
        });
    }

    animatePath(path, length) {
        const rect = path.getBoundingClientRect();
        const scrollPercent = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        const offset = length - (scrollPercent * length);
        
        path.setAttribute('stroke-dashoffset', Math.max(0, offset));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PathAnimation();
});
