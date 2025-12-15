// customanimation.js

// بيانات التلميحات لأزرار الأنيميشن
const animationTooltipData = {
    'lightOneBtn': { 
        title: 'Fade Colors', 
        animationType: 'fade_colors',
        startFunction: 'startFadeAnimation'
    },
    'WaveEffectBtn': { 
        title: 'Wave Effect', 
        animationType: 'wave_effect',
        startFunction: 'startWaveAnimation'
    },
    'RainbowFlowBtn': { 
        title: 'Rainbow Flow', 
        animationType: 'rainbow_flow',
        startFunction: 'startRainbowAnimation'
    },
    'BlinkingPatternBtn': { 
        title: 'Blinking Pattern', 
        animationType: 'blinking_pattern',
        startFunction: 'startBlinkingPattern'
    },
    'RunningLightsBtn': { 
        title: 'Running Lights', 
        animationType: 'running_lights',
        startFunction: 'startRunningLights'
    },
    'BreathingEffectBtn': { 
        title: 'Breathing Effect', 
        animationType: 'breathing_effect',
        startFunction: 'startBreathingAnimation'
    },
    'MeteorShowerBtn': { 
        title: 'Snakes Chasing', 
        animationType: 'meteor_shower',
        startFunction: 'startSnakesChasing'
    },
    'RandomColorsBtn': { 
        title: 'Random Colors', 
        animationType: 'random_colors',
        startFunction: 'startRandomColors'
    },
    'PulseSyncBtn': { 
        title: 'Pulse Sync', 
        animationType: 'pulse_sync',
        startFunction: 'startPulseSyncAnimation'
    },
    'FireworksBurstBtn': { 
        title: 'Fireworks Burst', 
        animationType: 'fireworks_burst',
        startFunction: 'startFireworksBurst'
    },
    'MeteorShowerNewBtn': { 
        title: 'Meteor Shower', 
        animationType: 'single_snake',
        startFunction: 'startSingleSnake'
    }
};

let currentAnimationTooltip = null;
let currentAnimationBrightness = 25;
let currentAnimationButton = null;
let isApplyingBrightness = false;

let animationHoverTimeout = null; 
let animationTooltipShownByClick = false; 
let isAnimationHovering = false;

function loadAnimationBrightnessFromStorage() {
    const savedBrightness = localStorage.getItem('animationBrightness');
    if (savedBrightness !== null) {
        currentAnimationBrightness = parseInt(savedBrightness);
        console.log('Loaded animation brightness from storage:', currentAnimationBrightness);
    }
}

function saveAnimationBrightnessToStorage(brightness) {
    localStorage.setItem('animationBrightness', brightness.toString());
    console.log('Saved animation brightness to storage:', brightness);
}

function initAnimationTooltips() {
    console.log('Initializing animation tooltips...');
    
    loadAnimationBrightnessFromStorage();
    
    createAnimationTooltip();
    
    setupAnimationEventListeners();
}

function createAnimationTooltip() {
    if (document.getElementById('customAnimationTooltip')) {
        currentAnimationTooltip = document.getElementById('customAnimationTooltip');
        return;
    }

    const tooltip = document.createElement('div');
    tooltip.id = 'customAnimationTooltip';
    tooltip.className = 'custom-animation-tooltip';
    tooltip.innerHTML = `
        <div class="tooltip-content">
            <h3 id="customAnimationTooltipTitle">Animation Name</h3>
            <div class="animation-description" id="animationDescription">Animation description</div>
            <div class="animation-brightness-controls">
                <div class="animation-brightness-title">Set Animation Brightness:</div>
                <div class="animation-brightness-display">
                    <span class="animation-brightness-value" id="animationBrightnessValue">${currentAnimationBrightness}%</span>
                </div>
                <div class="animation-brightness-slider-container">
                    <input type="range" min="1" max="100" value="${currentAnimationBrightness}" class="animation-brightness-slider" id="animationBrightnessSlider">
                </div>
                <button class="animation-apply-btn" id="applyAnimationBrightness">Apply Brightness</button>
            </div>
        </div>
        <div class="tooltip-arrow"></div>
    `;
    document.body.appendChild(tooltip);
    currentAnimationTooltip = tooltip;
    console.log('Animation tooltip created with brightness:', currentAnimationBrightness);
}

