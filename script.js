// Script principal pour le site vitrine de Julien Raad

document.addEventListener('DOMContentLoaded', function() {
    
    // === NAVIGATION MOBILE ===
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Toggle du menu mobile
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Fermer le menu mobile lors du clic sur un lien
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
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
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Ajouter une classe pour le style au scroll
        if (scrollTop > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
        
        lastScrollTop = scrollTop;
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
    // Créer des particules flottantes subtiles
    function createParticle() {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: rgba(37, 99, 235, 0.3);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1;
            animation: float 6s linear infinite;
        `;
        
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.top = '100vh';
        particle.style.animationDelay = Math.random() * 6 + 's';
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 6000);
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
    
    // Créer des particules périodiquement
    setInterval(createParticle, 3000);
    
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
