const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const validateRouter = require("./routes/validate");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use("/validate", validateRouter);


// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Voucher API running on port ${PORT}`);
});
