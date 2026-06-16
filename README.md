# <h1><a href="https://atlas-4519.vercel.app/">Aurora Al A Carte</a></h1>

<h3>Learn about the different factors that create the aurora borealis by building your own through the Aurora A La Carte interactive exhibit! Change colors, visibility, and intensity of the aurora to build your own custom display.</h3>
<h5>Code written by Elizabeth Saunders and Erin Fels in collaboration with Claude AI.<br>
Group project members: Kira Warren, Ayesha Rawal, Erin Fels, Sylvia Robles, Elizabeth Saunders, and Julia McKeag.<br>
ReadMe written by Erin Fels in collaboration with Gemini.</h5>

---

## Recipe
<h5><code>Step 1:</code> Create your own peppers ghost trick using similar tips and tricks we used!</h5>
<h5><code>Step 2:</code> Now use the supplied and created Aurora A La Carte Website that gives you the exact functionality you need</h5>
<h5><code>Step 3:</code> Utilize a wireless microcontroller that can connect with your computer through wifi and use the supplied code on github (e.g. ESP32 or TinyCore). Create the physical interaction with your chosen buttons or sliders (Our choosen ones are linked below). For setup, follow our steps below. </h5>
<h5><code>Step 4:</code> Finally move your elements and ingredients around and create your own.</h5>

---

## System Architecture

Before configuring, it helps to understand how the data flows between components:

1. **The MCU** reads five potentiometers and a push-button, broadcasting the data over WebSockets (Port 81).
2. **The Web Frontend (index.html)** renders a real-time canvas animation. It dynamically updates whenever you turn the physical dials. When the button event is caught, it automates a visual bake flash and extracts a unique random name for your aurora.
3. **The Node.js Server (server.js)** catches the payload, builds an HTML document, converts it to a PDF via headless Google Chrome, and pushes it directly to the system printer queue.

---

## Hardware Connections

### 1. MCU to Computer
* Connect your TinyCore / ESP32 board to your computer using a data-capable USB cable. This powers the micro-controller and allows you to view status logs on your IDE's Serial Monitor.

### 2. Button & Sensor Pinout
Wire your hardware components to the TinyCore board according to the map below:

| Component | Component Pin | MCU Pin | Notes |
| :--- | :--- | :--- | :--- |
| **Push-Button** | Pin 1 | **Pin 8** | Uses internal INPUT_PULLUP |
| | Pin 2 | **GND** | Drives pin LOW when pressed |
| **Oxygen Pot** | Center Wiper | **A0** | Outer pins to 3.3V and GND |
| **Nitrogen Pot**| Center Wiper | **A1** | Outer pins to 3.3V and GND |
| **Solar Pot** | Center Wiper | **A2** | Outer pins to 3.3V and GND |
| **Latitude Pot**| Center Wiper | **A3** | Outer pins to 3.3V and GND |
| **Altitude Pot**| Center Wiper | **A4** | Outer pins to 3.3V and GND |

All Pin numbers can change and be adapted just make sure the type of pin is correct for the type of compenent.

---

## Software Configuration & IP Setup

> **CRITICAL STEP:** This project communicates over a local network using a static IP address. Before running the system, you must find your computer's local IP address and replace the placeholder `YOURSTATICIP` across all project files.

### Step 1: Configure and Flash the MCU Firmware
1. Open your code in the Arduino IDE or PlatformIO.
2. Install the `WebSockets` (by Markus Sattler) and `ArduinoJson` libraries.
3. Update your network credentials and change the WebSocket broadcast targets if applicable.
4. Upload the code. Open your Serial Monitor (**115200 baud**) to verify it connects and prints its own local IP address.

### Step 2: Configure the Web Frontend (`index.html`)
Open `index.html` and use a global find-and-replace to change `YOURSTATICIP` to your machine's current local IP address:

* **Update the print fetch URL:** `fetch("http://YOURSTATICIP:3000/print"...)`
* **Update the WebSocket target:** `new WebSocket("ws://YOURSTATICIP:81")`
* **Update the backup print fetch:** `fetch("http://YOURSTATICIP:3000/print"...)`

### Step 3: Spin Up the Node.js Server
1. Navigate to your server directory in your terminal and install dependencies:
   ```bash
   npm install express body-parser cors
