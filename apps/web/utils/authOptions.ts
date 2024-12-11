import prisma from "db/client";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async session({ session }) {
      try {
        if (
          session?.user?.email &&
          session?.user?.name &&
          session?.user?.image
        ) {
          const user = await prisma.user.findUnique({
            where: {
              email: session?.user?.email,
            },
          });
          if (user) {
            session.user.id = user.id;
          } else {
            const newUser = await prisma.user.create({
              data: {
                email: session?.user?.email,
                name: session?.user?.name,
                image: session?.user?.image,
              },
            });
            session.user.id = newUser.id;
          }
        }
      } catch (e) {
        console.error("Error while storing the user in the database", e);
      }
      return session;
    },
  },
};
