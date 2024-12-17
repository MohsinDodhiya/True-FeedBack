import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const conn: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (conn.isConnected) {
    console.log("Already connected to MongoDB");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {});
    console.log("DB Obect : ", db);
    conn.isConnected = db.connections[0].readyState;
    console.log("connected to MongoDB");
  } catch (error) {
    console.log("Db Connection Failed", Error);

    process.exit();
  }
}

export default dbConnect;
