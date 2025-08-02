// models/BlacklistedToken.js
import mongoose from "mongoose";

const blacklistedTokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
  blacklistedAt: { type: Date, default: Date.now }
});

export default mongoose.model("BlacklistedToken", blacklistedTokenSchema);
