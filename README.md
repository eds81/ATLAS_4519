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

<br></br>

---

## Code and Physical Interaction How To:
> **NOTE FOR WINDOWS USERS!!:** This project's automated print server (`server.js`) is currently optimized for macOS, utilizing the native Mac `lp` print command and Mac-specific file paths for headless Google Chrome. If you are running the print server on a Windows PC, you will need to update the Chrome execution path in `server.js` to point to your `chrome.exe` and swap the `lp` terminal command for a Windows-compatible printing utility.
---

## System Architecture

Before configuring, it helps to understand how the data flows between components:

1. **The MCU** reads five potentiometers and a push-button, broadcasting the data over WebSockets (Port 81).
2. **The Web Frontend (index.html)** renders a real-time canvas animation. It dynamically updates whenever you turn the physical dials. When the button event is caught, it automates a visual bake flash and extracts a unique random name for your aurora.
3. **The Node.js Server (server.js)** catches the payload, builds an HTML document, converts it to a PDF via headless Google Chrome, and pushes it ditly to the system printer queue.

---

## Hardware Connections

### 1. MCU to Computer
* Connect your TinyCore / ESP32 board to your computer using a data-capable USB cable. This powers the micro-controller and allows you to view status logs on your IDE's Serial Monitor.
> **NOTE!!:** BOTH YOUR COMPUTER AND MCU MUST BE CONNECTED TO THE SAME WIFI

### 2. Button & Sensor Setups
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

> **Note!!:** All Pin numbers can change and be adapted, just make sure the type of pin is cort for the type of component.

---

## Prerequisite Software Installations

Before getting started, make sure your computer has the following software installed:
* **For Hardware Flashing:** Either the [Arduino IDE](https://www.arduino.cc/en/software) or VS Code with the [PlatformIO](https://platformio.org/) extension.
* **For the Print Server:** [Node.js](https://nodejs.org/) (which includes `npm`).
* **For Rendering eipes:** [Google Chrome](https://www.google.com/chrome/) installed in your default applications folder.

---

## Software Configuration & IP Setup

> **NOTE!!:** This project communicates over a local network using a static IP address. Before running the system, you must find your computer's local IP address and replace the placeholder `YOURSTATICIP` across all project files.

### Step 1: Configure and Flash the MCU Firmware
1. Clone the repository to your computer using your terminal or Git tool:
   ```bash
   git clone ...
2. Open your code in your preferred environment (**Arduino IDE** or **PlatformIO**).
3. Install the `WebSockets` (by Markus Sattler) and `ArduinoJson` libraries via your environment's library manager.
4. Update your network credentials in the source code and change the WebSocket broadcast targets if applicable.
   
   `const char* ssid = "Your Username";
    const char* password = "Your Password";`
   
6. Upload the code to your board. Open your Serial Monitor (**115200 baud**) to verify it connects to your Wi-Fi and prints its own local IP address.

### Step 2: Configure the Web Frontend (`index.html`)
* **Update the print fetch URL:** `fetch("http://YOURSTATICIP:3000/print"...)`
* **Update the WebSocket target:** `new WebSocket("ws://YOURSTATICIP:81")`
* **Update the backup print fetch:** `fetch("http://YOURSTATICIP:3000/print"...)`

### Step 3: Launch the Frontend Web Server
> **NOTE!!:** **DON'T** simply double-click the `index.html` file to open it in your browser (`file:///...`), modern web browsers will block the security requests needed to connect to your hardware and print server. You **must** run it through a local web server.

Choose one of the following methods to host the web frontend locally or your own personal:
* **Option A (Terminal - Node.js):** Run `npx serve` in your project folder root.
* **Option B (Terminal - Python):** Run `python -m http.server 8000` in your project folder root.

### Step 4: Spin Up the Node.js Server
1. Ensure your machine's local printer queue recognizes your desktop printer precisely as named in the code (e.g., EPSON_ET_3850_Series).
2. Navigate to your server directory in your terminal and install the back-end dependencies:
   ```bash
   npm install express body-parser cors
3. Launch the local print server:
   ```bash
   node server.js

---

## Running the Exhibit

Once all configurations are complete, launch the live interactive display using this exact sequence:

1. **Power the Hardware:** Plug your wireless microcontroller (TinyCore/ESP32) into a power source. Ensure it boots up and connects successfully to the shared Wi-Fi network.
2. **Start the Print Server:** Open your terminal, navigate to your server folder, and run:
   ```bash
   node server.js
3. **Launch the Frontend Display:** Fire up your local web server using your chosen method (such as `npx serve`) and open the local web address in Google Chrome. 

Test the system by moving your hardware sliders and watching the aurora become your own. Hit your physical push-button to get your recipe and generate your take home printout!

---

##Links:

<p><a href="https://atlas-4519.vercel.app/">Aurora Al A Carte</a></p>
<p><a href="https://www.instructables.com/Peppers-Ghost-Illusion-in-a-Small-Space/">Peppers Ghost Small Space</a></p>
<p><a href="https://www.scienceworld.ca/resource/peppers-ghost-hologram-illusion/">Peppers Ghost Science Project</a></p>
<p><a href="https://docs.google.com/presentation/d/1IVS8u9LEby1BBaF4dlIeH4xni_GJICE1rAH3H3x6T68/edit?slide=id.g39e4b442bf3_0_0#slide=id.g39e4b442bf3_0_0">Process Documentation</a></p>
<p><a href="https://tinycore.cc/">TinyCore</a></p>
<p><a href="https://www.sparkfun.com/slide-pot-medium-10k-linear-taper.html?gad_source=1&gad_campaignid=21251727806&gbraid=0AAAAADsj4EQcW8lhwWSqooDGzgtK21JT5">Slider Potentiometers</a></p>
