---
# Auto-Run Setup

## What This Auto-Run Setup Is For

This setup configures the project to start automatically after the Raspberry Pi boots.

It runs two separate services:

* **Backend**: FastAPI server (Uvicorn) that controls LED logic and hardware interaction.
* **Frontend**: Static web interface served using `http-server`.

Both services run independently and can be controlled separately.

---

## Before You Start

* **OS**: Raspberry Pi OS or any Linux distribution using `systemd`
* **Permissions**: sudo access is required
* **Required software**:

  * Python 3, pip, venv
  * Node.js and npm
  * `http-server` (global npm package)

Install required packages if they are not already installed:

```bash
sudo apt update
sudo apt install -y python3 python3-venv python3-pip nodejs npm
sudo npm install -g http-server
```

---

## Folder Structure

This README is located at:

```
LED-Color-Controller/
└── Color Change Frontend/
    └── Auto Run Setup/
        └── README.md
```

Service working directories:

* **Backend**: Project root
  Example:

  ```
  /home/student/pixel_project
  ```
* **Frontend**: Frontend folder
  Example:

  ```
  /home/student/pixel_project/LED-Color-Controller/Color Change Frontend
  ```

---

## Backend Service (Auto-Run)

### What the Backend Does

* Runs a FastAPI server using Uvicorn
* Listens for API requests from the frontend
* Sends commands to LEDs / hardware
* Default port: `8000`

---

### Backend Auto-Start Setup

Create the backend systemd service:

```bash
sudo nano /etc/systemd/system/led-backend.service
```

Paste the following and update **User** and **paths**:

```ini
[Unit]
Description=LED Color Controller Backend (Uvicorn)
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=student
WorkingDirectory=/home/student/pixel_project
Environment=PYTHONIOENCODING=utf-8
ExecStart=/home/student/pixel_project/.venv/bin/python -m uvicorn server:app --host 0.0.0.0 --port 8000
Restart=on-failure
RestartSec=5
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

---

### Backend Control Commands

Start backend:

```bash
sudo systemctl start led-backend.service
```

Restart backend (recommended after code changes):

```bash
sudo systemctl restart led-backend.service
```

Stop backend:

```bash
sudo systemctl stop led-backend.service
```

Check backend status:

```bash
sudo systemctl status led-backend.service
```

View backend logs:

```bash
sudo journalctl -u led-backend.service -f
```

---

## Frontend Service (Auto-Run)

### What the Frontend Does

* Serves the web UI (HTML/CSS/JS)
* Allows the user to control LEDs from a browser
* Communicates with the backend API
* Default port: `5501`

---

### Frontend Auto-Start Setup

Create the frontend systemd service:

```bash
sudo nano /etc/systemd/system/led-frontend.service
```

Paste the following and update **User** and **paths**:

```ini
[Unit]
Description=LED Color Controller Frontend (http-server)
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=student
WorkingDirectory=/home/student/pixel_project/LED-Color-Controller/Color\ Change\ Frontend
ExecStart=/usr/local/bin/http-server -c-1 -p 5501
Restart=on-failure
RestartSec=5
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

---

### Frontend Control Commands

Start frontend:

```bash
sudo systemctl start led-frontend.service
```

Restart frontend:

```bash
sudo systemctl restart led-frontend.service
```

Stop frontend:

```bash
sudo systemctl stop led-frontend.service
```

Check frontend status:

```bash
sudo systemctl status led-frontend.service
```

View frontend logs:

```bash
sudo journalctl -u led-frontend.service -f
```

---

## Enable Auto-Run (First Time Only)

Reload systemd and enable both services:

```bash
sudo systemctl daemon-reload
sudo systemctl enable led-backend.service
sudo systemctl enable led-frontend.service
```

Start both services immediately:

```bash
sudo systemctl start led-backend.service
sudo systemctl start led-frontend.service
```

Reboot to verify auto-run:

```bash
sudo reboot
```

---

## Common Problems & Fixes

### Service not starting

Check logs:

```bash
sudo journalctl -u led-backend.service -f
sudo journalctl -u led-frontend.service -f
```

### Port already in use

* Backend default: `8000`
* Frontend default: `5501`
* Change the port in the corresponding service file
* Reload systemd after changes:

```bash
sudo systemctl daemon-reload
sudo systemctl restart led-backend.service
sudo systemctl restart led-frontend.service
```

### Permission denied

* Verify `User=` is correct
* Ensure the user has access to the project folders
* Confirm backend virtual environment path exists

### Wrong working directory

* Ensure `WorkingDirectory=` paths are absolute and correct
* Restart the affected service

---

## Disable Auto-Run

Temporarily stop services:

```bash
sudo systemctl stop led-backend.service
sudo systemctl stop led-frontend.service
```

Disable auto-run permanently:

```bash
sudo systemctl disable led-backend.service
sudo systemctl disable led-frontend.service
```

---

## Notes & Warnings

* Do not rename service files unless you update all related commands.
* Always use absolute paths in systemd service files.
* Restart services after changing code or configuration.
* Backend and frontend are independent; one can run without the other.

---
