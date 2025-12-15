// customcolorpicker.js

const customColorPickerTooltipData = {
    'customFadeBtn': { 
        title: 'Fade Colors - Custom', 
        description: 'Smooth fade with your chosen color'
    },
    'customBlinkBtn': { 
        title: 'Blinking - Custom', 
        description: 'Blinking effect with your chosen color'
    },
    'customBreathingBtn': { 
        title: 'Breathing Effect - Custom', 
        description: 'Breathing effect with your chosen color'
    },
    'customMeteorShowerBtn': { 
        title: 'Meteor Shower - Custom', 
        description: 'Meteor shower with your chosen color'
    },
    'customPulseSyncBtn': { 
        title: 'Pulse Sync - Custom', 
        description: 'Pulse sync with your chosen color'
    },
    'customGlitchFlashBtn': { 
        title: 'Glitch Flash - Custom', 
        description: 'Glitch flash with your chosen color'
    },
    'customHeartBeatBtn': { 
        title: 'Heart Beat - Custom', 
        description: 'Heart beat with your chosen color'
    },
    'customTunnelEffectBtn': { 
        title: 'Tunnel Effect - Custom', 
        description: 'Tunnel effect with your chosen color'
    },
    'customLaserShotBtn': { 
        title: 'Laser Shot - Custom', 
        description: 'Laser shot with your chosen color'
    },
    'customSparklingStarsBtn': { 
        title: 'Sparkling Stars - Custom', 
        description: 'Sparkling stars with your chosen color'
    },
    'customStrobeFlashBtn': { 
        title: 'Strobe Flash - Custom', 
        description: 'Strobe flash with your chosen color'
    },
    'customKnightRiderBtn': { 
        title: 'Knight Rider - Custom', 
        description: 'Knight rider with your chosen color'
    },
    'customBounceBackBtn': { 
        title: 'Bounce Back - Custom', 
        description: 'Bounce back with your chosen color'
    },
    'customRippleTouchBtn': { 
        title: 'Ripple Touch - Custom', 
        description: 'Ripple touch with your chosen color'
    },
    'customFireFlickerBtn': { 
        title: 'Fire Flicker - Custom', 
        description: 'Fire flicker with your chosen color'
    },
    'customColorWipeBtn': { 
        title: 'Color Wipe - Custom', 
        description: 'Color wipe with your chosen color'
    },
    'customStaticGlowBtn': { 
        title: 'Static Glow with Flicker - Custom', 
        description: 'Static glow with flicker using your chosen color'
    },
    'customColorEchoBtn': { 
        title: 'Color Echo - Custom', 
        description: 'Color echo with your chosen color'
    },
    'customTimeWarpBtn': { 
        title: 'Time Warp - Custom', 
        description: 'Time warp with your chosen color'
    },
    'customQuantumFlickerBtn': { 
        title: 'Quantum Flicker - Custom', 
        description: 'Quantum flicker with your chosen color'
    },
    'customRunningLightsBtn': { 
        title: 'Running Lights - Custom', 
        description: 'Running lights with your chosen color'
    },
    'customFireworksBurstBtn': { 
        title: 'Fireworks Burst - Custom', 
        description: 'Fireworks burst with your chosen color'
    }
};

let ccpTooltip = null;
let ccpBrightness = 25;
let ccpSelectedColor = null;
let ccpClickedButton = null; 
let ccpIsApplying = false;

const ccpErrorMessages = [
    "Plz choose color 🙏",
    "Animations need some color vibes.",
    "Pick a color or the animation stays moody.",
    "Colors are free bro, choose one.",
    "No color? No animation!",
    "Choose a color to make it shine!",
    "Color missing - animation waiting...",
    "Add some color magic first!",
    "Select a color to start the party!",
    "The lights need your color choice!"
];

