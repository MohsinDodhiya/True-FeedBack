import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import UserModel from "@/model/User.model";
import { User } from "next-auth";
import mongoose from "mongoose";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function DELETE(
  request: Request,
  { params }: { params: { messageid: string } }
) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const _user: User | undefined = session?.user;

    if (!session || !_user) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Not Authenticated",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const messageId = params.messageid;

    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Invalid message ID format",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const user = await UserModel.findById(_user.id);
    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User not found",
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const messageExists = user.messages.some(
      (msg) => msg._id.toString() === messageId
    );

    if (!messageExists) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Message not found",
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const updatedResult = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: new mongoose.Types.ObjectId(messageId) } } }
    );

    if (updatedResult.modifiedCount === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Failed to delete message",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Message deleted successfully",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error in DELETE handler:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error deleting message",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
