const express = require('express');
const mongoose = require('mongoose');
const app = express();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/secureapp';

app.use(express.json());

// MongoDB connection
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

app.get('/', (req, res) => {
  res.json({ message: "Secure Multi-Container Backend Running!" });
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
