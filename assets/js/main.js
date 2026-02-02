/**
 * Pevolution Main JavaScript
 * Handles UI interactions and functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initCopyButtons();
    initAnimations();
    initTooltips();
    initAPIStatus();
    initMobileMenu();
    
    console.log('%c🚀 Pevolution Loaded', 'color: #7c3aed; font-size: 14px; font-weight: bold;');
});

// Copy button functionality
function initCopyButtons() {
    const copyBtn = document.getElementById('copyLoaderBtn');
    if (!copyBtn) return;
    
    copyBtn.addEventListener('click', function() {
        const code = 'loadstring(game:HttpGet("https://pevolution.vercel.app/api/script", true))()';
        
        navigator.clipboard.writeText(code).then(() => {
            // Visual feedback
            copyBtn.classList.add('copied');
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            
            // Show success notification
            showNotification('✅ Loader code copied to clipboard!', 'success');
            
            // Reset button after 2 seconds
            setTimeout(() => {
                copyBtn.classList.remove('copied');
                copyBtn.innerHTML = '<i class="far fa-copy"></i> Copy';
            }, 2000);
            
        }).catch(err => {
            console.error('Failed to copy code:', err);
            showNotification('❌ Failed to copy. Please try again.', 'error');
        });
    });
    
    // Add keyboard shortcut (Ctrl+C when focused on code)
    document.addEventListener('keydown', function(e) {
        const activeElement = document.activeElement;
        const isCodeFocused = activeElement.closest('.code-wrapper');
        
        if (isCodeFocused && (e.ctrlKey || e.metaKey) && e.key === 'c') {
            e.preventDefault();
            copyBtn.click();
        }
    });
}

// Initialize animations
function initAnimations() {
    // Intersection Observer for feature items
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe feature items
    document.querySelectorAll('.feature-item').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });
    
    // Add hover effects
    document.querySelectorAll('.feature-item').forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Tooltips
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function(e) {
            const tooltipText = this.getAttribute('data-tooltip');
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = tooltipText;
            
            // Position tooltip
            const rect = this.getBoundingClientRect();
            tooltip.style.cssText = `
                position: fixed;
                top: ${rect.top - 40}px;
                left: ${rect.left + rect.width / 2}px;
                transform: translateX(-50%);
                background: rgba(15, 23, 42, 0.95);
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 12px;
                white-space: nowrap;
                z-index: 10000;
                pointer-events: none;
                border: 1px solid rgba(124, 58, 237, 0.3);
                backdrop-filter: blur(10px);
            `;
            
            document.body.appendChild(tooltip);
            
            this._tooltip = tooltip;
        });
        
        element.addEventListener('mouseleave', function() {
            if (this._tooltip) {
                this._tooltip.remove();
                delete this._tooltip;
            }
        });
    });
}

// API Status indicator
function initAPIStatus() {
    const statusIndicator = document.querySelector('.stat-item strong');
    if (!statusIndicator) return;
    
    // Simulate API status check (in real app, this would be an actual API call)
    function checkAPIStatus() {
        // Mock API check - always returns operational for demo
        const isOperational = true;
        
        if (isOperational) {
            statusIndicator.textContent = 'Operational';
            statusIndicator.style.color = '#10b981';
        } else {
            statusIndicator.textContent = 'Degraded';
            statusIndicator.style.color = '#f59e0b';
        }
    }
    
    // Check initially and every 30 seconds
    checkAPIStatus();
    setInterval(checkAPIStatus, 30000);
}

// Mobile menu (if needed)
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    if (!menuToggle) return;
    
    const navLinks = document.querySelector('.nav-links');
    
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // Set icon based on type
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle',
        warning: 'fa-exclamation-triangle'
    };
    
    notification.innerHTML = `
        <i class="fas ${icons[type]}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'rgba(16, 185, 129, 0.9)' : 
                     type === 'error' ? 'rgba(239, 68, 68, 0.9)' : 
                     type === 'warning' ? 'rgba(245, 158, 11, 0.9)' : 
                     'rgba(59, 130, 246, 0.9)'};
        color: white;
        padding: 15px 20px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        animation: notificationSlideIn 0.3s ease-out;
        max-width: 400px;
        font-size: 0.95rem;
    `;
    
    // Add keyframe animation
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes notificationSlideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes notificationSlideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'notificationSlideOut 0.3s ease-out forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Performance monitoring
function monitorPerformance() {
    if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.entryType === 'largest-contentful-paint') {
                    console.log(`LCP: ${entry.renderTime}ms`);
                }
            }
        });
        
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }
}

// Initialize performance monitoring
if (document.readyState === 'complete') {
    monitorPerformance();
} else {
    window.addEventListener('load', monitorPerformance);
}

// Export for testing
window.PevolutionUI = {
    showNotification,
    copyLoader: () => document.getElementById('copyLoaderBtn')?.click()
};