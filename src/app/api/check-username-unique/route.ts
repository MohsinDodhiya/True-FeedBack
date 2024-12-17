import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

// Zod schema for validating the username query parameter
const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  // Ensure database connection
  await dbConnect();

  try {
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const queryParam = searchParams.get("username");

    // Check if the query parameter is missing
    if (!queryParam) {
      return Response.json(
        { success: false, message: "Username query parameter is missing" },
        { status: 400 }
      );
    }

    // Validate the query parameter with Zod
    const validationResult = UsernameQuerySchema.safeParse({
      username: queryParam,
    });

    if (!validationResult.success) {
      // Extract and format validation errors
      const usernameErrors =
        validationResult.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message: usernameErrors.length
            ? usernameErrors.join(", ")
            : "Invalid username format",
        },
        { status: 400 }
      );
    }

    // Extract the validated username
    const { username } = validationResult.data;

    // Check if the username already exists and is verified
    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return Response.json(
        { success: false, message: "Username is already taken" },
        { status: 400 }
      );
    }

    // If the username is available
    return Response.json(
      { success: true, message: "Username is available" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking username:", error);
    return Response.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
