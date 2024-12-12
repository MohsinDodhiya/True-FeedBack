import mongoose, { Document, Schema, Model } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessage: boolean;
  messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is Requried"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is Requried"],
    match: [/.+\@.+\..+/, "please use a valid email address"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is Requried"],
  },
  verifyCode: {
    type: String,
    required: [true, "verifyCode is Requried"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "verifyCodeExpiry is Requried"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessage: {
    type: Boolean,
    default: false,
  },
  messages: [MessageSchema],
});

const UserModel =
  (mongoose.models.User as Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;
