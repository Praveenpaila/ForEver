import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import app from "./app.js";
import connectDB from "./config/db.js";
import User from "./models/User.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const ensureAdmin = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) return;

  const existing = await User.findOne({ email });
  if (existing) {
    if (!existing.isAdmin) {
      existing.isAdmin = true;
      await existing.save();
    }
    return;
  }

  const hash = await bcrypt.hash(password, 10);
  await User.create({ email, password: hash, isAdmin: true, name: "Admin" });
};

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI).then(
      console.log("mongodb connected succesfully"),
    );
    await ensureAdmin();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
