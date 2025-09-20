// Structural Stability Assessment Tool - Interactive Features with Component Images

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initializeApp();
});

function initializeApp() {
    // Add smooth scroll behavior for any internal links
    addSmoothScrolling();
    
    // Add intersection observer for animations
    addScrollAnimations();
    
    // Add hover effects for component cards
    addComponentCardInteractions();
    
    // Add image loading optimizations
    optimizeImageLoading();
    
    // Highlight the new laser projector component
    highlightNewComponent();
    
    // Add statistics counter animation
    animateStatistics();
    
    // Add keyboard navigation
    addKeyboardNavigation();
}

// Smooth scrolling for internal links
function addSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Intersection Observer for scroll animations
function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Trigger statistics animation when statistics section comes into view
                if (entry.target.classList.contains('statistics')) {
                    animateStatistics();
                }
            }
        });
    }, observerOptions);
    
    // Observe component cards
    const componentCards = document.querySelectorAll('.component-card');
    componentCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
    
    // Observe feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        observer.observe(card);
    });
    
    // Observe statistics section
    const statistics = document.querySelector('.statistics');
    if (statistics) {
        statistics.style.opacity = '0';
        statistics.style.transform = 'translateY(30px)';
        statistics.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(statistics);
    }
    
    // Observe solution section
    const solution = document.querySelector('.solution');
    if (solution) {
        solution.style.opacity = '0';
        solution.style.transform = 'translateY(30px)';
        solution.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(solution);
    }
}

// Enhanced component card interactions
function addComponentCardInteractions() {
    const componentCards = document.querySelectorAll('.component-card');
    
    componentCards.forEach(card => {
        // Add click-to-focus functionality for accessibility
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'article');
        
        // Add ARIA labels for better accessibility
        const cardName = card.querySelector('.component-card__name').textContent;
        const cardCategory = card.querySelector('.component-card__category').textContent;
        card.setAttribute('aria-label', `${cardName} - ${cardCategory} component details`);
        
        // Add keyboard navigation
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
        
        // Add hover effects with image scaling
        const image = card.querySelector('.component-card__image img');
        if (image) {
            card.addEventListener('mouseenter', function() {
                image.style.transition = 'transform 0.3s ease';
                image.style.transform = 'scale(1.05)';
            });
            
            card.addEventListener('mouseleave', function() {
                image.style.transform = 'scale(1)';
            });
        }
        
        // Add click animation
        card.addEventListener('click', function() {
            this.style.transform = 'translateY(-6px) scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

// Optimize image loading with lazy loading and error handling
function optimizeImageLoading() {
    const images = document.querySelectorAll('.component-card__image img');
    
    images.forEach(img => {
        // Add loading placeholder
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease';
        
        // Handle successful image load
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        // Handle image load errors
        img.addEventListener('error', function() {
            console.warn('Failed to load image:', this.src);
            this.style.opacity = '0.5';
            this.alt = 'Image unavailable';
            
            // Create a fallback placeholder
            const placeholder = document.createElement('div');
            placeholder.className = 'image-placeholder';
            placeholder.textContent = 'Component Image';
            placeholder.style.cssText = `
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                background: var(--color-bg-2);
                color: var(--color-text-secondary);
                font-size: var(--font-size-sm);
                border-radius: var(--radius-sm);
            `;
            
            this.parentNode.appendChild(placeholder);
            this.style.display = 'none';
        });
    });
}

// Special highlighting for the new laser projector component
function highlightNewComponent() {
    const newComponent = document.querySelector('.component-card--new');
    
    if (newComponent) {
        // Add a subtle pulse animation to draw attention
        setTimeout(() => {
            newComponent.style.animation = 'subtle-pulse 2s ease-in-out 3';
        }, 1500);
        
        // Remove animation after it completes
        setTimeout(() => {
            newComponent.style.animation = '';
        }, 7500);
        
        // Add special hover effect for new component
        newComponent.addEventListener('mouseenter', function() {
            const badge = this.querySelector('.component-card__badge');
            if (badge) {
                badge.style.transform = 'scale(1.1) rotate(-5deg)';
                badge.style.transition = 'transform 0.3s ease';
            }
        });
        
        newComponent.addEventListener('mouseleave', function() {
            const badge = this.querySelector('.component-card__badge');
            if (badge) {
                badge.style.transform = '';
            }
        });
    }
}

// Animate statistics with counting effect
function animateStatistics() {
    const statCards = document.querySelectorAll('.stat-card');
    
    statCards.forEach(card => {
        const valueElement = card.querySelector('.stat-card__value');
        const finalValue = valueElement.textContent;
        
        // Extract numeric value for animation
        const numericMatch = finalValue.match(/(\d+)/);
        if (numericMatch) {
            const targetNumber = parseInt(numericMatch[1]);
            const suffix = finalValue.replace(numericMatch[1], '');
            
            let currentNumber = 0;
            const increment = Math.ceil(targetNumber / 50);
            const duration = 2000; // 2 seconds
            const stepTime = duration / (targetNumber / increment);
            
            const counter = setInterval(() => {
                currentNumber += increment;
                if (currentNumber >= targetNumber) {
                    currentNumber = targetNumber;
                    clearInterval(counter);
                }
                valueElement.textContent = currentNumber + suffix;
            }, stepTime);
        }
    });
}

// Add keyboard navigation for better accessibility
function addKeyboardNavigation() {
    const focusableElements = document.querySelectorAll(
        '.component-card, .feature-card, .stat-card, button, a, input, select, textarea'
    );
    
    focusableElements.forEach((element, index) => {
        element.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) {
                e.preventDefault();
                const nextIndex = (index + 1) % focusableElements.length;
                focusableElements[nextIndex].focus();
            } else if (e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)) {
                e.preventDefault();
                const prevIndex = index === 0 ? focusableElements.length - 1 : index - 1;
                focusableElements[prevIndex].focus();
            }
        });
    });
}