function ccpLoadSettings() {
    const savedBrightness = localStorage.getItem('ccpBrightness');
    const savedColor = localStorage.getItem('ccpColor');
    
    if (savedBrightness !== null) {
        ccpBrightness = parseInt(savedBrightness);
    }
    
    if (savedColor !== null && savedColor !== 'null') {
        ccpSelectedColor = savedColor;
    }
    
    console.log('Loaded CCP settings - Brightness:', ccpBrightness, 'Color:', ccpSelectedColor);
}

function ccpSaveSettings() {
    localStorage.setItem('ccpBrightness', ccpBrightness.toString());
    localStorage.setItem('ccpColor', ccpSelectedColor);
    console.log('Saved CCP settings - Brightness:', ccpBrightness, 'Color:', ccpSelectedColor);
}

function ccpGetRandomError() {
    return ccpErrorMessages[Math.floor(Math.random() * ccpErrorMessages.length)];
}

function ccpInit() {
    console.log('Initializing Custom Color Picker...');
    
    ccpLoadSettings();
    
    ccpCreateTooltip();
    
    ccpSetupEventListeners();
}

function ccpCreateTooltip() {
    if (document.getElementById('ccp-tooltip')) {
        ccpTooltip = document.getElementById('ccp-tooltip');
        return;
    }

    const tooltip = document.createElement('div');
    tooltip.id = 'ccp-tooltip';
    tooltip.className = 'ccp-tooltip';
    tooltip.innerHTML = `
        <div class="ccp-tooltip-content">
            <h3 id="ccp-tooltip-title">Custom Color Animation</h3>
            <div class="ccp-description" id="ccp-description">Animation description</div>
            
            <div class="ccp-color-container">
                <div class="ccp-color-title">Choose Your Color:</div>
                <div class="ccp-color-wrapper">
                    <div class="ccp-color-ring"></div>
                    <input type="color" id="ccp-color-picker" value="${ccpSelectedColor || '#ff0000'}">
                </div>
                <div class="ccp-preview-container">
                    <div class="ccp-selected-preview ${!ccpSelectedColor ? 'ccp-no-color' : ''}" 
                         id="ccp-color-preview" 
                         style="background: ${ccpSelectedColor || 'transparent'}">
                         ${!ccpSelectedColor ? '?' : ''}
                    </div>
                    <span class="ccp-preview-text ${!ccpSelectedColor ? 'ccp-no-color-text' : ''}" 
                          id="ccp-preview-text">
                          ${ccpSelectedColor ? 'Selected Color' : 'No color selected'}
                    </span>
                </div>
            </div>

            <div class="ccp-brightness-controls">
                <div class="ccp-brightness-title">Set Animation Brightness:</div>
                <div class="ccp-brightness-display">
                    <span class="ccp-brightness-value" id="ccp-brightness-value">${ccpBrightness}%</span>
                </div>
                <div class="ccp-brightness-slider-container">
                    <input type="range" min="1" max="100" value="${ccpBrightness}" 
                           class="ccp-brightness-slider" id="ccp-brightness-slider">
                </div>
            </div>

            <div class="ccp-error-message" id="ccp-error-message"></div>

            <button class="ccp-apply-btn" id="ccp-apply-btn">Apply Settings</button>
        </div>
        <div class="ccp-tooltip-arrow"></div>
    `;
    document.body.appendChild(tooltip);
    ccpTooltip = tooltip;
    
    console.log('CCP tooltip created');
}

