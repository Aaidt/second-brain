import mongoose, { Schema, model } from "mongoose"
import dotenv from "dotenv";
dotenv.config();

const mongoURL = process.env.CONN as string
if (!mongoURL) {
    throw new Error("MongoDB connection string is missing in the env file.")
}

mongoose.connect(mongoURL);


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
    userId: { type: mongoose.Types.ObjectId, ref: "Users", required: true }
})

export const ContentModel = model("Contents", ContentSchema);

const LinkSchema = new Schema({
    hash: String,
    userId: { type: mongoose.Types.ObjectId, ref: "Users", required: true }
})

export const LinkModel = model("Links", LinkSchema);

const thoughtSchema = new Schema({
    title: { type: String, required: true },
    thoughts: { type: String, required: true },
    userId: { type: mongoose.Types.ObjectId, ref: "Users", required: true }
});

export const ThoughtModel = model("thought", thoughtSchema);

const documentSchema = new Schema({
    filePath: { type: String, required: true },
    fileName: { type: String, required: true },
    fileType: { type: String, required: true },
    size: { type: Number, required: true },
    userId: { type: mongoose.Types.ObjectId, ref:"Users", required: true } 
}, { timestamps: true })

export const DocumentModel = model("Documents", documentSchema);