// Script principal pour le site vitrine de Julien Raad
// Version améliorée avec fonctionnalités avancées

// Configuration globale
const CONFIG = {
    animationDuration: 300,
    scrollThreshold: 100,
    particleInterval: 3000,
    typingSpeed: 50,
    debounceDelay: 100
};

// Utilitaires de performance
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const throttle = (func, limit) => {
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
};

// Gestionnaire d'état de l'application
const AppState = {
    isLoading: true,
    isScrolled: false,
    currentSection: 'accueil',
    menuOpen: false,
    theme: 'light'
};

document.addEventListener('DOMContentLoaded', function() {
    
    // === INITIALISATION ===
    initializeApp();
    
    // === NAVIGATION MOBILE ===
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Toggle du menu mobile avec gestion d'état
    hamburger.addEventListener('click', function() {
        toggleMobileMenu();
    });
    
    // Fermer le menu mobile lors du clic sur un lien
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeMobileMenu();
        });
    });
    
    // Fermer le menu mobile lors du clic en dehors
    document.addEventListener('click', function(e) {
        if (AppState.menuOpen && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Fermer le menu mobile avec Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && AppState.menuOpen) {
            closeMobileMenu();
        }
    });
    
    // === SCROLL FLUIDE ===
    // Smooth scroll pour tous les liens d'ancrage
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 70; // Compensation pour la navbar fixe
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // === NAVBAR SCROLL EFFECT ===
    const navbar = document.getElementById('navbar');
    const backToTopBtn = document.getElementById('back-to-top');
    
    // Gestionnaire de scroll optimisé
    const handleScroll = throttle(function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Mise à jour de l'état de scroll
        AppState.isScrolled = scrollTop > CONFIG.scrollThreshold;
        
        // Mise à jour de la navbar
        if (AppState.isScrolled) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Bouton retour en haut
        if (scrollTop > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
        
        // Mise à jour de la section active
        updateActiveSection();
        
    }, CONFIG.debounceDelay);
    
    window.addEventListener('scroll', handleScroll);
    
    // Bouton retour en haut
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // === ANIMATIONS AU SCROLL ===
    // Observer pour les animations d'apparition
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observer les éléments à animer
    const animatedElements = document.querySelectorAll('.timeline-item, .projet-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });
    
    // === EFFETS HOVER POUR LES CARTES PROJETS ===
    const projetCards = document.querySelectorAll('.projet-card');
    
    projetCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // === EFFET DE TYPOGRAPHIE DYNAMIQUE ===
    // Animation du titre principal au chargement
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.innerHTML = '';
        
        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.opacity = '0';
            span.style.transform = 'translateY(20px)';
            span.style.transition = `opacity 0.5s ease ${index * 0.05}s, transform 0.5s ease ${index * 0.05}s`;
            heroTitle.appendChild(span);
            
            setTimeout(() => {
                span.style.opacity = '1';
                span.style.transform = 'translateY(0)';
            }, 200 + (index * 50));
        });
    }
    
    // === INDICATEUR DE PROGRESSION DE SCROLL ===
    // Créer une barre de progression
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(135deg, #2563eb, #1d4ed8);
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    // Mettre à jour la barre de progression
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
    
    // === EFFET DE PARTICULES LÉGÈRES ===
    let particleInterval;
    
    function createParticle() {
        const particle = document.createElement('div');
        const size = Math.random() * 4 + 2;
        const colors = ['rgba(37, 99, 235, 0.3)', 'rgba(6, 182, 212, 0.3)', 'rgba(59, 130, 246, 0.3)'];
        
        particle.style.cssText = `
            position: fixed;
            width: ${size}px;
            height: ${size}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: 50%;
            pointer-events: none;
            z-index: 1;
            animation: float ${Math.random() * 4 + 4}s linear infinite;
        `;
        
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.top = '100vh';
        particle.style.animationDelay = Math.random() * 6 + 's';
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
            }
        }, 8000);
    }
    
    // Ajouter l'animation CSS pour les particules
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100vh) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Démarrer les particules seulement si l'utilisateur n'a pas de préférence reduced motion
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        particleInterval = setInterval(createParticle, CONFIG.particleInterval);
    }
    
    // === GESTION DES LIENS EXTERNES ===
    // Ajouter des attributs de sécurité aux liens externes
    const externalLinks = document.querySelectorAll('a[href^="http"]');
    externalLinks.forEach(link => {
        if (!link.hasAttribute('target')) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });
    
    // === EFFET DE CHARGEMENT ===
    // Masquer l'effet de chargement une fois que tout est chargé
    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });
    
    // === OPTIMISATION DES PERFORMANCES ===
    // Désactiver les animations sur les appareils avec préférence reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.querySelectorAll('*').forEach(el => {
            el.style.animationDuration = '0.01ms';
            el.style.animationIterationCount = '1';
            el.style.transitionDuration = '0.01ms';
        });
    }
    
    // === GESTION DES ERREURS ===
    window.addEventListener('error', function(e) {
        console.log('Erreur JavaScript:', e.error);
    });
    
    // === CONSOLE WELCOME MESSAGE ===
    console.log('%c👋 Bienvenue sur le site de Julien Raad!', 'color: #2563eb; font-size: 16px; font-weight: bold;');
    console.log('%cDéveloppé avec ❤️ par Julien Raad', 'color: #64748b; font-size: 12px;');
    
});

