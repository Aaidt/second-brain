// import mongoose, { model, Schema } from "mongoose";
// import { conn } from "../config"


// mongoose.connect(conn);

// const UserSchema = new Schema({
//     username: { type: String, unique: true },
//     password: String
// });

// export const UserModel = model("users", UserSchema);

// const ContentSchema = new Schema({
//     title: String,
//     link: String,
//     tags: [{ types: mongoose.Types.ObjectId}],
//     type: String,
//     userId: { type: mongoose.Types.ObjectId, ref: 'users', required: true}
// })


// const LinkSchema = new Schema({
//     hash: String,
//     userId: { type: mongoose.Types.ObjectId, ref: 'users', required: true, unique: true}
// })

// export const ContentModel = model("content", ContentSchema);
// export const LinkModel = model("links", LinkSchema);

import { Pool } from "pg";
// import { PASSWORD } from "../config"
import dotenv from "dotenv";
dotenv.config();

export const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    // @ts-ignore
    port: process.env.DB_PORT,
    ssl: {
    rejectUnauthorized: false
  } 
});