function ccpSetupEventListeners() {
    console.log('Setting up CCP event listeners...');
    
    document.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'ccp-apply-btn') {
            console.log('CCP Apply button clicked');
            ccpHandleApplySettings(e);
        }
    });

    document.addEventListener('wheel', function(e) {
        const brightnessSlider = document.getElementById('ccp-brightness-slider');
        if (brightnessSlider && (e.target === brightnessSlider || brightnessSlider.contains(e.target))) {
            e.preventDefault();
            ccpHandleWheelBrightness(e, brightnessSlider);
        }
    });

    document.addEventListener('input', function(e) {
        if (e.target && e.target.id === 'ccp-brightness-slider') {
            ccpHandleBrightnessChange(e);
        }
        
        if (e.target && e.target.id === 'ccp-color-picker') {
            ccpHandleColorChange(e);
        }
    });

    const customButtons = document.querySelectorAll('.button-container button:not(.custom-animation-btn)');
    console.log('Found custom buttons:', customButtons.length);
    
    customButtons.forEach(button => {
        const buttonId = button.id;
        
        if (customColorPickerTooltipData[buttonId]) {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Clicked custom button:', buttonId);
                ccpClickedButton = buttonId;
                ccpShowTooltip(button, buttonId);
            });
        }
    });

    if (ccpTooltip) {
        ccpTooltip.addEventListener('mouseenter', () => {
            ccpTooltip.classList.add('show');
        });

        ccpTooltip.addEventListener('mouseleave', () => {
            ccpHideTooltip();
        });
    }

    document.addEventListener('click', function(e) {
        if (e.target && customColorPickerTooltipData[e.target.id]) {
            e.preventDefault();
            e.stopPropagation();
        }
    });
}

function ccpShowTooltip(button, buttonId) {
    console.log('Showing CCP tooltip for:', buttonId);
    
    if (!ccpTooltip) {
        console.error('No CCP tooltip found');
        return;
    }

    const rect = button.getBoundingClientRect();
    const tooltipTitle = document.getElementById('ccp-tooltip-title');
    const description = document.getElementById('ccp-description');
    const brightnessSlider = document.getElementById('ccp-brightness-slider');
    const brightnessValue = document.getElementById('ccp-brightness-value');
    const applyBtn = document.getElementById('ccp-apply-btn');
    const colorPicker = document.getElementById('ccp-color-picker');
    const colorPreview = document.getElementById('ccp-color-preview');
    const previewText = document.getElementById('ccp-preview-text');
    const errorMessage = document.getElementById('ccp-error-message');

    if (!tooltipTitle || !description || !brightnessSlider || !brightnessValue || 
        !applyBtn || !colorPicker || !colorPreview || !previewText || !errorMessage) {
        console.error('CCP tooltip elements not found');
        return;
    }

    const buttonData = customColorPickerTooltipData[buttonId];
    if (!buttonData) {
        console.error('No data for button:', buttonId);
        return;
    }

    tooltipTitle.textContent = buttonData.title || '';
    description.textContent = buttonData.description || '';

    const [color1, color2, color3] = ccpGenerateRandomColors();
    ccpTooltip.style.setProperty('--ccp-color-1', color1);
    ccpTooltip.style.setProperty('--ccp-color-2', color2);
    ccpTooltip.style.setProperty('--ccp-color-3', color3);

    if (ccpSelectedColor) {
        colorPicker.value = ccpSelectedColor;
        colorPreview.style.background = ccpSelectedColor;
        colorPreview.textContent = '';
        colorPreview.classList.remove('ccp-no-color');
        previewText.textContent = 'Selected Color';
        previewText.classList.remove('ccp-no-color-text');
    } else {
        colorPicker.value = '#ff0000'; 
        colorPreview.style.background = 'transparent';
        colorPreview.textContent = '?';
        colorPreview.classList.add('ccp-no-color');
        previewText.textContent = 'No color selected';
        previewText.classList.add('ccp-no-color-text');
    }

    brightnessSlider.value = ccpBrightness;
    brightnessValue.textContent = `${ccpBrightness}%`;

    errorMessage.textContent = '';
    errorMessage.style.display = 'none';

    applyBtn.textContent = 'Apply Settings';

    ccpTooltip.style.left = `${rect.left + (rect.width / 2)}px`;
    ccpTooltip.style.top = `${rect.top - 10}px`;
    ccpTooltip.style.transform = 'translate(-50%, -100%)';

    ccpTooltip.classList.add('show');
    console.log('CCP tooltip shown');
}