function setupAnimationEventListeners() {
    console.log('Setting up animation event listeners...');
    
    document.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'applyAnimationBrightness') {
            console.log('Apply animation button clicked');
            handleApplyAnimationBrightness(e);
        }
    });

    document.addEventListener('wheel', function(e) {
        const slider = document.getElementById('animationBrightnessSlider');
        if (slider && (e.target === slider || slider.contains(e.target))) {
            e.preventDefault();
            console.log('Wheel event on animation slider');
            handleWheelAnimationBrightness(e, slider);
        }
    });

    document.addEventListener('input', function(e) {
        if (e.target && e.target.id === 'animationBrightnessSlider') {
            console.log('Animation slider input changed');
            handleAnimationSliderChange(e);
        }
    });

    const animationButtons = document.querySelectorAll('.button-container button.custom-animation-btn');
    console.log('Found animation buttons:', animationButtons.length);
    
    animationButtons.forEach(button => {
        const buttonId = button.id;
        console.log('Processing animation button:', buttonId);

        if (animationTooltipData[buttonId]) {
            console.log('Adding listeners to animation button:', buttonId);
            
            button.classList.add('button-hover-delay');
            
            button.addEventListener('mouseenter', (e) => {
                console.log('Mouse enter on animation button:', buttonId);
                isAnimationHovering = true;
                
                if (currentAnimationTooltip && currentAnimationTooltip.classList.contains('show') && !animationTooltipShownByClick) {
                    return;
                }
                
                if (animationHoverTimeout) {
                    clearTimeout(animationHoverTimeout);
                    animationHoverTimeout = null;
                }
                
                animationHoverTimeout = setTimeout(() => {
                    console.log('3-second hover delay completed - showing animation tooltip');
                    if (isAnimationHovering) { 
                        animationTooltipShownByClick = false;
                        showAnimationTooltip(e.target, buttonId);
                    }
                    animationHoverTimeout = null;
                }, 3000); 
            });

            button.addEventListener('mouseleave', (e) => {
                console.log('Mouse leave from animation button:', buttonId);
                isAnimationHovering = false;
                
                if (animationHoverTimeout) {
                    clearTimeout(animationHoverTimeout);
                    animationHoverTimeout = null;
                    console.log('Animation hover timeout cleared');
                }
                
                if (currentAnimationTooltip && currentAnimationTooltip.classList.contains('show') && !animationTooltipShownByClick) {
                    const relatedTarget = e.relatedTarget;
                    if (!relatedTarget || (currentAnimationTooltip && !currentAnimationTooltip.contains(relatedTarget))) {
                        hideAnimationTooltip();
                    }
                }
            });

            button.addEventListener('click', (e) => {
                console.log('Animation button clicked - showing tooltip immediately');
                e.stopPropagation();
                
                if (animationHoverTimeout) {
                    clearTimeout(animationHoverTimeout);
                    animationHoverTimeout = null;
                }
                
                animationTooltipShownByClick = true;
                
                showAnimationTooltip(e.target, buttonId);
            });
        }
    });

    if (currentAnimationTooltip) {
        currentAnimationTooltip.addEventListener('mouseenter', () => {
            console.log('Mouse enter on animation tooltip');
            currentAnimationTooltip.classList.add('show');
        });

        currentAnimationTooltip.addEventListener('mouseleave', () => {
            console.log('Mouse leave from animation tooltip');
            if (!animationTooltipShownByClick) {
                hideAnimationTooltip();
            }
        });
    }
    
    document.addEventListener('click', function(e) {
        if (currentAnimationTooltip && currentAnimationTooltip.classList.contains('show')) {
            if (!currentAnimationTooltip.contains(e.target) && 
                !e.target.closest('.button-container button.custom-animation-btn')) {
                hideAnimationTooltip();
                animationTooltipShownByClick = false;
            }
        }
    });
    
    window.addEventListener('blur', function() {
        if (animationHoverTimeout) {
            clearTimeout(animationHoverTimeout);
            animationHoverTimeout = null;
        }
        isAnimationHovering = false;
    });
    
    window.addEventListener('beforeunload', function() {
        if (animationHoverTimeout) {
            clearTimeout(animationHoverTimeout);
            animationHoverTimeout = null;
        }
    });
}

