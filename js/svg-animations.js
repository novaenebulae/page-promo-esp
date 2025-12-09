/* ================================
   SVG-ANIMATIONS.JS - SVG & PARALLAX CONTROL
   ================================ */

class SVGAnimationManager {
    constructor() {
        this.sections = document.querySelectorAll('.section');
        this.svgs = document.querySelectorAll('.bg-svg');
        // Sample genealogy data for the discovery tree
        this.treeData = {
            'Radiohead': ['OK Computer', 'Thom Yorke'],
            'OK Computer': ['Airbag', 'Paranoid Android', 'No Surprises'],
            'Thom Yorke': ['The Eraser', 'ANIMA', 'Atoms for Peace'],
        };
        this.maxTreeDepth = 2; // root + 2 levels
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
        if (!svg) return;

        // Prepare state on SVG element
        const viewBox = (svg.getAttribute('viewBox') || '0 0 800 380').split(' ').map(Number);
        const width = viewBox[2] || 800;
        const height = viewBox[3] || 380;
        svg._treeState = {
            nodes: new Map(), // label -> { x, y, depth }
            expanded: new Set(),
            width,
            height,
            levelY: [70, 190, 320]
        };

        const rootLabel = svg.getAttribute('data-root') || 'Radiohead';
        this.initTree(svg, rootLabel);

        // Delegate clicks to nodes
        svg.addEventListener('click', (e) => {
            const node = e.target.closest && e.target.closest('.tree-node');
            if (!node) return;
            const label = node.getAttribute('data-label');
            const depth = parseInt(node.getAttribute('data-depth') || '0', 10);
            if (depth >= this.maxTreeDepth) return;
            // Expand only if not already expanded
            if (!svg._treeState.expanded.has(label)) {
                svg._treeState.expanded.add(label);
                this.expandNode(svg, label, depth);
            }
        });
    }

    initTree(svg, rootLabel) {
        const group = svg.querySelector('.tree-content');
        if (!group) return;
        group.innerHTML = '';
        const { width, levelY } = svg._treeState;
        const xCenter = Math.floor(width / 2);
        const root = this.createNode(xCenter, levelY[0], rootLabel, 0, true);
        group.appendChild(root.circle);
        group.appendChild(root.text);
        svg._treeState.nodes.set(rootLabel, { x: xCenter, y: levelY[0], depth: 0 });
    }

    expandNode(svg, label, depth) {
        const group = svg.querySelector('.tree-content');
        if (!group) return;
        const state = svg._treeState;
        const { width, levelY } = state;
        const parent = state.nodes.get(label);
        if (!parent) return;

        const children = (this.treeData[label] || []).slice(0, 3);
        if (!children.length) return;

        // Compute a horizontal span centered on parent.x
        const span = depth === 0 ? Math.max(480, Math.floor(width * 0.8)) : Math.max(260, Math.floor(width * 0.5));
        const start = Math.max(40, parent.x - Math.floor(span / 2));
        const totalWidth = Math.min(width - 80, start + span) - start;
        const xs = this.distributePositions(children.length, totalWidth, 60, start);
        const cy = levelY[Math.min(depth + 1, levelY.length - 1)];

        children.forEach((child, idx) => {
            const cx = Math.max(40, Math.min(width - 40, xs[idx]));
            this.drawLink(group, parent.x, parent.y, cx, cy);
            const childNode = this.createNode(cx, cy, child, depth + 1, false);
            group.appendChild(childNode.circle);
            group.appendChild(childNode.text);
            state.nodes.set(child, { x: cx, y: cy, depth: depth + 1 });
        });
    }

    distributePositions(count, totalWidth, margin = 40, start = 0) {
        if (count <= 0) return [];
        const usable = Math.max(0, totalWidth - margin * 2);
        const step = count > 1 ? usable / (count - 1) : 0;
        const positions = [];
        for (let i = 0; i < count; i++) {
            positions.push(start + margin + i * step);
        }
        return positions;
    }

    createNode(cx, cy, label, depth, isRoot = false) {
        const ns = 'http://www.w3.org/2000/svg';
        const circle = document.createElementNS(ns, 'circle');
        circle.setAttribute('class', 'tree-node clickable');
        circle.setAttribute('cx', cx);
        circle.setAttribute('cy', cy);
        circle.setAttribute('r', depth === 0 ? 18 : 14);
        circle.setAttribute('fill', '#F59E0B');
        circle.setAttribute('opacity', depth === 0 ? '1' : '0.8');
        circle.setAttribute('data-label', label);
        circle.setAttribute('data-depth', String(depth));

        const text = document.createElementNS(ns, 'text');
        text.setAttribute('class', 'tree-label');
        text.setAttribute('x', cx);
        text.setAttribute('y', cy + (isRoot ? 6 : 5));
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', 'white');
        text.setAttribute('font-size', depth === 0 ? '14' : '12');
        text.setAttribute('font-weight', 'bold');
        text.setAttribute('pointer-events', 'none');
        text.textContent = label;

        return { circle, text };
    }

    drawLink(group, x1, y1, x2, y2) {
        const ns = 'http://www.w3.org/2000/svg';
        const line = document.createElementNS(ns, 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('stroke', '#F59E0B');
        line.setAttribute('stroke-width', '2');
        line.setAttribute('opacity', '0.45');
        group.insertBefore(line, group.firstChild);
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
