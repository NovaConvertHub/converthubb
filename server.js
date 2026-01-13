const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { gTTS } = require("gtts.js"); // pure JS gTTS library

const app = express();
app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("ConvertHub backend is running 🚀");
});

// TEXT → AUDIO route (works on Vercel)
app.post("/text-to-audio", async (req, res) => {
  const text = req.body.text;
  if (!text) return res.status(400).send("No text provided.");

  try {
    const filename = `output_${Date.now()}.mp3`;
    const filepath = path.join("/tmp", filename); // serverless temp folder

    // create MP3
    const speech = new gTTS(text, "en");
    await speech.save(filepath);

    // send the file
    res.download(filepath, filename, () => {
      fs.unlinkSync(filepath); // delete after sending
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating audio.");
  }
});

// start server
app.listen(3000, () => console.log("Server running on port 3000"));
