(function ($) {
    "use strict";

    // Scroll-triggered animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Observe all sections and fade-in elements
    document.querySelectorAll('.section, .fade-in-up').forEach(el => {
        observer.observe(el);
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add loading animation
    window.addEventListener('load', () => {
        document.body.style.opacity = '1';
    });

    // Additional interactive features
    document.addEventListener('DOMContentLoaded', function() {
        // Add hover effects to feature cards
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
        
        // Add click effects to CTA buttons
        const ctaButtons = document.querySelectorAll('.cta-button');
        ctaButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                // Create ripple effect
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple');
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });

        });

        // Enhanced team card animations
        const teamItems = document.querySelectorAll('.team-item');
        teamItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                const img = this.querySelector('img');
                const teamText = this.querySelector('.team-text');
                const teamSocial = this.querySelector('.team-social');
                
                if (img) img.style.transform = 'translateY(-30px) scale(1.1)';
                if (teamText) {
                    teamText.style.marginTop = '-60px';
                    teamText.style.height = '160px';
                    teamText.style.background = 'rgba(255, 255, 255, 0.95)';
                    teamText.style.backdropFilter = 'blur(10px)';
                }
                if (teamSocial) teamSocial.style.opacity = '1';
            });
            
            item.addEventListener('mouseleave', function() {
                const img = this.querySelector('img');
                const teamText = this.querySelector('.team-text');
                const teamSocial = this.querySelector('.team-social');
                
                if (img) img.style.transform = 'translateY(0) scale(1)';
                if (teamText) {
                    teamText.style.marginTop = '0';
                    teamText.style.height = '100px';
                    teamText.style.background = '';
                    teamText.style.backdropFilter = '';
                }
                if (teamSocial) teamSocial.style.opacity = '0';
            });
        });
        // Watch Video Modal logic
        const watchVideoBtn = document.getElementById('watchVideoBtn');
        const videoModal = document.getElementById('videoModal');
        const videoFrame = document.getElementById('videoFrame');

        if (watchVideoBtn && videoModal) {
            watchVideoBtn.addEventListener('click', function() {
                var modal = new bootstrap.Modal(videoModal);
                modal.show();
            });

            // Optional: Stop video playback when modal closes
            videoModal.addEventListener('hidden.bs.modal', function () {
                if (videoFrame) {
                    videoFrame.src = videoFrame.src;
                }
            });
        }
    });
    // Navbar scroll effect (based on hero section height)
    const navbar = document.querySelector('.navbar');
    const heroSection = document.querySelector('.hero-section');
    if (!navbar || !heroSection) return;

    function handleNavbarScroll() {
        const heroBottom = heroSection.offsetHeight;
        const scrollTop = window.scrollY;

        if (scrollTop > heroBottom - 80) {
            navbar.classList.remove('navbar-transparent');
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.add('navbar-transparent');
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleNavbarScroll);
    window.addEventListener('load', handleNavbarScroll);

})(jQuery);