function ccpHideTooltip() {
    if (ccpTooltip) {
        ccpTooltip.classList.remove('show');
        console.log('CCP tooltip hidden');
    }
}

function ccpHandleWheelBrightness(e, slider) {
    const step = 5;
    let newValue = parseInt(slider.value) + (e.deltaY > 0 ? -step : step);
    newValue = Math.max(1, Math.min(100, newValue));
    
    slider.value = newValue;
    ccpBrightness = newValue;
    
    ccpUpdateBrightnessDisplay(newValue);
    ccpSaveSettings();
}

function ccpHandleBrightnessChange(e) {
    const newValue = parseInt(e.target.value);
    ccpBrightness = newValue;
    ccpUpdateBrightnessDisplay(newValue);
    ccpSaveSettings();
}

function ccpHandleColorChange(e) {
    const newColor = e.target.value;
    ccpSelectedColor = newColor;
    
    const colorPreview = document.getElementById('ccp-color-preview');
    const previewText = document.getElementById('ccp-preview-text');
    
    if (colorPreview && previewText) {
        colorPreview.style.background = newColor;
        colorPreview.textContent = '';
        colorPreview.classList.remove('ccp-no-color');
        previewText.textContent = 'Selected Color';
        previewText.classList.remove('ccp-no-color-text');
    }
    
    const errorMessage = document.getElementById('ccp-error-message');
    if (errorMessage) {
        errorMessage.textContent = '';
        errorMessage.style.display = 'none';
    }
    
    ccpSaveSettings();
    console.log('CCP color changed to:', newColor);
}

function ccpUpdateBrightnessDisplay(value) {
    const brightnessValue = document.getElementById('ccp-brightness-value');
    if (brightnessValue) {
        brightnessValue.textContent = `${value}%`;
    }
}

async function ccpHandleApplySettings(e) {
    if (ccpIsApplying) return;
    
    const applyBtn = e.target;
    const errorMessage = document.getElementById('ccp-error-message');
    
    if (!ccpClickedButton) {
        errorMessage.textContent = 'Please click an animation button first';
        errorMessage.style.display = 'block';
        return;
    }
    
    if (!ccpSelectedColor) {
        const randomMessage = ccpGetRandomError();
        errorMessage.textContent = randomMessage;
        errorMessage.style.display = 'block';
        console.log('No color selected - showing error:', randomMessage);
        return;
    }

    console.log('Applying CCP settings - Button:', ccpClickedButton, 'Color:', ccpSelectedColor, 'Brightness:', ccpBrightness + '%');

    ccpIsApplying = true;
    applyBtn.disabled = true;
    const originalText = applyBtn.textContent;
    applyBtn.textContent = 'Applying...';

    try {
        await ccpUpdateBrightness(ccpBrightness);
        
        await ccpStartAnimation(ccpClickedButton, ccpSelectedColor);
        
        ccpHideTooltip();
        applyBtn.textContent = 'Done!';
        applyBtn.classList.add('done');
        
    } catch (error) {
        console.error('Error applying CCP settings:', error);
        applyBtn.textContent = 'Error!';
        errorMessage.textContent = 'Failed to apply settings. Please try again.';
        errorMessage.style.display = 'block';
    }

    setTimeout(() => {
        applyBtn.disabled = false;
        applyBtn.textContent = originalText;
        applyBtn.classList.remove('done');
        ccpIsApplying = false;
    }, 1000);
}

async function ccpUpdateBrightness(brightness) {
    console.log(`Updating brightness to: ${brightness}%`);
    
    try {
        const result = await ccpSendRequest("/set_brightness", { 
            brightness: brightness / 100 
        });
        
        if (result.status === "brightness_updated") {
            console.log("Brightness updated successfully");
            return true;
        } else {
            throw new Error("Failed to update brightness");
        }
    } catch (error) {
        console.error("Brightness update error:", error);
        throw error;
    }
}

