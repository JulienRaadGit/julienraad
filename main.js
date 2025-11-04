// Main JavaScript file for Julien Raad Portfolio
// Advanced animations and interactions

class PortfolioApp {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.isLoading = true;
        this.animations = {};
        this.particleSystem = null;
        
        this.init();
    }
    
    getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('about')) return 'about';
        if (path.includes('projects')) return 'projects';
        if (path.includes('contact')) return 'contact';
        return 'home';
    }
    
    init() {
        this.setupEventListeners();
        this.initializeAnimations();
        this.setupScrollReveal();
        this.initializePageSpecificFeatures();
        this.hideLoadingScreen();
    }
    
    setupEventListeners() {
        // Mobile menu toggle
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }
        
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Navbar scroll effect
        window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 100));
        
        // Resize handler
        window.addEventListener('resize', this.throttle(this.handleResize.bind(this), 250));
    }
    
    initializeAnimations() {
        // Initialize typewriter effect on home page
        if (this.currentPage === 'home') {
            this.initTypewriter();
            this.initParticleSystem();
            this.initSkillBars();
        }
        
        // Initialize scroll-based animations
        this.initScrollAnimations();
    }
    
    initTypewriter() {
        const typedElement = document.getElementById('typed-text');
        if (typedElement && typeof Typed !== 'undefined') {
            new Typed('#typed-text', {
                strings: [
                    'Julien Raad',
                    'Développeur Full Stack',
                    'Étudiant Gaming Campus',
                    'Créateur d\'expériences'
                ],
                typeSpeed: 80,
                backSpeed: 50,
                backDelay: 2000,
                startDelay: 500,
                loop: true,
                showCursor: true,
                cursorChar: '|'
            });
        }
    }
    
    initParticleSystem() {
        const particleContainer = document.getElementById('particle-container');
        if (particleContainer && typeof p5 !== 'undefined') {
            new p5((sketch) => {
                let particles = [];
                const numParticles = 50;
                
                sketch.setup = () => {
                    const canvas = sketch.createCanvas(
                        particleContainer.offsetWidth,
                        particleContainer.offsetHeight
                    );
                    canvas.parent(particleContainer);
                    
                    // Initialize particles
                    for (let i = 0; i < numParticles; i++) {
                        particles.push({
                            x: sketch.random(sketch.width),
                            y: sketch.random(sketch.height),
                            vx: sketch.random(-1, 1),
                            vy: sketch.random(-1, 1),
                            size: sketch.random(2, 6),
                            opacity: sketch.random(0.3, 0.8)
                        });
                    }
                };
                
                sketch.draw = () => {
                    sketch.clear();
                    
                    // Update and draw particles
                    particles.forEach(particle => {
                        // Update position
                        particle.x += particle.vx;
                        particle.y += particle.vy;
                        
                        // Wrap around edges
                        if (particle.x < 0) particle.x = sketch.width;
                        if (particle.x > sketch.width) particle.x = 0;
                        if (particle.y < 0) particle.y = sketch.height;
                        if (particle.y > sketch.height) particle.y = 0;
                        
                        // Draw particle
                        sketch.fill(255, 255, 255, particle.opacity * 255);
                        sketch.noStroke();
                        sketch.ellipse(particle.x, particle.y, particle.size);
                        
                        // Connect nearby particles
                        particles.forEach(otherParticle => {
                            const distance = sketch.dist(
                                particle.x, particle.y,
                                otherParticle.x, otherParticle.y
                            );
                            
                            if (distance < 100) {
                                sketch.stroke(255, 255, 255, (1 - distance / 100) * 50);
                                sketch.strokeWeight(1);
                                sketch.line(
                                    particle.x, particle.y,
                                    otherParticle.x, otherParticle.y
                                );
                            }
                        });
                    });
                };
                
                sketch.windowResized = () => {
                    sketch.resizeCanvas(
                        particleContainer.offsetWidth,
                        particleContainer.offsetHeight
                    );
                };
            });
        }
    }
    
    initSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        
        const animateSkillBars = () => {
            skillBars.forEach(bar => {
                const width = bar.dataset.width;
                if (width) {
                    anime({
                        targets: bar,
                        width: width + '%',
                        duration: 1500,
                        easing: 'easeOutCubic',
                        delay: anime.stagger(200)
                    });
                }
            });
        };
        
        // Animate skill bars when they come into view
        this.observeElements(skillBars, animateSkillBars);
    }
    
    setupScrollReveal() {
        const revealElements = document.querySelectorAll('.section-reveal, .timeline-item, .project-card, .contact-card');
        
        this.observeElements(revealElements, (element) => {
            element.classList.add('revealed');
        });
    }
    
    observeElements(elements, callback) {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        callback(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });
            
            elements.forEach(element => {
                observer.observe(element);
            });
        } else {
            // Fallback for older browsers
            elements.forEach(element => {
                callback(element);
            });
        }
    }
    
    initScrollAnimations() {
        // Parallax effect for hero sections
        const heroElements = document.querySelectorAll('.hero-bg');
        
        if (heroElements.length > 0 && !this.prefersReducedMotion()) {
            window.addEventListener('scroll', this.throttle(() => {
                const scrolled = window.pageYOffset;
                const parallax = scrolled * 0.5;
                
                heroElements.forEach(hero => {
                    hero.style.transform = `translateY(${parallax}px)`;
                });
            }, 16));
        }
        
        // Progress indicator
        this.initProgressIndicator();
    }
    
    initProgressIndicator() {
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            z-index: 9999;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', this.throttle(() => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = scrollPercent + '%';
        }, 10));
    }
    
    handleScroll() {
        const navbar = document.querySelector('nav');
        const backToTopBtn = document.getElementById('back-to-top');
        const scrollTop = window.pageYOffset;
        
        // Navbar scroll effect
        if (scrollTop > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
        
        // Back to top button
        if (backToTopBtn) {
            if (scrollTop > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }
        
        // Update active navigation link
        this.updateActiveNavLink();
    }
    
    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const scrollTop = window.pageYOffset;
            
            if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.removeAttribute('aria-current');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.setAttribute('aria-current', 'page');
            }
        });
    }
    
    handleResize() {
        // Handle responsive adjustments
        if (this.particleSystem) {
            this.particleSystem.windowResized();
        }
    }
    
    initializePageSpecificFeatures() {
        switch (this.currentPage) {
            case 'home':
                this.initHomePageFeatures();
                break;
            case 'about':
                this.initAboutPageFeatures();
                break;
            case 'projects':
                this.initProjectsPageFeatures();
                break;
            case 'contact':
                this.initContactPageFeatures();
                break;
        }
    }
    
    initHomePageFeatures() {
        // Initialize project card hover effects
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                anime({
                    targets: card,
                    scale: 1.05,
                    rotateX: 5,
                    rotateY: 5,
                    duration: 300,
                    easing: 'easeOutCubic'
                });
            });
            
            card.addEventListener('mouseleave', () => {
                anime({
                    targets: card,
                    scale: 1,
                    rotateX: 0,
                    rotateY: 0,
                    duration: 300,
                    easing: 'easeOutCubic'
                });
            });
        });
        
        // Initialize button hover effects
        const buttons = document.querySelectorAll('.btn-primary, .glass-card');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                anime({
                    targets: button,
                    translateY: -3,
                    scale: 1.05,
                    duration: 200,
                    easing: 'easeOutCubic'
                });
            });
            
            button.addEventListener('mouseleave', () => {
                anime({
                    targets: button,
                    translateY: 0,
                    scale: 1,
                    duration: 200,
                    easing: 'easeOutCubic'
                });
            });
        });
    }
    
    initAboutPageFeatures() {
        // Initialize timeline animations
        const timelineItems = document.querySelectorAll('.timeline-item');
        this.observeElements(timelineItems, (item) => {
            anime({
                targets: item,
                translateX: 0,
                opacity: 1,
                duration: 800,
                easing: 'easeOutCubic'
            });
        });
        
        // Initialize achievement card animations
        const achievementCards = document.querySelectorAll('.achievement-card');
        achievementCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                anime({
                    targets: card,
                    translateY: -8,
                    scale: 1.02,
                    duration: 300,
                    easing: 'easeOutCubic'
                });
            });
            
            card.addEventListener('mouseleave', () => {
                anime({
                    targets: card,
                    translateY: 0,
                    scale: 1,
                    duration: 300,
                    easing: 'easeOutCubic'
                });
            });
        });
    }
    
    initProjectsPageFeatures() {
        // Project filtering functionality is handled in the HTML file
        // Additional project-specific animations can be added here
        
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach((card, index) => {
            // Stagger animation on load
            anime({
                targets: card,
                translateY: [50, 0],
                opacity: [0, 1],
                duration: 600,
                delay: index * 100,
                easing: 'easeOutCubic'
            });
        });
    }
    
    initContactPageFeatures() {
        // Form animations and validation are handled in the HTML file
        // Additional contact-specific features can be added here
        
        const contactCards = document.querySelectorAll('.contact-card');
        contactCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                anime({
                    targets: card,
                    translateY: -6,
                    scale: 1.03,
                    duration: 300,
                    easing: 'easeOutCubic'
                });
            });
            
            card.addEventListener('mouseleave', () => {
                anime({
                    targets: card,
                    translateY: 0,
                    scale: 1,
                    duration: 300,
                    easing: 'easeOutCubic'
                });
            });
        });
    }
    
    hideLoadingScreen() {
        const loadingIndicator = document.getElementById('loading-indicator');
        if (loadingIndicator) {
            setTimeout(() => {
                loadingIndicator.classList.add('hidden');
                this.isLoading = false;
                
                // Trigger entrance animations
                this.triggerEntranceAnimations();
            }, 1000);
        } else {
            this.triggerEntranceAnimations();
        }
    }
    
    triggerEntranceAnimations() {
        // Animate hero title
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            anime({
                targets: heroTitle,
                translateY: [50, 0],
                opacity: [0, 1],
                duration: 1000,
                delay: 200,
                easing: 'easeOutCubic'
            });
        }
        
        // Animate other hero elements
        const heroElements = document.querySelectorAll('.hero-subtitle, .hero-description, .hero-cta');
        heroElements.forEach((element, index) => {
            anime({
                targets: element,
                translateY: [30, 0],
                opacity: [0, 1],
                duration: 800,
                delay: 400 + (index * 200),
                easing: 'easeOutCubic'
            });
        });
    }
    
    // Utility functions
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
}

