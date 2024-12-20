import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import UserModel from "@/model/User.model";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);

  const user: User = session?.user;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 }
    );
  }
  const userId = new mongoose.Types.ObjectId(user._id);
  try {
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } }, // Removed quotes around field name
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);
    console.log(user);

    if (!user || user.length === 0) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: user[0].messages, // Corrected "messages" spelling
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Issue at get messages", error);
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 500 }
    );
  }
}
