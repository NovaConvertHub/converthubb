async function convertTextToAudio() {
  const text = document.getElementById("text-input").value;
  if (!text) {
    alert("Please enter some text!");
    return;
  }

  try {
    // Call the new Vercel serverless function
    const response = await fetch("/api/text-to-audio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });

    if (!response.ok) {
      alert("Something went wrong!");
      return;
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const downloadLink = document.getElementById("audio-download");
    downloadLink.href = url;
    downloadLink.style.display = "inline"; // show download link

  } catch (err) {
    console.error(err);
    alert("Error connecting to server.");
  }
}
