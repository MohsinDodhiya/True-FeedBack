import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import UserModel from "@/model/User.model";
import { User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function DELETE(
  request: Request,
  { params }: { params: { messageid: string } }
) {
  const messageId = params.messageid;

  await dbConnect();
  const session = await getServerSession(authOptions);
  const _user: User = session?.user;

  if (!session || !_user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 }
    );
  }

  try {
    // Validate messageId format
    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return Response.json(
        {
          success: false,
          message: "Invalid message ID format",
        },
        { status: 400 }
      );
    }

    // Find the user and check if the message exists
    const user = await UserModel.findById(_user._id);
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const messageExists = user.messages.some(
      (msg) => msg._id.toString() === messageId
    );

    if (!messageExists) {
      return Response.json(
        {
          success: false,
          message: "Message not found",
        },
        { status: 404 }
      );
    }

    // Perform the update
    const updatedResult = await UserModel.updateOne(
      { _id: _user._id },
      { $pull: { messages: { _id: new mongoose.Types.ObjectId(messageId) } } }
    );

    if (updatedResult.modifiedCount === 0) {
      return Response.json(
        {
          success: false,
          message: "Failed to delete message",
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting message:", error);
    return Response.json(
      {
        success: false,
        message: "Error deleting message",
      },
      { status: 500 }
    );
  }
}