// Add dynamic styles for animations
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes subtle-pulse {
            0%, 100% {
                transform: translateY(-2px) scale(1);
                box-shadow: var(--shadow-lg);
            }
            50% {
                transform: translateY(-6px) scale(1.02);
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 15px -5px rgba(var(--color-primary-rgb), 0.2);
            }
        }
        
        .image-placeholder {
            animation: placeholder-shimmer 1.5s ease-in-out infinite;
        }
        
        @keyframes placeholder-shimmer {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 0.8; }
        }
        
        .component-card:focus {
            outline: 2px solid var(--color-primary);
            outline-offset: 2px;
        }
    `;
    
    document.head.appendChild(style);
}

// Initialize dynamic styles
addDynamicStyles();

// Add performance monitoring for smooth animations
function optimizePerformance() {
    // Use requestAnimationFrame for smooth animations
    let ticking = false;
    
    function updateAnimations() {
        // Perform any frame-based animations here
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateAnimations);
            ticking = true;
        }
    }
    
    // Throttle scroll events for better performance
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        scrollTimeout = setTimeout(function() {
            requestTick();
        }, 10);
    });
}

// Initialize performance optimizations
optimizePerformance();

// Add error handling for better user experience
window.addEventListener('error', function(e) {
    console.warn('Non-critical error occurred:', e.message);
});

// Add resize handler for responsive adjustments
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        // Re-optimize layout if needed
        const images = document.querySelectorAll('.component-card__image img');
        images.forEach(img => {
            if (img.naturalWidth === 0) {
                img.style.opacity = '0.5';
            }
        });
    }, 250);
});

// Add print optimization
window.addEventListener('beforeprint', function() {
    // Ensure all images are visible for printing
    const images = document.querySelectorAll('.component-card__image img');
    images.forEach(img => {
        img.style.opacity = '1';
        img.style.transform = 'none';
    });
});

// Export functions for potential testing or external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeApp,
        addSmoothScrolling,
        addScrollAnimations,
        addComponentCardInteractions,
        optimizeImageLoading,
        highlightNewComponent,
        animateStatistics,
        addKeyboardNavigation
    };
}