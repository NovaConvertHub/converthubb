const express = require("express");
const cors = require("cors");
const { gTTS } = require("gtts.js"); // pure JS gTTS
const stream = require("stream");

const app = express();
app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("ConvertHub backend is running 🚀");
});

// TEXT → AUDIO route (serverless-friendly)
app.post("/text-to-audio", async (req, res) => {
  const text = req.body.text;
  if (!text) return res.status(400).send("No text provided.");

  try {
    const speech = new gTTS(text, "en");

    // generate MP3 in memory
    const buffer = await speech.saveToBuffer();
    const readStream = new stream.PassThrough();
    readStream.end(buffer);

    res.set('Content-disposition', 'attachment; filename=output.mp3');
    res.set('Content-Type', 'audio/mpeg');

    readStream.pipe(res); // send MP3 to browser

  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating audio.");
  }
});

// start server
app.listen(3000, () => console.log("Server running on port 3000"));
