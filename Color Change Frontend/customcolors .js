// customcolors.js

const colorTooltipData = {
    'redBtn': { title: 'Red Color', color: '#ff0000' },
    'blueBtn': { title: 'Blue Color', color: '#0000ff' },
    'greenBtn': { title: 'Green Color', color: '#00ff00' },
    'orangeBtn': { title: 'Orange Color', color: '#FFA500' },
    'yellowBtn': { title: 'Yellow Color', color: '#FFFF00' },
    'purpleBtn': { title: 'Purple Color', color: '#A020F0' },
    'whiteBtn': { title: 'White Color', color: '#FFFFFF' }
};

let currentTooltip = null;
let currentBrightness = 25;
let currentColorButton = null;
let hoverTimeout = null;
let tooltipShownByClick = false;
let isHovering = false; 

function loadBrightnessFromStorage() {
    const savedBrightness = localStorage.getItem('ledBrightness');
    if (savedBrightness !== null) {
        currentBrightness = parseInt(savedBrightness);
        console.log('Loaded brightness from storage:', currentBrightness);
    }
}

function saveBrightnessToStorage(brightness) {
    localStorage.setItem('ledBrightness', brightness.toString());
    console.log('Saved brightness to storage:', brightness);
}

function initColorTooltips() {
    console.log('Initializing color tooltips...');
    
    loadBrightnessFromStorage();
    
    createTooltip();
    
    setupEventListeners();
}

function createTooltip() {
    if (document.getElementById('customColorTooltip')) {
        currentTooltip = document.getElementById('customColorTooltip');
        return;
    }

    const tooltip = document.createElement('div');
    tooltip.id = 'customColorTooltip';
    tooltip.className = 'custom-color-tooltip';
    tooltip.innerHTML = `
        <div class="tooltip-content">
            <h3 id="customColorTooltipTitle">Color Name</h3>
            <div class="brightness-controls">
                <div class="brightness-title">Set Brightness:</div>
                <div class="brightness-display">
                    <span class="brightness-value" id="brightnessValue">${currentBrightness}%</span>
                </div>
                <div class="brightness-slider-container">
                    <input type="range" min="1" max="100" value="${currentBrightness}" class="brightness-slider" id="brightnessSlider">
                </div>
                <button class="apply-btn" id="applyBrightness">Apply</button>
            </div>
        </div>
        <div class="tooltip-arrow"></div>
    `;
    document.body.appendChild(tooltip);
    currentTooltip = tooltip;
    console.log('Tooltip created with brightness:', currentBrightness);
}

