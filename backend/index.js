const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

// Simple route to return current iframe URL
app.get('/iframe', (req, res) => {
  res.json({ url: "https://player.vimeo.com/video/1071067693?h=028f9aa29c&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" });
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
