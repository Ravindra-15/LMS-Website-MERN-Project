// Admin helper for managing instructor (admin) accounts from the terminal.
//
//   npm run admin -- list                              show all admin/instructor accounts
//   npm run admin -- reset <email> <newPassword>       set a new password for any user
//   npm run admin -- make-instructor <email>           give a user admin (instructor) access
//
// Uses the same database as the server (MONGO_LOCAL_URI, or MONGO_URI if that is empty).
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";

dotenv.config();

const [command, email, newPassword] = process.argv.slice(2);
const dbUri = process.env.MONGO_LOCAL_URI || process.env.MONGO_URI;

const usage = () => {
  console.log(`
Usage:
  npm run admin -- list
  npm run admin -- reset <email> <newPassword>
  npm run admin -- make-instructor <email>
`);
};

const findUser = async (mail) => {
  const user = await User.findOne({ email: mail?.trim().toLowerCase() }) ||
    await User.findOne({ email: mail?.trim() });
  if (!user) {
    console.log(`No user found with email: ${mail}`);
    process.exitCode = 1;
  }
  return user;
};

const run = async () => {
  if (!command) return usage();
  if (!dbUri) {
    console.log("No MONGO_LOCAL_URI or MONGO_URI found in server/.env");
    process.exitCode = 1;
    return;
  }

  await mongoose.connect(dbUri);

  if (command === "list") {
    const admins = await User.find({ role: "instructor" }).select("name email createdAt");
    if (admins.length === 0) {
      console.log("No admin/instructor accounts found. Use make-instructor <email> to create one.");
    } else {
      console.log(`Admin / instructor accounts (${admins.length}):`);
      admins.forEach((u) => console.log(`  - ${u.email}  (${u.name})`));
    }
  } else if (command === "reset") {
    if (!email || !newPassword) return usage();
    if (newPassword.length < 6) {
      console.log("Password must be at least 6 characters.");
      process.exitCode = 1;
      return;
    }
    const user = await findUser(email);
    if (user) {
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();
      console.log(`Password updated for ${user.email} (role: ${user.role}).`);
    }
  } else if (command === "make-instructor") {
    if (!email) return usage();
    const user = await findUser(email);
    if (user) {
      user.role = "instructor";
      await user.save();
      console.log(`${user.email} is now an instructor (admin). Log out and log in again.`);
    }
  } else {
    usage();
  }
};

run()
  .catch((error) => {
    console.error("Error:", error.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