function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    document.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'applyBrightness') {
            console.log('Apply button clicked');
            handleApplyBrightness(e);
        }
    });

    document.addEventListener('wheel', function(e) {
        const slider = document.getElementById('brightnessSlider');
        if (slider && (e.target === slider || slider.contains(e.target))) {
            e.preventDefault();
            console.log('Wheel event on slider');
            handleWheelBrightness(e, slider);
        }
    });

    document.addEventListener('input', function(e) {
        if (e.target && e.target.id === 'brightnessSlider') {
            console.log('Slider input changed');
            handleSliderChange(e);
        }
    });

    const colorButtons = document.querySelectorAll('.button-container button');
    console.log('Found color buttons:', colorButtons.length);
    
    colorButtons.forEach(button => {
        const buttonId = button.id;
        console.log('Processing button:', buttonId);

        if (colorTooltipData[buttonId]) {
            console.log('Adding listeners to button:', buttonId);
            
            button.classList.add('button-hover-delay');
            
            button.addEventListener('mouseenter', (e) => {
                console.log('Mouse enter on button:', buttonId);
                isHovering = true;
                
                if (currentTooltip && currentTooltip.classList.contains('show') && !tooltipShownByClick) {
                    return;
                }
                
                if (hoverTimeout) {
                    clearTimeout(hoverTimeout);
                    hoverTimeout = null;
                }
                
                hoverTimeout = setTimeout(() => {
                    console.log('3-second hover delay completed - showing tooltip');
                    if (isHovering) { 
                        tooltipShownByClick = false;
                        showTooltip(e.target, buttonId);
                    }
                    hoverTimeout = null;
                }, 3000);
            });

            button.addEventListener('mouseleave', (e) => {
                console.log('Mouse leave from button:', buttonId);
                isHovering = false;
                
                if (hoverTimeout) {
                    clearTimeout(hoverTimeout);
                    hoverTimeout = null;
                    console.log('Hover timeout cleared');
                }
                
                if (currentTooltip && currentTooltip.classList.contains('show') && !tooltipShownByClick) {
                    const relatedTarget = e.relatedTarget;
                    if (!relatedTarget || (currentTooltip && !currentTooltip.contains(relatedTarget))) {
                        hideTooltip();
                    }
                }
            });

            button.addEventListener('click', (e) => {
                console.log('Color button clicked - showing tooltip immediately');
                e.stopPropagation();
                
                if (hoverTimeout) {
                    clearTimeout(hoverTimeout);
                    hoverTimeout = null;
                }
                
                tooltipShownByClick = true;
                
                showTooltip(e.target, buttonId);
                
                handleColorButtonClick(e.target, buttonId);
            });
        }
    });

    if (currentTooltip) {
        currentTooltip.addEventListener('mouseenter', () => {
            console.log('Mouse enter on tooltip');
            currentTooltip.classList.add('show');
        });

        currentTooltip.addEventListener('mouseleave', () => {
            console.log('Mouse leave from tooltip');
            if (!tooltipShownByClick) {
                hideTooltip();
            }
        });
    }
    
    document.addEventListener('click', function(e) {
        if (currentTooltip && currentTooltip.classList.contains('show')) {
            if (!currentTooltip.contains(e.target) && 
                !e.target.closest('.button-container button[id]')) {
                hideTooltip();
                tooltipShownByClick = false;
            }
        }
    });
    
    window.addEventListener('blur', function() {
        if (hoverTimeout) {
            clearTimeout(hoverTimeout);
            hoverTimeout = null;
        }
        isHovering = false;
    });
    
    window.addEventListener('beforeunload', function() {
        if (hoverTimeout) {
            clearTimeout(hoverTimeout);
            hoverTimeout = null;
        }
    });
}

function showTooltip(button, buttonId) {
    console.log('Showing tooltip for:', buttonId);
    
    if (!currentTooltip) {
        console.error('No tooltip found');
        return;
    }

    const rect = button.getBoundingClientRect();
    const tooltipTitle = document.getElementById('customColorTooltipTitle');
    const brightnessSlider = document.getElementById('brightnessSlider');
    const brightnessValue = document.getElementById('brightnessValue');

    if (!tooltipTitle || !brightnessSlider || !brightnessValue) {
        console.error('Tooltip elements not found');
        return;
    }

    const buttonData = colorTooltipData[buttonId];
    if (!buttonData) {
        console.error('No data for button:', buttonId);
        return;
    }

    tooltipTitle.textContent = buttonData.title || '';

    const [color1, color2, color3] = generateRandomColors();
    currentTooltip.style.setProperty('--random-color-1', color1);
    currentTooltip.style.setProperty('--random-color-2', color2);
    currentTooltip.style.setProperty('--random-color-3', color3);

    currentTooltip.setAttribute('data-current-color', buttonData.color);
    currentTooltip.setAttribute('data-current-brightness', currentBrightness);
    currentColorButton = buttonId; 

    brightnessSlider.value = currentBrightness;
    brightnessValue.textContent = `${currentBrightness}%`;

    currentTooltip.style.left = `${rect.left + (rect.width / 2)}px`;
    currentTooltip.style.top = `${rect.top - 10}px`;
    currentTooltip.style.transform = 'translate(-50%, -100%)';

    currentTooltip.classList.add('show');
    console.log('Tooltip shown with brightness:', currentBrightness);
}

