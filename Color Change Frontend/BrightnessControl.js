// BrightnessControl.js


const brightnessPanel = document.getElementById('brightnessPanel');
const brightnessSlider = document.getElementById('brightnessSlider');
const brightnessValue = document.getElementById('brightnessValue');
const applyBrightnessBtn = document.getElementById('applyBrightness');
const closeBrightnessBtn = document.querySelector('.brightness-header .close-btn');
const overlay = document.createElement('div');
overlay.className = 'overlay';
document.body.appendChild(overlay);

let currentAnimationType = null;
let currentBrightness = 0.25; 

document.querySelectorAll('.button-container button, .custom-animation-btn').forEach(button => {
    if (button.id !== 'offBtn' 
        && button.id !== 'off2Btn' 
        && button.id !== 'customFadeBtn' 
        && button.id !== 'customBlinkBtn' 
        && button.id !== 'customBreathingBtn' 
        && button.id !== 'customMeteorShowerBtn' 
        && button.id !== 'customPulseSyncBtn'
        && button.id !== 'customGlitchFlashBtn' 
        && button.id !== 'customHeartBeatBtn' 
        && button.id !== 'customTunnelEffectBtn' 
        && button.id !== 'customLaserShotBtn' 
        && button.id !== 'customSparklingStarsBtn' 
        && button.id !== 'customStrobeFlashBtn'
        && button.id !== 'customKnightRiderBtn' 
        && button.id !== 'customBounceBackBtn' 
        && button.id !== 'customRippleTouchBtn' 
        && button.id !== 'customFireFlickerBtn' 
        && button.id !== 'customColorWipeBtn' 
        && button.id !== 'customStaticGlowBtn'
        && button.id !== 'customColorEchoBtn' 
        && button.id !== 'customTimeWarpBtn' 
        && button.id !== 'customQuantumFlickerBtn' 
        && button.id !== 'customRunningLightsBtn2' 
        && button.id !== 'customFireworksBurstBtn' 
        && button.id !== 'customRunningLightsBtn'
        && button.id !== 'redBtn'
        && button.id !== 'blueBtn'
        && button.id !== 'greenBtn'
        && button.id !== 'orangeBtn'
        && button.id !== 'yellowBtn'
        && button.id !== 'purpleBtn'
        && button.id !== 'whiteBtn'
        && button.id !== 'lightOneBtn'
        && button.id !== 'WaveEffectBtn'
        && button.id !== 'RainbowFlowBtn'
        && button.id !== 'BlinkingPatternBtn'
        && button.id !== 'RunningLightsBtn'
        && button.id !== 'BreathingEffectBtn'
        && button.id !== 'MeteorShowerBtn'
        && button.id !== 'PulseSyncBtn'
        && button.id !== 'FireworksBurstBtn'
        && button.id !== 'MeteorShowerNewBtn'
        && button.id !== 'RandomColorsBtn'

    ) {
        button.addEventListener('click', function() {
            currentAnimationType = this.id.replace('Btn', '');
            
            showBrightnessPanel();
        });
    }
});

function showBrightnessPanel() {
    brightnessPanel.classList.remove('hidden');
    overlay.classList.add('active');
    
    brightnessSlider.value = currentBrightness * 100;
    brightnessValue.textContent = `${Math.round(currentBrightness * 100)}%`;
}

function hideBrightnessPanel() {
    brightnessPanel.classList.add('hidden');
    overlay.classList.remove('active');
}

brightnessSlider.addEventListener('input', function() {
    brightnessValue.textContent = `${this.value}%`;
});

applyBrightnessBtn.addEventListener('click', function() {
    currentBrightness = parseInt(brightnessSlider.value) / 100;
    hideBrightnessPanel();
    
    updateBrightness(currentBrightness);
    
    if (currentAnimationType) {
        const button = document.getElementById(`${currentAnimationType}Btn`);
        if (button) button.click();
    }
});

closeBrightnessBtn.addEventListener('click', hideBrightnessPanel);

overlay.addEventListener('click', hideBrightnessPanel);

brightnessPanel.addEventListener('click', function(e) {
    e.stopPropagation();
});

async function updateBrightness(brightness) {
    try {
        const response = await fetch(`${API_BASE_URL}/set_brightness`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ brightness: brightness })
        });
        
        const result = await response.json();
        if (result.status !== 'brightness_updated') {
            console.error('Failed to update brightness:', result.message);
        }
    } catch (error) {
        console.error('Error updating brightness:', error);
    }
}

