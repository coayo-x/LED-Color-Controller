// admin.js


class AdminPanel {
    constructor() {
        this.modal = null;
        this.isOpen = false;
        this.focusableElements = [];
        this.focusedElementBeforeOpen = null;
        
        this.init();
    }
    
    init() {
        this.createAdminModal();
        
        this.addEventListeners();
        
        setTimeout(() => {
            this.updateStatus();
            this.updateUptime();
        }, 1000);
        
        setInterval(() => this.updateUptime(), 60000);
        
        console.log('Admin Panel initialized');
    }
    
    createAdminModal() {
        if (document.getElementById('adminPanelModal')) {
            console.log('Admin Panel modal already exists');
            this.modal = document.getElementById('adminPanelModal');
            this.addComingSoonOverlay();
            return;
        }
        
        const modal = document.createElement('div');
        modal.id = 'adminPanelModal';
        modal.className = 'ap-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-hidden', 'true');
        modal.setAttribute('aria-labelledby', 'adminPanelTitle');
        
        modal.innerHTML = `
            <div class="ap-content" role="document">
                <div class="ap-header">
                    <h2 id="adminPanelTitle">Admin Panel</h2>
                    <button id="adminClose" class="ap-close-btn" aria-label="Close admin panel">&times;</button>
                </div>
                <div class="ap-body">
                    <div class="ap-container">
                        <div class="ap-section">
                            <h3 class="ap-section-title">System Status</h3>
                            <div class="ap-info-grid">
                                <div class="ap-info-item">
                                    <div class="ap-info-label">API Status</div>
                                    <div class="ap-info-value" id="apApiStatus">
                                        <span class="ap-status online">Online</span>
                                    </div>
                                </div>
                                <div class="ap-info-item">
                                    <div class="ap-info-label">LED Controller</div>
                                    <div class="ap-info-value" id="apLedStatus">
                                        <span class="ap-status online">Connected</span>
                                    </div>
                                </div>
                                <div class="ap-info-item">
                                    <div class="ap-info-label">Active Clients</div>
                                    <div class="ap-info-value" id="apClientCount">N/A</div>
                                </div>
                                <div class="ap-info-item">
                                    <div class="ap-info-label">Uptime</div>
                                    <div class="ap-info-value" id="apUptime">0h 0m</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="ap-section">
                            <h3 class="ap-section-title">System Information</h3>
                            <p><strong>Version:</strong> 1.0.0</p>
                            <p><strong>API Base:</strong> <span id="apApiBase">${window.location.hostname}:8000</span></p>
                            <p><strong>Last Updated:</strong> <span id="apLastUpdate">Just now</span></p>
                            <p><strong>Animation State:</strong> <span id="apAnimState">Idle</span></p>
                        </div>
                        
                        <div class="ap-section">
                            <h3 class="ap-section-title">Quick Actions</h3>
                            <div class="ap-controls">
                                <button class="ap-control-btn primary" id="apRefreshStatus">
                                    Refresh Status
                                </button>
                                <button class="ap-control-btn" id="apViewLogs">
                                    View System Logs
                                </button>
                                <button class="ap-control-btn danger" id="apEmergencyStop">
                                    Emergency Stop
                                </button>
                            </div>
                        </div>

                        <div class="ap-section ap-section-real-admin" id="apRealAdminSection" aria-labelledby="realAdminTitle" role="region">
                          <div class="real-admin-card" role="group" aria-label="Real Admin Stuff (coming soon)">
                            <div class="real-admin-content" aria-hidden="true">
                              <span class="real-admin-title" id="realAdminTitle">Real Admin Stuff</span>
                              <div class="real-admin-desc">Advanced controls and server-side tools — available soon.</div>
                              <div class="real-admin-cta">Locked</div>
                            </div>

                            <div class="real-admin-overlay" role="status" aria-live="polite" aria-label="Coming soon">
                              <span class="coming-soon-text">
                                Coming soon
                                <span class="dots" aria-hidden="true">
                                  <span class="dot">.</span>
                                  <span class="dot">.</span>
                                  <span class="dot">.</span>
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div class="ap-footer-note">
                            <p>Restricted Access • Admin is tuff</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.modal = modal;
        
        this.addComingSoonOverlay();
        
        this.updateFocusableElements();
        
        console.log('Admin Panel modal created (with Real Admin Stuff placeholder)');
    }
    
    addEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.id === 'adminPanelBtn' || e.target.closest('#adminPanelBtn')) {
                e.preventDefault();
                this.open();
            }
            
            if (e.target.id === 'adminClose' || e.target.closest('#adminClose')) {
                e.preventDefault();
                this.close();
            }
            
            if (e.target === this.modal) {
                this.close();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
            
            if (e.key === 'Tab' && this.isOpen) {
                this.trapFocus(e);
            }
        });
        
        document.addEventListener('click', (e) => {
            if (!this.isOpen) return;
            
            if (e.target.id === 'apRefreshStatus') {
                this.refreshStatus();
            }
            
            if (e.target.id === 'apViewLogs') {
                this.viewLogs();
            }
            
            if (e.target.id === 'apEmergencyStop') {
                this.emergencyStop();
            }
        });
        
        console.log('Admin Panel event listeners added');
    }
    
    open() {
        if (this.isOpen) return;
        
        this.focusedElementBeforeOpen = document.activeElement;
        
        this.modal.classList.add('show');
        this.modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('ap-modal-open');
        this.isOpen = true;
        
        this.updateFocusableElements();
        
        setTimeout(() => {
            this.focusableElements[0]?.focus();
        }, 50);
        
        this.updateStatus();
        
        console.log('Admin Panel opened');
    }
    
    close() {
        if (!this.isOpen) return;
        
        this.modal.classList.remove('show');
        this.modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('ap-modal-open');
        this.isOpen = false;
        
        if (this.focusedElementBeforeOpen) {
            this.focusedElementBeforeOpen.focus();
        }
        
        console.log('Admin Panel closed');
    }
    
    updateFocusableElements() {
        if (!this.modal) return;
        
        const focusableSelectors = [
            'button:not([disabled])',
            '[href]',
            'input:not([disabled])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            '[tabindex]:not([tabindex="-1"])'
        ];
        
        this.focusableElements = Array.from(
            this.modal.querySelectorAll(focusableSelectors.join(','))
        );
    }
    
    trapFocus(e) {
        if (!this.isOpen || this.focusableElements.length === 0) return;
        
        const firstElement = this.focusableElements[0];
        const lastElement = this.focusableElements[this.focusableElements.length - 1];
        
        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }
    
    async updateStatus() {
        try {
            const apiStatus = this.modal?.querySelector('#apApiStatus .ap-status');
            const ledStatus = this.modal?.querySelector('#apLedStatus .ap-status');
            const clientCount = this.modal?.querySelector('#apClientCount');
            const animState = this.modal?.querySelector('#apAnimState');
            
            if (!apiStatus || !ledStatus || !clientCount || !animState) return;
            
            try {
                const response = await fetch(`http://${window.location.hostname}:8000/state`);
                if (response.ok) {
                    const data = await response.json();
                    
                    apiStatus.className = 'ap-status online';
                    apiStatus.textContent = 'Online';
                    
                    ledStatus.className = 'ap-status online';
                    ledStatus.textContent = 'Connected';
                    
                    animState.textContent = data.animation ? data.animation : 'Idle';
                } else {
                    throw new Error('API not responding');
                }
            } catch (error) {
                apiStatus.className = 'ap-status offline';
                apiStatus.textContent = 'Offline';
                
                ledStatus.className = 'ap-status offline';
                ledStatus.textContent = 'Disconnected';
                
                animState.textContent = 'Unknown';
            }
            
            const lastUpdate = this.modal.querySelector('#apLastUpdate');
            if (lastUpdate) {
                const now = new Date();
                lastUpdate.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            }
            
        } catch (error) {
            console.error('Error updating admin status:', error);
        }
    }
    
    updateUptime() {
        const uptimeElement = this.modal?.querySelector('#apUptime');
        if (!uptimeElement) return;
        
        const startTime = Date.now() - (30 * 60 * 1000); 
        const uptimeMs = Date.now() - startTime;
        
        const hours = Math.floor(uptimeMs / (1000 * 60 * 60));
        const minutes = Math.floor((uptimeMs % (1000 * 60 * 60)) / (1000 * 60));
        
        uptimeElement.textContent = `N/A`;
    }
    
    refreshStatus() {
        const btn = this.modal?.querySelector('#apRefreshStatus');
        if (!btn) return;
        
        const originalText = btn.textContent;
        
        btn.textContent = 'Refreshing...';
        btn.disabled = true;
        
        setTimeout(() => {
            this.updateStatus();
            this.updateUptime();
            
            btn.textContent = '✓ Refreshed';
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
            }, 1000);
        }, 500);
    }
    
    viewLogs() {
        const btn = this.modal?.querySelector('#apViewLogs');
        if (!btn) return;
        
        const originalText = btn.textContent;
        
        btn.textContent = 'Loading logs...';
        btn.disabled = true;
        
        setTimeout(() => {
            alert('Log viewer would open here. This is a demo implementation.');
            
            btn.textContent = originalText;
            btn.disabled = false;
        }, 300);
    }
    
    emergencyStop() {
        if (!confirm('Are you sure you want to emergency stop all animations?\\nThis will turn off all LEDs.')) {
            return;
        }
        
        const btn = this.modal?.querySelector('#apEmergencyStop');
        if (!btn) return;
        
        const originalText = btn.textContent;
        
        btn.textContent = 'Stopping...';
        btn.disabled = true;
        
        setTimeout(() => {

            
            btn.textContent = '✓ Stopped';
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
                this.updateStatus();
            }, 1500);
        }, 800);
    }


    addComingSoonOverlay() {
        if (!this.modal) return;

        const btn = this.modal.querySelector('#apEmergencyStop');
        if (!btn) return; 

        if (btn.__comingSoonAttached) return;

        let wrapper;
        if (btn.parentNode && btn.parentNode.classList && btn.parentNode.classList.contains('ap-button-wrap')) {
            wrapper = btn.parentNode;
        } else {
            wrapper = document.createElement('div');
            wrapper.className = 'ap-button-wrap';
            // preserve display style
            wrapper.style.display = window.getComputedStyle(btn).display === 'block' ? 'block' : 'inline-block';
            btn.parentNode.insertBefore(wrapper, btn);
            wrapper.appendChild(btn);
        }

        try {
            const br = window.getComputedStyle(btn).borderRadius;
            if (br) wrapper.style.borderRadius = br;
        } catch (e) {
        }

        const overlay = document.createElement('div');
        overlay.className = 'coming-soon-overlay animate-float';
        overlay.setAttribute('aria-hidden', 'true');

        overlay.innerHTML = `
            <span class="coming-soon-text">
                Coming soon
                <span class="dots" aria-hidden="true">
                    <span class="dot">.</span>
                    <span class="dot">.</span>
                    <span class="dot">.</span>
                </span>
            </span>
        `;

        wrapper.appendChild(overlay);

        btn.disabled = true;
        btn.setAttribute('aria-disabled', 'true');

        btn.__comingSoonAttached = true;
        btn.__comingSoonOverlay = overlay;

        this.updateFocusableElements();
    }

    removeComingSoonOverlay() {
        if (!this.modal) return;
        const btn = this.modal.querySelector('#apEmergencyStop');
        if (!btn || !btn.__comingSoonAttached) return;

        const overlay = btn.__comingSoonOverlay;
        if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);

        const wrapper = btn.parentNode;
        if (wrapper && wrapper.classList && wrapper.classList.contains('ap-button-wrap')) {
            wrapper.parentNode.insertBefore(btn, wrapper);
            wrapper.parentNode.removeChild(wrapper);
        }

        btn.disabled = false;
        btn.removeAttribute('aria-disabled');

        delete btn.__comingSoonAttached;
        delete btn.__comingSoonOverlay;

        this.updateFocusableElements();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const footer = document.querySelector('.site-footer');
    if (footer) {
        const adminBtn = document.createElement('button');
        adminBtn.id = 'adminPanelBtn';
        adminBtn.className = 'ap-button';
        adminBtn.textContent = 'Admin Panel';
        adminBtn.setAttribute('aria-haspopup', 'dialog');
        adminBtn.setAttribute('aria-controls', 'adminPanelModal');
        adminBtn.setAttribute('aria-label', 'Open Admin Panel');
        
        footer.appendChild(adminBtn);
        
        console.log('Admin Panel button added to footer');
    }
    
    new AdminPanel();
});

window.AdminPanel = AdminPanel;