// === FONCTIONS UTILITAIRES ===

// Initialisation de l'application
function initializeApp() {
    // Masquer l'indicateur de chargement
    const loadingIndicator = document.getElementById('loading-indicator');
    setTimeout(() => {
        loadingIndicator.classList.add('hidden');
        AppState.isLoading = false;
    }, 1000);
    
    // Initialiser les animations
    initializeAnimations();
    
    // Initialiser les interactions
    initializeInteractions();
    
    // Initialiser les performances
    initializePerformance();
}

// Gestion du menu mobile
function toggleMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    AppState.menuOpen = !AppState.menuOpen;
    
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', AppState.menuOpen);
    
    // Empêcher le scroll du body quand le menu est ouvert
    document.body.style.overflow = AppState.menuOpen ? 'hidden' : '';
}

function closeMobileMenu() {
    if (AppState.menuOpen) {
        toggleMobileMenu();
    }
}

// Mise à jour de la section active
function updateActiveSection() {
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
    
    if (currentSection !== AppState.currentSection) {
        AppState.currentSection = currentSection;
        
        // Mettre à jour les liens de navigation
        navLinks.forEach(link => {
            link.removeAttribute('aria-current');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.setAttribute('aria-current', 'page');
            }
        });
    }
}

// Initialisation des animations
function initializeAnimations() {
    // Animation de frappe pour le titre
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        typeWriter(heroTitle, heroTitle.textContent, CONFIG.typingSpeed);
    }
    
    // Animations au scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observer les éléments à animer
    const animatedElements = document.querySelectorAll('.timeline-item, .projet-card, .contact-link');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Animation de frappe
function typeWriter(element, text, speed) {
    element.innerHTML = '';
    let i = 0;
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    setTimeout(type, 500);
}

// Initialisation des interactions
function initializeInteractions() {
    // Effets hover pour les cartes projets
    const projetCards = document.querySelectorAll('.projet-card');
    
    projetCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Effets de parallaxe légers
    const hero = document.querySelector('.hero');
    if (hero && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.addEventListener('scroll', throttle(function() {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            hero.style.transform = `translateY(${parallax}px)`;
        }, 16));
    }
}

// Initialisation des performances
function initializePerformance() {
    // Lazy loading des images (si ajoutées plus tard)
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Preload des ressources critiques
    const criticalResources = [
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        link.as = 'style';
        document.head.appendChild(link);
    });
}

// Fonction pour détecter si l'utilisateur est sur mobile
function isMobile() {
    return window.innerWidth <= 768;
}

// Fonction pour ajouter une classe CSS dynamiquement
function addClass(element, className) {
    if (element && !element.classList.contains(className)) {
        element.classList.add(className);
    }
}

// Fonction pour supprimer une classe CSS dynamiquement
function removeClass(element, className) {
    if (element && element.classList.contains(className)) {
        element.classList.remove(className);
    }
}

// Fonction pour basculer une classe CSS
function toggleClass(element, className) {
    if (element) {
        element.classList.toggle(className);
    }
}

// Fonction pour obtenir les performances
function getPerformanceMetrics() {
    if ('performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0];
        return {
            loadTime: navigation.loadEventEnd - navigation.loadEventStart,
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0
        };
    }
    return null;
}

// Nettoyage lors de la fermeture de la page
window.addEventListener('beforeunload', function() {
    if (particleInterval) {
        clearInterval(particleInterval);
    }
});

// Gestion des erreurs globales
window.addEventListener('error', function(e) {
    console.error('Erreur JavaScript:', e.error);
    // Ici on pourrait envoyer l'erreur à un service de monitoring
});

// Message de bienvenue dans la console
console.log('%c👋 Bienvenue sur le site de Julien Raad!', 'color: #2563eb; font-size: 16px; font-weight: bold;');
console.log('%cDéveloppé avec ❤️ par Julien Raad', 'color: #64748b; font-size: 12px;');
console.log('%cVersion améliorée avec fonctionnalités avancées', 'color: #06b6d4; font-size: 10px;');
