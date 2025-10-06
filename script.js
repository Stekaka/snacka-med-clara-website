// Hero video handling
document.addEventListener('DOMContentLoaded', () => {
    const heroVideo = document.querySelector('.hero-video video');
    
    if (heroVideo) {
        // Lägg till fallback om video inte laddas
        heroVideo.addEventListener('error', () => {
            console.log('Video failed to load, using fallback background');
            heroVideo.style.display = 'none';
        });
        
        // Optimera video för mobila enheter
        if (window.innerWidth < 768) {
            heroVideo.muted = true;
            heroVideo.playsInline = true;
        }
        
        // Lägg till loading state
        heroVideo.addEventListener('loadstart', () => {
            console.log('Hero video loading...');
        });
        
        heroVideo.addEventListener('canplay', () => {
            console.log('Hero video ready to play');
        });
    }

    // Mobile menu handling
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }

    // Scroll arrow functionality
    const scrollArrow = document.querySelector('.scroll-arrow');
    if (scrollArrow) {
        scrollArrow.addEventListener('click', () => {
            const aboutSection = document.querySelector('#om-mig');
            if (aboutSection) {
                const offsetTop = aboutSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            
            // Handle service pre-fill for card CTAs
            const service = this.getAttribute('data-service');
            if (service && target.id === 'contact') {
                setTimeout(() => {
                    prefillContactForm(service);
                }, 500); // Wait for scroll to complete
            }
        }
    });
});

// Special handling for logo link to scroll to top
document.querySelectorAll('.nav-logo-link').forEach(logoLink => {
    logoLink.addEventListener('click', function (e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});

// Service pre-fill function
function prefillContactForm(service) {
    const serviceSelect = document.querySelector('select[name="service"]');
    if (serviceSelect) {
        const serviceMap = {
            'barn-ungdomar': 'För barn och ungdomar',
            'vuxna': 'För vuxna',
            'korkortsstod': 'Körkortsstöd'
        };
        
        const serviceText = serviceMap[service];
        if (serviceText) {
            // Find and select the option
            for (let option of serviceSelect.options) {
                if (option.textContent === serviceText) {
                    option.selected = true;
                    serviceSelect.dispatchEvent(new Event('change'));
                    break;
                }
            }
            
            // Add visual feedback
            serviceSelect.style.borderColor = 'var(--primary-color)';
            serviceSelect.style.boxShadow = '0 0 0 2px rgba(212, 165, 116, 0.2)';
            
            setTimeout(() => {
                serviceSelect.style.borderColor = '';
                serviceSelect.style.boxShadow = '';
            }, 2000);
            
            // Show notification
            showNotification(`Formuläret är förfyllt för "${serviceText}"! 🎯`, 'success');
        }
    }
}

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(254, 252, 247, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(212, 165, 116, 0.1)';
    } else {
        navbar.style.backgroundColor = 'rgba(254, 252, 247, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Form handling
const guideForm = document.getElementById('guide-form');
const contactForm = document.getElementById('contact-form');

// Guide Form
if (guideForm) {
    guideForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const interest = formData.get('interest');
        
        // Simulate form submission
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Skickar...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            // Show success message
            showNotification('Tack så mycket! Din guide skickas till din e-post inom några minuter. 💝', 'success');
            
            // Reset form
            this.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Track conversion
            trackConversion('guide_download', {
                name: name,
                email: email,
                interest: interest
            });
        }, 2000);
    });
}

// Contact Form
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const phone = formData.get('phone');
        const service = formData.get('service');
        const message = formData.get('message');
        
        // Simulate form submission
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Skickar...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            // Show success message
            showNotification('Tack för ditt meddelande! Jag läser varje ord med omsorg och återkommer inom 24 timmar. 💌', 'success');
            
            // Reset form
            this.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Track conversion
            trackConversion('contact_form', {
                name: name,
                email: email,
                phone: phone,
                service: service,
                message: message
            });
        }, 2000);
    });
}

// Newsletter Form
const newsletterForms = document.querySelectorAll('.newsletter-form');
newsletterForms.forEach(form => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = this.querySelector('input[type="email"]').value;
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            showNotification('Tack! Du är nu prenumererad på vårt nyhetsbrev. 💌', 'success');
            this.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            trackConversion('newsletter', { email: email });
        }, 1500);
    });
});

