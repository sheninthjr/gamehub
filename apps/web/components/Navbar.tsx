"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";

export function Navbar() {
  const { data: session } = useSession();
  const image = session?.user?.image || "";
  const username = session?.user?.name;
  return (
    <div className="sticky flex justify-between w-full p-4 bg-secondary">
      <div className="font-bold text-xl font-superwoobly">GameHub</div>
      <div className="flex justify-center items-center gap-2">
        <Image
          src={image}
          width={35}
          height={35}
          alt="user-profile"
          className="rounded-full"
        />
        <div className="font-semibold text-lg font-montserrat">{username}</div>
      </div>
    </div>
  );
}
