# LED-Color-Controller

## What This Project Does
This project lets you control an addressable LED strip from a web browser. It provides a web-based interface where you can pick colors, adjust brightness, and start animation effects. The backend runs on a Raspberry Pi and sends color data to the LED strip. The frontend runs in a browser and sends API requests to the backend. This solves the problem of manually programming LED effects by giving you a simple UI.

## How It Works 
- Frontend role: Static HTML/CSS/JavaScript files render the control panel and send HTTP requests to the backend API.
- Backend role: A FastAPI server accepts requests, translates them into LED commands, and drives the strip using the Pi5Neo library.
- How they communicate: The frontend makes HTTP requests to the backend on port 8000.
- Hardware interaction: The backend writes LED data to the SPI device at `/dev/spidev0.0` using the Pi5Neo library.

## Requirements
### Hardware
- Raspberry Pi 5 (or compatible model supported by Pi5Neo).
- Addressable LED strip compatible with Pi5Neo.
- Proper wiring for power, data, and ground.

### Software
- Raspberry Pi OS or another Linux distribution that exposes `/dev/spidev0.0`.
- Python 3.11+ and pip.
- Node.js and npm (for a simple static file server).
- Git.

## Setup From Scratch
Follow these steps on a fresh device.

1. Install system dependencies:

```bash
sudo apt update
sudo apt install -y git python3 python3-venv python3-pip nodejs npm
```

2. Enable SPI (required for `/dev/spidev0.0`):

```bash
sudo raspi-config
```

- Go to `Interface Options` -> `SPI` -> `Enable`.
- Reboot if prompted.

3. Clone the repository:

```bash
git clone https://github.com/coayo-x/LED-Color-Controller.git
cd LED-Color-Controller
```

4. Create and activate a Python virtual environment:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

5. Install Python dependencies:

```bash
pip install fastapi uvicorn pi5neo pydantic
```

6. Install a static file server for the frontend:

```bash
sudo npm install -g http-server
```

7. Verify file permissions for SPI (if needed):

```bash
ls -l /dev/spidev0.0
```

If you do not have access, add your user to the `spi` group and re-login:

```bash
sudo usermod -aG spi "$USER"
```

8. First-time configuration:
- Update `NUM_LEDS` in `Color Change Frontend/server.py` to match your strip length.
- Update the SPI device path if your hardware uses a different device.

## Running the Project
You need to run the backend and frontend separately.

### Start the backend
From the project root:

```bash
cd "Color Change Frontend"
uvicorn server:app --host 0.0.0.0 --port 8000
```

### Start the frontend
In a second terminal from the project root:

```bash
cd "Color Change Frontend"
http-server -c-1 -p 5501
```

### Default ports
- Backend API: `http://<raspberry-pi-ip>:8000`
- Frontend: `http://<raspberry-pi-ip>:5501`

Open the frontend URL in a browser to control the LEDs.

## Project Structure
```
LED-Color-Controller/
├── README.md
└── Color Change Frontend/
    ├── index.html              # Main UI
    ├── app.js                  # Main frontend logic and API calls
    ├── server.py               # FastAPI backend
    ├── main.py                 # Standalone LED demo script
    ├── turn_off_lights.py      # Utility script to turn off LEDs
    ├── Auto Run Setup/         # Systemd and auto-run notes
    ├── *.css                   # Styling for the UI
    └── *.js                    # Additional UI modules and effects
```

## Configuration
- LED count and SPI device:
  - `NUM_LEDS` and the SPI path are defined near the top of `Color Change Frontend/server.py`.
- Brightness:
  - `BRIGHTNESS_SCALE` in `Color Change Frontend/server.py` sets a global brightness multiplier.
- Frontend API base URL:
  - The frontend uses the current host and assumes the backend runs on port 8000.

## Common Issues & Fixes
- Port already in use:
  - Stop the process using the port or change the port in the startup command.
  - Example:

    ```bash
    uvicorn server:app --host 0.0.0.0 --port 8001
    ```

- Permission errors for `/dev/spidev0.0`:
  - Ensure SPI is enabled and your user is in the `spi` group.

- Hardware not detected or LEDs not lighting:
  - Confirm wiring and power supply.
  - Verify the correct SPI device path in `server.py`.
  - Make sure `NUM_LEDS` matches the physical strip length.

## Contributing
- Keep changes focused and small.
- Use clear commit messages.
- Open a pull request with a short description of the changes.
