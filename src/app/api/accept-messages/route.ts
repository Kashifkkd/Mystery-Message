import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";

export async function POST(request: Request) {
  await dbConnect;

  const session = await getServerSession(authOptions);

  const user: User = session?.user as User;

  if (!session || !session?.user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticaated",
      },
      { status: 401 }
    );
  }

  const userId = user._id;
  const { acceptMessages } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessages },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "Failed to update user status to accept message",
        },
        { status: 401 }
      );
    }

    return Response.json(
      {
        success: false,
        message: "Message acceptance status updated successfully",
        updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update user status to accept messages", error);
    return Response.json(
      {
        success: false,
        message: "Failed to update user status to accept messages",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  await dbConnect;

  const session = await getServerSession(authOptions);

  const user: User = session?.user as User;

  if (!session || !session?.user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticaated",
      },
      { status: 401 }
    );
  }

  const userId = user._id;

  try {
    const foundUser = await UserModel.findById(userId);

    if (!foundUser) {
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
        isAcceptingMessages: foundUser.isAcceptingMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed in getting message acceptance status", error);
    return Response.json(
      {
        success: false,
        message: "Failed in getting message acceptance status",
      },
      { status: 500 }
    );
  }
}