function showAnimationTooltip(button, buttonId) {
    console.log('Showing animation tooltip for:', buttonId);
    
    if (!currentAnimationTooltip) {
        console.error('No animation tooltip found');
        return;
    }

    const rect = button.getBoundingClientRect();
    const tooltipTitle = document.getElementById('customAnimationTooltipTitle');
    const animationDescription = document.getElementById('animationDescription');
    const brightnessSlider = document.getElementById('animationBrightnessSlider');
    const brightnessValue = document.getElementById('animationBrightnessValue');
    const applyBtn = document.getElementById('applyAnimationBrightness');

    if (!tooltipTitle || !animationDescription || !brightnessSlider || !brightnessValue || !applyBtn) {
        console.error('Animation tooltip elements not found');
        return;
    }

    const buttonData = animationTooltipData[buttonId];
    if (!buttonData) {
        console.error('No data for animation button:', buttonId);
        return;
    }

    tooltipTitle.textContent = buttonData.title || '';
    animationDescription.textContent = buttonData.description || '';

    const [color1, color2, color3] = generateRandomAnimationColors();
    currentAnimationTooltip.style.setProperty('--random-color-1', color1);
    currentAnimationTooltip.style.setProperty('--random-color-2', color2);
    currentAnimationTooltip.style.setProperty('--random-color-3', color3);

    currentAnimationTooltip.setAttribute('data-animation-type', buttonData.animationType);
    currentAnimationTooltip.setAttribute('data-start-function', buttonData.startFunction);
    currentAnimationTooltip.setAttribute('data-current-brightness', currentAnimationBrightness);
    currentAnimationButton = buttonId; 

    brightnessSlider.value = currentAnimationBrightness;
    brightnessValue.textContent = `${currentAnimationBrightness}%`;

    const isCurrentlyRunning = button.classList.contains('active');
    applyBtn.textContent = isCurrentlyRunning ? 
        'Update Brightness' : 
        'Apply Brightness & Start';

    currentAnimationTooltip.style.left = `${rect.left + (rect.width / 2)}px`;
    currentAnimationTooltip.style.top = `${rect.top - 10}px`;
    currentAnimationTooltip.style.transform = 'translate(-50%, -100%)';

    currentAnimationTooltip.classList.add('show');
    console.log('Animation tooltip shown with brightness:', currentAnimationBrightness);
}

function hideAnimationTooltip() {
    if (currentAnimationTooltip) {
        currentAnimationTooltip.classList.remove('show');
        animationTooltipShownByClick = false;
        console.log('Animation tooltip hidden');
    }
}

function handleWheelAnimationBrightness(e, slider) {
    const step = 5;
    let newValue = parseInt(slider.value) + (e.deltaY > 0 ? -step : step);
    newValue = Math.max(1, Math.min(100, newValue));
    
    slider.value = newValue;
    currentAnimationBrightness = newValue;
    
    updateAnimationBrightnessDisplay(newValue);
    
    if (currentAnimationTooltip) {
        currentAnimationTooltip.setAttribute('data-current-brightness', newValue);
    }
    
    saveAnimationBrightnessToStorage(newValue);
    
    console.log('Animation brightness changed to:', newValue + '%');
}

