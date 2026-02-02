/**
 * Pevolution Security Protection v2.0
 * Advanced script protection against unauthorized access
 */

(function() {
    'use strict';
    
    // Security configuration
    const SECURITY_CONFIG = {
        disableRightClick: true,
        disableDevTools: true,
        disableCopy: false,
        disablePrintScreen: false,
        disableViewSource: true,
        disableInspectElement: true,
        logAttempts: true,
        maxViolations: 5,
        violationRedirect: false,
        redirectUrl: '/blocked',
        showWarnings: true
    };
    
    // Track security violations
    let violationCount = 0;
    const VIOLATION_TYPES = {
        RIGHT_CLICK: 'right_click',
        DEVTOOLS: 'devtools',
        COPY: 'copy',
        PRINT_SCREEN: 'print_screen',
        VIEW_SOURCE: 'view_source',
        INSPECT: 'inspect'
    };
    
    // Performance monitoring
    let performanceStart = performance.now();
    
    // Log security events
    function logSecurityEvent(type, details = {}) {
        if (!SECURITY_CONFIG.logAttempts) return;
        
        const timestamp = new Date().toISOString();
        const eventData = {
            type,
            details,
            timestamp,
            url: window.location.href,
            userAgent: navigator.userAgent,
            violations: violationCount
        };
        
        // Console log with styling
        console.log(
            '%c🔒 Pevolution Security\n' +
            `%cEvent: ${type}\n` +
            `Time: ${timestamp}\n` +
            `Violations: ${violationCount}\n` +
            `URL: ${window.location.href}`,
            'color: #7c3aed; font-weight: bold; font-size: 12px;',
            'color: #94a3b8; font-size: 11px;'
        );
        
        // Store in localStorage for tracking
        try {
            const logs = JSON.parse(localStorage.getItem('pevolution_security_logs') || '[]');
            logs.push(eventData);
            if (logs.length > 100) logs.shift(); // Keep only last 100 logs
            localStorage.setItem('pevolution_security_logs', JSON.stringify(logs));
        } catch (e) {
            // Silently fail if localStorage is not available
        }
    }
    
    // Show security warning
    function showSecurityWarning(message, type = 'warning') {
        if (!SECURITY_CONFIG.showWarnings) return;
        
        // Remove existing warning
        const existingWarning = document.querySelector('.security-warning');
        if (existingWarning) {
            existingWarning.remove();
        }
        
        // Create warning element
        const warning = document.createElement('div');
        warning.className = `security-warning security-warning-${type}`;
        
        // Set colors based on type
        const colors = {
            warning: { bg: '#ef4444', icon: 'fa-exclamation-triangle' },
            info: { bg: '#3b82f6', icon: 'fa-info-circle' },
            success: { bg: '#10b981', icon: 'fa-shield-check' }
        };
        
        const colorConfig = colors[type] || colors.warning;
        
        warning.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colorConfig.bg};
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            font-size: 14px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 12px;
            animation: securitySlideIn 0.3s ease-out;
            max-width: 400px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            pointer-events: none;
        `;
        
        warning.innerHTML = `
            <i class="fas ${colorConfig.icon}" style="font-size: 18px;"></i>
            <span>${message}</span>
        `;
        
        // Add animation styles if not present
        if (!document.querySelector('#security-styles')) {
            const style = document.createElement('style');
            style.id = 'security-styles';
            style.textContent = `
                @keyframes securitySlideIn {
                    from {
                        transform: translateX(100%) translateY(-20px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0) translateY(0);
                        opacity: 1;
                    }
                }
                
                @keyframes securitySlideOut {
                    from {
                        transform: translateX(0) translateY(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%) translateY(-20px);
                        opacity: 0;
                    }
                }
                
                @keyframes securityShake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(warning);
        
        // Add shake animation for serious warnings
        if (type === 'warning') {
            warning.style.animation = 'securitySlideIn 0.3s ease-out, securityShake 0.5s ease 0.3s';
        }
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (warning.parentNode) {
                warning.style.animation = 'securitySlideOut 0.3s ease-out forwards';
                setTimeout(() => {
                    if (warning.parentNode) {
                        warning.remove();
                    }
                }, 300);
            }
        }, 3000);
    }
    
    // Check violation limit
    function checkViolationLimit() {
        if (violationCount >= SECURITY_CONFIG.maxViolations) {
            logSecurityEvent('max_violations_reached', { count: violationCount });
            
            if (SECURITY_CONFIG.violationRedirect) {
                showSecurityWarning('Maximum security violations reached. Redirecting...', 'warning');
                
                // Redirect after delay
                setTimeout(() => {
                    window.location.href = SECURITY_CONFIG.redirectUrl;
                }, 2000);
            } else {
                showSecurityWarning('Maximum security violations reached. Further attempts may result in IP ban.', 'warning');
            }
        }
    }
    
    // Block right-click context menu
    if (SECURITY_CONFIG.disableRightClick) {
        document.addEventListener('contextmenu', function(e) {
            logSecurityEvent(VIOLATION_TYPES.RIGHT_CLICK, {
                x: e.clientX,
                y: e.clientY,
                target: e.target.tagName
            });
            
            e.preventDefault();
            e.stopPropagation();
            
            showSecurityWarning('Right-click is disabled for security reasons.');
            
            violationCount++;
            checkViolationLimit();
            
            return false;
        }, true);
    }
    
    // Block DevTools shortcuts
    if (SECURITY_CONFIG.disableDevTools) {
        const blockedShortcuts = [
            { key: 'F12', description: 'DevTools (F12)' },
            { key: 'I', ctrl: true, shift: true, description: 'DevTools (Ctrl+Shift+I)' },
            { key: 'J', ctrl: true, shift: true, description: 'Console (Ctrl+Shift+J)' },
            { key: 'C', ctrl: true, shift: true, description: 'Element Picker (Ctrl+Shift+C)' },
            { key: 'K', ctrl: true, shift: true, description: 'Command Menu (Ctrl+Shift+K)' },
            { key: 'B', ctrl: true, shift: true, description: 'Bookmarks (Ctrl+Shift+B)' },
        ];
        
        document.addEventListener('keydown', function(e) {
            for (const shortcut of blockedShortcuts) {
                const ctrlMatch = !shortcut.ctrl || e.ctrlKey || e.metaKey;
                const shiftMatch = !shortcut.shift || e.shiftKey;
                const keyMatch = e.key.toUpperCase() === shortcut.key.toUpperCase();
                
                if (ctrlMatch && shiftMatch && keyMatch) {
                    logSecurityEvent(VIOLATION_TYPES.DEVTOOLS, {
                        shortcut: shortcut.description,
                        key: e.key,
                        ctrlKey: e.ctrlKey,
                        shiftKey: e.shiftKey
                    });
                    
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    
                    showSecurityWarning('Developer tools are disabled for security.');
                    
                    violationCount++;
                    checkViolationLimit();
                    
                    return false;
                }
            }
        }, true);
    }
    
    // Block view source
    if (SECURITY_CONFIG.disableViewSource) {
        document.addEventListener('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && e.key.toUpperCase() === 'U') {
                logSecurityEvent(VIOLATION_TYPES.VIEW_SOURCE, { shortcut: 'Ctrl+U' });
                
                e.preventDefault();
                e.stopPropagation();
                
                showSecurityWarning('View source is disabled for security.');
                
                violationCount++;
                checkViolationLimit();
                
                return false;
            }
        }, true);
    }
    
    // Block print screen
    if (SECURITY_CONFIG.disablePrintScreen) {
        document.addEventListener('keydown', function(e) {
            if (e.key === 'PrintScreen' || (e.ctrlKey && e.key === 'p')) {
                logSecurityEvent(VIOLATION_TYPES.PRINT_SCREEN, { key: e.key });
                
                e.preventDefault();
                e.stopPropagation();
                
                // Create screenshot protection overlay
                const overlay = document.createElement('div');
                overlay.id = 'screenshot-protection';
                overlay.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: black;
                    color: white;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    z-index: 999999;
                    font-family: monospace;
                    text-align: center;
                    padding: 20px;
                `;
                
                overlay.innerHTML = `
                    <div style="font-size: 48px; margin-bottom: 20px;">🚫</div>
                    <div style="font-size: 24px; margin-bottom: 10px;">SCREENSHOT PROTECTION</div>
                    <div style="font-size: 16px; opacity: 0.8; max-width: 400px;">
                        Screenshots are disabled for security reasons.
                        This protection will be removed in 3 seconds.
                    </div>
                `;
                
                document.body.appendChild(overlay);
                
                setTimeout(() => {
                    if (overlay.parentNode) {
                        overlay.remove();
                    }
                }, 3000);
                
                violationCount++;
                checkViolationLimit();
                
                return false;
            }
        });
    }
    
    // Block copy operations (optional)
    if (SECURITY_CONFIG.disableCopy) {
        document.addEventListener('copy', function(e) {
            // Allow copying from code blocks
            if (!e.target.closest('.code-block, .code-wrapper, .code-visual')) {
                logSecurityEvent(VIOLATION_TYPES.COPY, {
                    target: e.target.tagName,
                    selection: window.getSelection().toString().substring(0, 100)
                });
                
                e.preventDefault();
                e.stopPropagation();
                
                showSecurityWarning('Copy function is disabled for security.');
                
                violationCount++;
                checkViolationLimit();
                
                return false;
            }
        }, true);
        
        document.addEventListener('cut', function(e) {
            logSecurityEvent(VIOLATION_TYPES.COPY, { type: 'cut' });
            
            e.preventDefault();
            e.stopPropagation();
            
            showSecurityWarning('Cut function is disabled for security.');
            
            violationCount++;
            checkViolationLimit();
            
            return false;
        }, true);
    }
    
    // Detect DevTools opening (advanced detection)
    function detectDevTools() {
        const threshold = 160;
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;
        
        if (widthThreshold || heightThreshold) {
            logSecurityEvent(VIOLATION_TYPES.DEVTOOLS, {
                detection: 'size_mismatch',
                outerWidth: window.outerWidth,
                innerWidth: window.innerWidth,
                outerHeight: window.outerHeight,
                innerHeight: window.innerHeight
            });
            
            showSecurityWarning('Developer tools detected. Please close DevTools to continue.', 'warning');
            
            violationCount++;
            checkViolationLimit();
            
            return true;
        }
        
        // Check for debugger statements
        try {
            debugger;
        } catch (e) {
            logSecurityEvent(VIOLATION_TYPES.DEVTOOLS, { detection: 'debugger' });
            return true;
        }
        
        return false;
    }
    
    // Periodic DevTools detection
    if (SECURITY_CONFIG.disableDevTools) {
        setInterval(detectDevTools, 1000);
        
        // Also check on resize
        window.addEventListener('resize', detectDevTools);
    }
    
    // Add security badge
    function addSecurityBadge() {
        const badge = document.createElement('div');
        badge.className = 'security-status-badge';
        badge.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(15, 23, 42, 0.95);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(124, 58, 237, 0.3);
            border-radius: 12px;
            padding: 12px 20px;
            font-size: 12px;
            color: #94a3b8;
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 999;
            font-family: 'JetBrains Mono', monospace;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            cursor: default;
            user-select: none;
            transition: all 0.3s ease;
        `;
        
        badge.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <div style="width: 8px; height: 8px; background: #10b981; border-radius: 50%; animation: pulse 2s infinite;"></div>
                <span>Pevolution Protected</span>
            </div>
            <div style="font-size: 10px; opacity: 0.6; margin-left: 8px;">
                v2.0
            </div>
        `;
        
        // Add pulse animation
        const pulseStyle = document.createElement('style');
        pulseStyle.textContent = `
            @keyframes pulse {
                0%, 100% { 
                    opacity: 1;
                    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
                }
                50% { 
                    opacity: 0.5;
                    box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
                }
            }
        `;
        document.head.appendChild(pulseStyle);
        
        document.body.appendChild(badge);
        
        // Add hover effect
        badge.addEventListener('mouseenter', () => {
            badge.style.transform = 'translateY(-5px)';
            badge.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.4)';
            badge.style.color = '#f8fafc';
        });
        
        badge.addEventListener('mouseleave', () => {
            badge.style.transform = 'translateY(0)';
            badge.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
            badge.style.color = '#94a3b8';
        });
        
        // Click to show security info
        badge.addEventListener('click', (e) => {
            e.stopPropagation();
            showSecurityInfo();
        });
    }
    
    // Show security info modal
    function showSecurityInfo() {
        const modal = document.createElement('div');
        modal.className = 'security-info-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(2, 6, 23, 0.95);
            backdrop-filter: blur(20px);
            z-index: 1000000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease-out;
        `;
        
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: rgba(15, 23, 42, 0.95);
            border: 1px solid rgba(124, 58, 237, 0.3);
            border-radius: 20px;
            padding: 40px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            position: relative;
        `;
        
        modalContent.innerHTML = `
            <button style="position: absolute; top: 20px; right: 20px; background: none; border: none; color: #94a3b8; font-size: 24px; cursor: pointer; padding: 8px;">×</button>
            
            <div style="text-align: center; margin-bottom: 30px;">
                <div style="font-size: 48px; color: #7c3aed; margin-bottom: 20px;">
                    <i class="fas fa-shield-alt"></i>
                </div>
                <h2 style="margin-bottom: 10px; color: #f8fafc;">Pevolution Security</h2>
                <p style="color: #94a3b8; font-size: 14px;">Advanced protection system active</p>
            </div>
            
            <div style="margin-bottom: 30px;">
                <h3 style="margin-bottom: 15px; color: #f8fafc; font-size: 18px;">Active Protections</h3>
                <div style="display: grid; gap: 12px;">
                    ${Object.entries(SECURITY_CONFIG)
                        .filter(([key, value]) => typeof value === 'boolean' && value)
                        .map(([key]) => `
                            <div style="display: flex; align-items: center; gap: 12px; padding: 12px; background: rgba(255, 255, 255, 0.03); border-radius: 8px;">
                                <div style="width: 8px; height: 8px; background: #10b981; border-radius: 50%;"></div>
                                <span style="color: #f8fafc; font-size: 14px;">${key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                                <span style="margin-left: auto; color: #10b981; font-size: 12px;">ACTIVE</span>
                            </div>
                        `).join('')}
                </div>
            </div>
            
            <div style="background: rgba(16, 185, 129, 0.1); border-left: 4px solid #10b981; padding: 16px; border-radius: 8px; margin-bottom: 30px;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <i class="fas fa-info-circle" style="color: #10b981; font-size: 20px;"></i>
                    <div>
                        <div style="color: #f8fafc; font-weight: 600; margin-bottom: 4px;">Security Status</div>
                        <div style="color: #94a3b8; font-size: 12px;">All protections are active and monitoring</div>
                    </div>
                </div>
            </div>
            
            <div style="text-align: center; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
                <div style="font-size: 12px; color: #94a3b8; margin-bottom: 10px;">
                    Violations detected: <span style="color: ${violationCount > 0 ? '#ef4444' : '#10b981'}">${violationCount}</span>
                </div>
                <div style="font-size: 10px; color: #64748b;">
                    System initialized in ${(performance.now() - performanceStart).toFixed(2)}ms
                </div>
            </div>
        `;
        
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        // Close button functionality
        const closeBtn = modalContent.querySelector('button');
        closeBtn.addEventListener('click', () => {
            modal.style.animation = 'fadeOut 0.3s ease-out forwards';
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.remove();
                }
            }, 300);
        });
        
        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.animation = 'fadeOut 0.3s ease-out forwards';
                setTimeout(() => {
                    if (modal.parentNode) {
                        modal.remove();
                    }
                }, 300);
            }
        });
        
        // Add fade out animation
        const fadeStyle = document.createElement('style');
        fadeStyle.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(fadeStyle);
    }
    
    // Initialize security system
    function initSecurity() {
        performanceStart = performance.now();
        
        logSecurityEvent('system_init', {
            config: SECURITY_CONFIG,
            url: window.location.href,
            timestamp: new Date().toISOString()
        });
        
        addSecurityBadge();
        
        // Mutation observer for DOM changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeName === 'SCRIPT' && node.src) {
                            logSecurityEvent('external_script_detected', {
                                src: node.src,
                                type: node.type
                            });
                        }
                        
                        // Check for iframe injections
                        if (node.nodeName === 'IFRAME') {
                            logSecurityEvent('iframe_detected', {
                                src: node.src || 'inline'
                            });
                        }
                    });
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // Performance monitoring
        window.addEventListener('load', () => {
            const loadTime = performance.now() - performanceStart;
            logSecurityEvent('page_loaded', { loadTime: Math.round(loadTime) });
        });
        
        console.log('%c🔐 Pevolution Security System Active', 
            'color: #7c3aed; font-size: 16px; font-weight: bold; padding: 4px 8px; background: rgba(15, 23, 42, 0.9); border-radius: 4px;');
        console.log('%c⚠️  Unauthorized access attempts are logged and blocked.', 
            'color: #f59e0b; font-size: 12px;');
    }
    
    // Wait for DOM to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSecurity);
    } else {
        initSecurity();
    }
    
    // Export for testing/development
    window.PevolutionSecurity = {
        config: SECURITY_CONFIG,
        violations: () => violationCount,
        reset: () => { violationCount = 0; },
        showWarning: showSecurityWarning,
        showInfo: showSecurityInfo,
        log: logSecurityEvent
    };
    
    // Global error handler
    window.addEventListener('error', function(e) {
        logSecurityEvent('global_error', {
            message: e.message,
            filename: e.filename,
            lineno: e.lineno,
            colno: e.colno
        });
    });
    
    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', function(e) {
        logSecurityEvent('unhandled_rejection', {
            reason: e.reason?.toString() || 'Unknown'
        });
    });
    
})();