async function ccpStartAnimation(buttonId, color) {
    console.log(`Starting animation for: ${buttonId} with color: ${color}`);
    
    const animationType = ccpGetAnimationType(buttonId);
    
    if (!animationType) {
        throw new Error('Unknown animation type');
    }
    
    try {
        const result = await ccpSendRequest("/animate", {
            animation_type: animationType,
            hex_color: color
        });
        
        if (result.status === "queued") {
            console.log("Animation started successfully");
            
            ccpUpdateUIState(buttonId, animationType);
            
            return true;
        } else {
            throw new Error("Failed to start animation");
        }
    } catch (error) {
        console.error("Animation start error:", error);
        throw error;
    }
}

function ccpUpdateUIState(buttonId, animationType) {
    const allButtons = document.querySelectorAll('.button-container button');
    allButtons.forEach(btn => {
        btn.classList.remove('active');
        const originalText = btn.textContent.replace(' (Running)', '');
        btn.textContent = originalText;
    });
    
    const currentButton = document.getElementById(buttonId);
    if (currentButton) {
        currentButton.classList.add('active');
        currentButton.textContent = currentButton.textContent.replace(' (Running)', '') + ' (Running)';
    }
    
    const colorDisplay = document.getElementById('colorDisplay');
    if (colorDisplay) {
        colorDisplay.textContent = animationType.replace('_', ' ').toUpperCase();
        colorDisplay.style.background = ccpSelectedColor;
    }
    
    console.log('UI updated for animation:', animationType);
}

function ccpGetAnimationType(buttonId) {
    const animationMap = {
        'customFadeBtn': 'custom_fade',
        'customBlinkBtn': 'custom_blink',
        'customBreathingBtn': 'custom_breathing',
        'customMeteorShowerBtn': 'custom_meteor_shower',
        'customPulseSyncBtn': 'custom_pulse_sync',
        'customGlitchFlashBtn': 'custom_glitch_flash',
        'customHeartBeatBtn': 'custom_heart_beat',
        'customTunnelEffectBtn': 'custom_tunnel_effect',
        'customLaserShotBtn': 'custom_laser_shot',
        'customSparklingStarsBtn': 'custom_sparkling_stars',
        'customStrobeFlashBtn': 'custom_strobe_flash',
        'customKnightRiderBtn': 'custom_knight_rider',
        'customBounceBackBtn': 'custom_bounce_back',
        'customRippleTouchBtn': 'custom_ripple_touch',
        'customFireFlickerBtn': 'custom_fire_flicker',
        'customColorWipeBtn': 'custom_color_wipe',
        'customStaticGlowBtn': 'custom_static_glow',
        'customColorEchoBtn': 'custom_color_echo',
        'customTimeWarpBtn': 'custom_time_warp',
        'customQuantumFlickerBtn': 'custom_quantum_flicker',
        'customRunningLightsBtn': 'custom_running_lights',
        'customFireworksBurstBtn': 'custom_fireworks_burst'
    };
    
    return animationMap[buttonId] || null;
}

async function ccpSendRequest(endpoint, data) {
    const API_BASE_URL = `http://${window.location.hostname}:8000`;
    try {
        console.log('Sending CCP request to:', endpoint, 'with data:', data);
        
        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(data)
        });
        
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const result = await res.json();
        console.log('CCP request successful:', result);
        return result;
        
    } catch (e) {
        console.error("CCP API Error:", e);
        throw e;
    }
}

function ccpGenerateRandomColors() {
    const hue1 = Math.floor(Math.random() * 360);
    const hue2 = (hue1 + 120 + Math.floor(Math.random() * 60) - 30) % 360;
    const hue3 = (hue2 + 120 + Math.floor(Math.random() * 60) - 30) % 360;

    return [
        `hsl(${hue1}, 100%, 60%)`,
        `hsl(${hue2}, 100%, 60%)`,
        `hsl(${hue3}, 100%, 60%)`
    ];
}

document.addEventListener('DOMContentLoaded', ccpInit);
