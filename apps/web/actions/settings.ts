"use server";

import prisma from "db/client";

export async function ProfileUpdate(
  userId: string,
  bio: string,
  favouriteGame: string,
  github: string,
  phone: string,
) {
  try {
    const response = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        bio,
        favouriteGame,
        github,
        phone,
      },
    });
    return response;
  } catch (error) {
    console.error(error);
  }
}

export async function ProfileDetails(userId: string) {
  try {
    const response = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });
    return response;
  } catch (error) {
    console.error(error);
  }
}
