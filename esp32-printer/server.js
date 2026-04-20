const express = require("express");
const bodyParser = require("body-parser");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.options("/print", cors());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// serve the QR code image so the print HTML can load it
app.get("/qr", (req, res) => {
  res.sendFile(path.join(__dirname, "../Atlas_4519QRCode.png"));
});

app.post("/print", (req, res) => {
  const data = req.body;
  console.log("📩 PRINT REQUEST RECEIVED:", data);

  const altLabel =
    data.altitude > 75 ? "High (~280km)" :
    data.altitude > 45 ? "Mid (~150km)" :
    "Low (~100km)";

  const solarLabels = ['','Quiet','Mild','Active','Strong!','EXTREME!'];

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    background: #fff;
    color: #1a1a1a;
    font-family: Georgia, serif;
    width: 100%;
    max-width: 180mm;
    margin: 0 auto;
    padding: 15mm;
    text-align: center;
  }
  h1 {
    font-size: 22pt;
    letter-spacing: 0.1em;
    color: #007744;
    margin-bottom: 3mm;
  }
  .subtitle {
    font-size: 12pt;
    color: #666;
    letter-spacing: 0.08em;
    margin-bottom: 6mm;
  }
  .aurora-name {
    font-size: 16pt;
    color: #995500;
    font-style: italic;
    margin: 5mm 0;
    line-height: 1.4;
  }
  .row {
    display: flex;
    justify-content: space-between;
    font-size: 13pt;
    margin: 2.5mm 0;
    color: #1a1a1a;
  }
  .label { color: #666; }
  .qr {
    margin-top: 8mm;
    width: 45mm;
    height: 45mm;
    object-fit: contain;
  }
  .qr-label {
    font-size: 10pt;
    color: #999;
    margin-top: 3mm;
    letter-spacing: 0.06em;
  }
</style>
</head>
<body>
  <h1>AURORA A LA CARTE</h1>
  <div class="subtitle">Build your own northern lights</div>
  <hr class="divider">
  <div class="aurora-name">${data.auroraName || 'Your Aurora'}</div>
  <hr class="divider">
  <div class="row"><span class="label">Oxygen</span><span>${data.oxygen}%</span></div>
  <div class="row"><span class="label">Nitrogen</span><span>${data.nitrogen}%</span></div>
  <div class="row"><span class="label">Solar Storm</span><span>${solarLabels[data.solar] || data.solar}</span></div>
  <div class="row"><span class="label">Latitude</span><span>${data.latitude}°N</span></div>
  <div class="row"><span class="label">Altitude</span><span>${altLabel}</span></div>
  <hr class="divider">
  <img class="qr" src="http://172.20.10.6:3000/qr" />
  <div class="qr-label">ATLAS 4519</div>
</body>
</html>`;

  const tmpFile = path.join("/tmp", `aurora_${Date.now()}.html`);
  fs.writeFileSync(tmpFile, html);

  // Use Chrome headless to render HTML to PDF, then print
  exec(
    `/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --headless --disable-gpu --print-to-pdf="${tmpFile}.pdf" --no-margins "file://${tmpFile}"`,
    (err) => {
      if (err) {
        console.error("❌ Chrome render error:", err);
        return res.status(500).send({ error: err.message });
      }

      exec(`lp -d EPSON_ET_3850_Series "${tmpFile}.pdf"`, (err2, stdout, stderr) => {
        fs.unlinkSync(tmpFile);
        try { fs.unlinkSync(`${tmpFile}.pdf`); } catch(_) {}

        if (err2) {
          console.error("❌ PRINT ERROR:", stderr);
          return res.status(500).send({ error: stderr });
        }

        console.log("🖨️ PRINT SUCCESS");
        res.send({ status: "printed" });
      });
    }
  );
});

app.listen(3000, () => {
  console.log("🖨️ Print server running on http://172.20.10.6:3000");
});