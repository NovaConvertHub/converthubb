const { gTTS } = require("gtts.js");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  const { text } = req.body;
  if (!text) return res.status(400).send("No text provided");

  try {
    const speech = new gTTS(text, "en");
    const buffer = await speech.saveToBuffer();

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Disposition", "attachment; filename=output.mp3");
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating audio");
  }
};