function hideTooltip() {
    if (currentTooltip) {
        currentTooltip.classList.remove('show');
        tooltipShownByClick = false; 
        console.log('Tooltip hidden');
    }
}

function handleWheelBrightness(e, slider) {
    const step = 5;
    let newValue = parseInt(slider.value) + (e.deltaY > 0 ? -step : step);
    newValue = Math.max(1, Math.min(100, newValue));
    
    slider.value = newValue;
    currentBrightness = newValue;
    
    updateBrightnessDisplay(newValue);
    
    if (currentTooltip) {
        currentTooltip.setAttribute('data-current-brightness', newValue);
    }
    
    saveBrightnessToStorage(newValue);
    
    console.log('Brightness changed to:', newValue + '%');
}

function handleSliderChange(e) {
    const newValue = parseInt(e.target.value);
    currentBrightness = newValue;
    updateBrightnessDisplay(newValue);
    
    if (currentTooltip) {
        currentTooltip.setAttribute('data-current-brightness', newValue);
    }
    
    saveBrightnessToStorage(newValue);
    
    console.log('Brightness slider changed to:', newValue + '%');
}

function updateBrightnessDisplay(value) {
    const brightnessValue = document.getElementById('brightnessValue');
    if (brightnessValue) {
        brightnessValue.textContent = `${value}%`;
    }
}

async function handleApplyBrightness(e) {
    const applyBtn = e.target;
    const tooltip = document.getElementById('customColorTooltip');
    
    if (!tooltip) {
        console.error('Tooltip not found');
        return;
    }

    const currentColor = tooltip.getAttribute('data-current-color');
    const brightness = tooltip.getAttribute('data-current-brightness');
    
    if (!currentColor) {
        console.error('No color selected');
        return;
    }

    console.log('Applying brightness:', brightness + '% to color:', currentColor);

    applyBtn.disabled = true;

    try {
        await applyBrightnessAndColor(currentColor, parseInt(brightness));
        
        hideTooltip();
    } catch (error) {
        console.error('Error applying brightness:', error);
        changeColor(currentColor);
    }

    setTimeout(() => {
        applyBtn.disabled = false;
        console.log('Apply button re-enabled');
    }, 1000);
}

async function handleColorButtonClick(button, buttonId) {
    console.log('Handling color button click:', buttonId);
    
    const buttonData = colorTooltipData[buttonId];
    if (!buttonData) {
        console.error('No data for button:', buttonId);
        return;
    }

    if (currentBrightness > 0) {
        console.log(`Applying ${currentBrightness}% brightness to color: ${buttonData.color}`);
        await applyBrightnessAndColor(buttonData.color, currentBrightness);
    } else {
        console.log('No brightness set, using default behavior');
        changeColor(buttonData.color);
    }
}

function generateRandomColors() {
    const hue1 = Math.floor(Math.random() * 360);
    const hue2 = (hue1 + 120 + Math.floor(Math.random() * 60) - 30) % 360;
    const hue3 = (hue2 + 120 + Math.floor(Math.random() * 60) - 30) % 360;

    return [
        `hsl(${hue1}, 100%, 60%)`,
        `hsl(${hue2}, 100%, 60%)`,
        `hsl(${hue3}, 100%, 60%)`
    ];
}

async function applyBrightnessAndColor(color, brightness) {
    console.log(`Applying ${brightness}% brightness to color: ${color}`);
    
    try {
        const brightnessResult = await sendRequest("/set_brightness", { 
            brightness: brightness / 100 
        });
        
        if (brightnessResult.status === "brightness_updated") {
            console.log("Brightness updated successfully");
            await changeColor(color);
        } else {
            console.error("Failed to update brightness:", brightnessResult);
            await changeColor(color);
        }
    } catch (error) {
        console.error("API Error:", error);
        await changeColor(color);
        throw error;
    }
}

async function sendRequest(endpoint, data) {
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
        console.error("API Error:", e);
        return { 
            status: "error", 
            message: e.message,
            endpoint: endpoint
        };
    }
}

document.addEventListener('DOMContentLoaded', initColorTooltips);
