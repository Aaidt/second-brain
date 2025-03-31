import mongoose, { Schema, model } from "mongoose"
import dotenv from "dotenv";
dotenv.config();

mongoose.connect(process.env.conn ?);

const UserSchema = new Schema({
    username: { type: String, unique: true },
    password: String,
})

export const UserModel = model("Users", UserSchema);

const ContentSchema = new Schema({
    title: String,
    link: String,
    // tags: [{ type: mongoose.Types.ObjectId }]
    type: String,
    userId: [{ type: mongoose.Types.ObjectId, ref: "Users", required: true }]
})

export const ContentModel = model("Contents", ContentSchema);