// Enhanced hover effects and interactions
class HoverEffects {
    static init() {
        // 3D card effects
        const cards = document.querySelectorAll('.project-card, .achievement-card, .contact-card');
        cards.forEach(card => {
            card.addEventListener('mousemove', HoverEffects.handleCardMouseMove);
            card.addEventListener('mouseleave', HoverEffects.handleCardMouseLeave);
        });
        
        // Button ripple effects
        const buttons = document.querySelectorAll('.btn-primary, button[type="submit"]');
        buttons.forEach(button => {
            button.addEventListener('click', HoverEffects.createRippleEffect);
        });
        
        // Image zoom effects
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.addEventListener('mouseenter', HoverEffects.handleImageMouseEnter);
            img.addEventListener('mouseleave', HoverEffects.handleImageMouseLeave);
        });
    }
    
    static handleCardMouseMove(e) {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        anime({
            targets: card,
            rotateX: rotateX,
            rotateY: rotateY,
            scale: 1.05,
            duration: 200,
            easing: 'easeOutCubic'
        });
    }
    
    static handleCardMouseLeave(e) {
        const card = e.currentTarget;
        
        anime({
            targets: card,
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            duration: 300,
            easing: 'easeOutCubic'
        });
    }
    
    static createRippleEffect(e) {
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            pointer-events: none;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        anime({
            targets: ripple,
            scale: [0, 2],
            opacity: [1, 0],
            duration: 600,
            easing: 'easeOutCubic',
            complete: () => {
                ripple.remove();
            }
        });
    }
    
    static handleImageMouseEnter(e) {
        const img = e.currentTarget;
        anime({
            targets: img,
            scale: 1.1,
            duration: 300,
            easing: 'easeOutCubic'
        });
    }
    
    static handleImageMouseLeave(e) {
        const img = e.currentTarget;
        anime({
            targets: img,
            scale: 1,
            duration: 300,
            easing: 'easeOutCubic'
        });
    }
}