function handleAnimationSliderChange(e) {
    const newValue = parseInt(e.target.value);
    currentAnimationBrightness = newValue;
    updateAnimationBrightnessDisplay(newValue);
    
    if (currentAnimationTooltip) {
        currentAnimationTooltip.setAttribute('data-current-brightness', newValue);
    }
    
    saveAnimationBrightnessToStorage(newValue);
    
    console.log('Animation brightness slider changed to:', newValue + '%');
}

function updateAnimationBrightnessDisplay(value) {
    const brightnessValue = document.getElementById('animationBrightnessValue');
    if (brightnessValue) {
        brightnessValue.textContent = `${value}%`;
    }
}

async function handleApplyAnimationBrightness(e) {
    if (isApplyingBrightness) return;
    
    const applyBtn = e.target;
    const tooltip = document.getElementById('customAnimationTooltip');
    
    if (!tooltip) {
        console.error('Animation tooltip not found');
        return;
    }

    const animationType = tooltip.getAttribute('data-animation-type');
    const startFunction = tooltip.getAttribute('data-start-function');
    const brightness = tooltip.getAttribute('data-current-brightness');
    
    if (!animationType || !startFunction) {
        console.error('No animation type or function selected');
        return;
    }

    console.log('Applying animation brightness:', brightness + '% to animation:', animationType);

    isApplyingBrightness = true;
    applyBtn.disabled = true;
    const originalText = applyBtn.textContent;
    applyBtn.textContent = 'Applying...';

    try {
        await updateAnimationBrightness(parseInt(brightness));
        
        const button = document.getElementById(currentAnimationButton);
        const isCurrentlyRunning = button && button.classList.contains('active');
        
        if (!isCurrentlyRunning) {
            console.log('Starting animation since it was not running');
            await startAnimationFunction(startFunction);
        } else {
            console.log('Animation is already running, only brightness updated');
        }
        
        hideAnimationTooltip();
        
        applyBtn.textContent = 'Done!';
        applyBtn.classList.add('done');
        
    } catch (error) {
        console.error('Error applying animation brightness:', error);
        applyBtn.textContent = 'Error!';
    }

    setTimeout(() => {
        applyBtn.disabled = false;
        applyBtn.textContent = originalText;
        applyBtn.classList.remove('done');
        isApplyingBrightness = false;
        console.log('Animation apply button reset');
    }, 1000);
}

async function updateAnimationBrightness(brightness) {
    console.log(`Updating animation brightness to: ${brightness}%`);
    
    const brightnessResult = await sendAnimationRequest("/set_brightness", { 
        brightness: brightness / 100 
    });
    
    if (brightnessResult.status === "brightness_updated") {
        console.log("Animation brightness updated successfully");
        return true;
    } else {
        console.error("Failed to update animation brightness:", brightnessResult);
        throw new Error("Failed to update brightness");
    }
}

async function startAnimationFunction(functionName) {
    console.log("Starting animation function:", functionName);
    
    if (typeof window[functionName] === 'function') {
        await window[functionName]();
        console.log("Animation function executed successfully");
    } else {
        console.error("Animation function not found:", functionName);
        throw new Error(`Animation function ${functionName} not found`);
    }
}

function generateRandomAnimationColors() {
    const hue1 = Math.floor(Math.random() * 360);
    const hue2 = (hue1 + 120 + Math.floor(Math.random() * 60) - 30) % 360;
    const hue3 = (hue2 + 120 + Math.floor(Math.random() * 60) - 30) % 360;

    return [
        `hsl(${hue1}, 100%, 60%)`,
        `hsl(${hue2}, 100%, 60%)`,
        `hsl(${hue3}, 100%, 60%)`
    ];
}

async function sendAnimationRequest(endpoint, data) {
    const API_BASE_URL = `http://${window.location.hostname}:8000`;
    try {
        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(data),
            mode: 'cors'
        });
        
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        return await res.json();
    } catch (e) {
        console.error("Animation API Error:", e);
        return { 
            status: "error", 
            message: e.message,
            endpoint: endpoint
        };
    }
}

document.addEventListener('DOMContentLoaded', initAnimationTooltips);
