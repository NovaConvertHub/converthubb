const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("ConvertHub backend is running 🚀");
});

// TEXT → AUDIO route
app.post("/text-to-audio", (req, res) => {
  const text = req.body.text;
  if (!text) return res.status(400).send("No text provided.");

  const filename = `output_${Date.now()}.mp3`;
  const cmd = `gtts-cli "${text.replace(/"/g, '\\"')}" --output ${filename}`;

  exec(cmd, (err) => {
    if (err) return res.status(500).send("Error generating audio.");

    // send the MP3 to the frontend
    res.download(filename, () => {
      fs.unlinkSync(filename); // delete file after sending
    });
  });
});

// start server
app.listen(3000, () => console.log("Server running on port 3000"));
