/**
 * Coming Soon Feature Handler
 * Shows "Coming Soon" notifications for features in development
 */

document.addEventListener('DOMContentLoaded', function() {
    // Handle Get Key button
    const getKeyBtn = document.getElementById('getKeyBtn');
    if (getKeyBtn) {
        getKeyBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showComingSoonNotification('Get Key Feature', 
                'The key distribution system is currently in development. Join our Discord for early access!');
        });
    }
    
    // Handle script buttons
    document.addEventListener('click', function(e) {
        // Check if clicked element or its parent is a script action button
        const scriptBtn = e.target.closest('[onclick*="showComingSoon"]');
        if (scriptBtn) {
            e.preventDefault();
            const feature = scriptBtn.getAttribute('onclick').match(/'([^']+)'/)?.[1] || 'This feature';
            showComingSoonNotification(feature, 
                'This feature is currently in development. Check back soon for updates!');
        }
    });
});

function showComingSoonNotification(feature, message) {
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'coming-soon-notification';
    
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(15, 23, 42, 0.95);
        backdrop-filter: blur(20px);
        border: 2px solid rgba(124, 58, 237, 0.3);
        border-radius: 20px;
        padding: 40px;
        max-width: 500px;
        width: 90%;
        z-index: 100000;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        animation: notificationAppear 0.3s ease-out;
        text-align: center;
    `;
    
    notification.innerHTML = `
        <div style="margin-bottom: 30px;">
            <div style="font-size: 60px; color: #7c3aed; margin-bottom: 20px;">
                <i class="fas fa-tools"></i>
            </div>
            <h3 style="color: #f8fafc; font-size: 24px; margin-bottom: 10px;">🚧 Coming Soon</h3>
            <p style="color: #94a3b8; font-size: 16px; line-height: 1.6;">${message}</p>
        </div>
        
        <div style="background: rgba(124, 58, 237, 0.1); border-radius: 12px; padding: 20px; margin-bottom: 30px;">
            <div style="color: #f8fafc; font-weight: 600; margin-bottom: 10px;">${feature}</div>
            <div style="color: #a78bfa; font-size: 14px;">In Development</div>
        </div>
        
        <div style="display: flex; gap: 12px; justify-content: center;">
            <button class="coming-soon-close" style="
                background: rgba(124, 58, 237, 0.2);
                color: #a78bfa;
                border: 1px solid rgba(124, 58, 237, 0.4);
                padding: 12px 24px;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 14px;
            ">
                <i class="fas fa-times"></i> Close
            </button>
            <a href="https://discord.gg/pevolution" target="_blank" style="
                background: linear-gradient(135deg, #7c3aed, #06b6d4);
                color: white;
                padding: 12px 24px;
                border-radius: 8px;
                text-decoration: none;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 8px;
                transition: all 0.3s ease;
                font-size: 14px;
            ">
                <i class="fab fa-discord"></i> Join Discord
            </a>
        </div>
    `;
    
    // Add overlay
    const overlay = document.createElement('div');
    overlay.className = 'coming-soon-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(2, 6, 23, 0.8);
        backdrop-filter: blur(10px);
        z-index: 99999;
        animation: overlayAppear 0.3s ease-out;
    `;
    
    document.body.appendChild(overlay);
    document.body.appendChild(notification);
    
    // Add animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes notificationAppear {
            from {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.9);
            }
            to {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }
        }
        
        @keyframes overlayAppear {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes notificationDisappear {
            to {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.9);
            }
        }
        
        @keyframes overlayDisappear {
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Close functionality
    const closeBtn = notification.querySelector('.coming-soon-close');
    closeBtn.addEventListener('click', function() {
        notification.style.animation = 'notificationDisappear 0.3s ease-out forwards';
        overlay.style.animation = 'overlayDisappear 0.3s ease-out forwards';
        
        setTimeout(() => {
            if (notification.parentNode) notification.remove();
            if (overlay.parentNode) overlay.remove();
        }, 300);
    });
    
    // Close on overlay click
    overlay.addEventListener('click', function() {
        notification.style.animation = 'notificationDisappear 0.3s ease-out forwards';
        overlay.style.animation = 'overlayDisappear 0.3s ease-out forwards';
        
        setTimeout(() => {
            if (notification.parentNode) notification.remove();
            if (overlay.parentNode) overlay.remove();
        }, 300);
    });
    
    // Add hover effects
    const buttons = notification.querySelectorAll('button, a');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.3)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });
}

// Global function for other pages
window.showComingSoon = function(feature) {
    showComingSoonNotification(feature, 
        'This feature is currently in development. Join our Discord for updates and early access!');
};