// Warm notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'heart' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add warm styles
    const bgColor = type === 'success' ? '#d4a574' : '#a8d5ba';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, ${bgColor}, ${type === 'success' ? '#e8c4a0' : '#c8e6d3'});
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(212, 165, 116, 0.2);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
        border: 2px solid rgba(255, 255, 255, 0.2);
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 6 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }
    }, 6000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0.25rem;
        margin-left: auto;
        border-radius: 4px;
        transition: background-color 0.2s;
    }
    
    .notification-close:hover {
        background-color: rgba(255, 255, 255, 0.2);
    }
`;
document.head.appendChild(style);

// Conversion tracking function
function trackConversion(eventType, data) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', eventType, {
            event_category: 'engagement',
            event_label: data.email || 'unknown',
            value: 1
        });
    }
    
    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', eventType, {
            content_name: data.name || 'Lead',
            content_category: data.service || 'General',
            value: 1,
            currency: 'SEK'
        });
    }
    
    // Console log for development
    console.log('Conversion tracked:', eventType, data);
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.help-card, .testimonial-card, .quality, .contact-method');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
});

// Phone number formatting
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '-' + value.substring(2);
    }
    if (value.length >= 6) {
        value = value.substring(0, 6) + ' ' + value.substring(6);
    }
    input.value = value;
}

// Add phone formatting to phone inputs
document.addEventListener('DOMContentLoaded', () => {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', () => formatPhoneNumber(input));
    });
});

// Add warm hover effects
document.addEventListener('DOMContentLoaded', () => {
    // Add hover effects to cards
    const cards = document.querySelectorAll('.help-card, .testimonial-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add click effects to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add ripple animation
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);
});

// Add warm loading states
function addLoadingState(button, text = 'Laddar...') {
    button.dataset.originalText = button.innerHTML;
    button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${text}`;
    button.disabled = true;
}

function removeLoadingState(button) {
    button.innerHTML = button.dataset.originalText;
    button.disabled = false;
}

// Accessibility improvements
document.addEventListener('DOMContentLoaded', () => {
    // Add skip link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Hoppa till huvudinnehåll';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary-color);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 10000;
        transition: top 0.3s;
        font-family: 'Quicksand', sans-serif;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content ID
    const mainContent = document.querySelector('.hero');
    if (mainContent) {
        mainContent.id = 'main-content';
    }
    
    // Add warm focus styles
    const focusStyle = document.createElement('style');
    focusStyle.textContent = `
        *:focus {
            outline: 2px solid var(--primary-color) !important;
            outline-offset: 2px !important;
        }
        
        .btn:focus {
            box-shadow: 0 0 0 3px rgba(212, 165, 116, 0.3) !important;
        }
    `;
    document.head.appendChild(focusStyle);
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
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

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(() => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(254, 252, 247, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(212, 165, 116, 0.1)';
    } else {
        navbar.style.backgroundColor = 'rgba(254, 252, 247, 0.95)';
        navbar.style.boxShadow = 'none';
    }
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Add warm console welcome message
console.log(`
%c💝 Snacka med Clara - En trygg plats för dig
%cWebbplats skapad med kärlek för att ge dig en varm och trygg upplevelse.
%cFör frågor eller support, kontakta: hej@snackamedclara.se
`, 
'color: #d4a574; font-size: 16px; font-weight: bold;',
'color: #8b7355; font-size: 12px;',
'color: #a8d5ba; font-size: 12px;'
);

// Add warm error handling
function handleFormError(form, error) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
    
    showNotification('Oj, något gick fel! Försök igen senare. 💝', 'error');
    console.error('Form error:', error);
}

// Add error handling to forms
[guideForm, contactForm].forEach(form => {
    if (form) {
        form.addEventListener('submit', function(e) {
            // Add error handling wrapper
            const originalHandler = this.onsubmit;
            this.onsubmit = function(event) {
                try {
                    if (originalHandler) {
                        originalHandler.call(this, event);
                    }
                } catch (error) {
                    handleFormError(this, error);
                }
            };
        });
    }
});

// Typing effect removed - clean and simple

// Add scroll indicator functionality
document.addEventListener('DOMContentLoaded', () => {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const aboutSection = document.querySelector('.about-clara');
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
});

// Add warm click sound effect (optional)
function playWarmSound() {
    // Create a warm, gentle sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

// Add warm sound to button clicks (optional)
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            // Uncomment the line below to enable warm sound effects
            // playWarmSound();
        });
    });
});

