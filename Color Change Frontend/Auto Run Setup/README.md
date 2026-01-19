# Auto-Run Setup

## What This Auto-Run Setup Is For
This setup makes the project start automatically after boot. It starts:
- Backend service (FastAPI with Uvicorn).
- Frontend service (static files served by http-server).

## Before You Start
- OS: Raspberry Pi OS or another Linux distribution with systemd.
- Permissions: You need sudo access.
- Required packages:
  - Python 3, pip, venv
  - Node.js and npm
  - http-server (global npm package)

Install packages if needed:

```bash
sudo apt update
sudo apt install -y python3 python3-venv python3-pip nodejs npm
sudo npm install -g http-server
```

## Folder Structure
This file is located at:

```
LED-Color-Controller/Color Change Frontend/Auto Run Setup/README.md
```

The services use these working directories:
- Backend: the project root (example: `/home/student/pixel_project`)
- Frontend: the frontend folder (example: `/home/student/pixel_project/LED-Color-Controller/Color Change Frontend`)

## Step-by-Step Auto-Run Setup
You will create two systemd service files.

### 1. Backend auto-start (systemd)
Create the service file:

```bash
sudo nano /etc/systemd/system/led-backend.service
```

Paste and update the paths and user:

```ini
[Unit]
Description=LED Color Controller Backend (uvicorn)
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

### 2. Frontend auto-start (systemd)
Create the service file:

```bash
sudo nano /etc/systemd/system/led-frontend.service
```

Paste and update the paths and user:

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

## Enabling & Testing
Reload systemd and enable both services:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now led-backend.service
sudo systemctl enable --now led-frontend.service
```

Check status:

```bash
sudo systemctl status led-backend.service
sudo systemctl status led-frontend.service
```

Reboot and verify they start automatically:

```bash
sudo reboot
```

After reboot:

```bash
sudo systemctl status led-backend.service
sudo systemctl status led-frontend.service
```

## Common Problems & Fixes
- Service not starting:
  - Check logs:

    ```bash
    sudo journalctl -u led-backend.service -f
    sudo journalctl -u led-frontend.service -f
    ```

- Port already in use:
  - Change the port in the service file and reload systemd.
  - Backend default: 8000, frontend default: 5501.

- Permission denied:
  - Make sure the `User=` field is correct and has access to the folders.
  - Confirm the virtual environment path exists for the backend service.

- Wrong working directory:
  - Double-check `WorkingDirectory=` paths match your install location.

## How to Stop or Disable Auto-Run
- Temporarily stop:

```bash
sudo systemctl stop led-backend.service
sudo systemctl stop led-frontend.service
```

- Permanently disable:

```bash
sudo systemctl disable led-backend.service
sudo systemctl disable led-frontend.service
```

## Notes & Warnings
- Do not change the service names unless you also update all systemctl commands.
- Do not remove `WorkingDirectory=` or `ExecStart=` values; services will fail to start.
- Use absolute paths in systemd files.
- If your project path has spaces, escape them as shown in the frontend `WorkingDirectory=`.