// Performance monitoring
class PerformanceMonitor {
    static init() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
                    const domContentLoaded = perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart;
                    
                    console.log(`Page load time: ${loadTime}ms`);
                    console.log(`DOM content loaded: ${domContentLoaded}ms`);
                }, 0);
            });
        }
    }
}

// Error handling
class ErrorHandler {
    static init() {
        window.addEventListener('error', (e) => {
            console.error('JavaScript Error:', e.error);
            // Could send to analytics service
        });
        
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled Promise Rejection:', e.reason);
            // Could send to analytics service
        });
    }
}

// Accessibility enhancements
class AccessibilityEnhancer {
    static init() {
        // Skip link functionality
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
            skipLink.addEventListener('click', (e) => {
                e.preventDefault();
                const mainContent = document.querySelector('#main-content');
                if (mainContent) {
                    mainContent.focus();
                    mainContent.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
        
        // Keyboard navigation enhancements
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Close any open modals or menus
                const modals = document.querySelectorAll('.modal.active');
                modals.forEach(modal => {
                    modal.classList.remove('active');
                });
                
                // Close mobile menu
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
        
        // Focus management for modal dialogs
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    const focusableElements = modal.querySelectorAll(
                        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                    );
                    const firstElement = focusableElements[0];
                    const lastElement = focusableElements[focusableElements.length - 1];
                    
                    if (e.shiftKey) {
                        if (document.activeElement === firstElement) {
                            lastElement.focus();
                            e.preventDefault();
                        }
                    } else {
                        if (document.activeElement === lastElement) {
                            firstElement.focus();
                            e.preventDefault();
                        }
                    }
                }
            });
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main application
    const app = new PortfolioApp();
    
    // Initialize additional features
    HoverEffects.init();
    PerformanceMonitor.init();
    ErrorHandler.init();
    AccessibilityEnhancer.init();
    
    // Add welcome message to console
    console.log('%c👋 Bienvenue sur le portfolio de Julien Raad!', 'color: #667eea; font-size: 16px; font-weight: bold;');
    console.log('%c💻 Développeur Full Stack & Étudiant Gaming Campus', 'color: #764ba2; font-size: 12px;');
    console.log('%c🚀 Technologies modernes et design innovant', 'color: #06b6d4; font-size: 10px;');
    
    // Performance optimization: Preload critical resources
    const criticalResources = [
        'resources/julien-portrait.png',
        'resources/hero-workspace.png'
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        link.as = 'image';
        document.head.appendChild(link);
    });
});

// Export for potential external use
window.PortfolioApp = PortfolioApp;