"use client";
import { History, Home, LucideLayoutDashboard, Settings } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export function Sidebar() {
  const { data: session } = useSession();
  const username = session?.user.name;
  const image = session?.user.image || "";

  return (
    <div className="flex flex-col justify-between h-full pl-10 pt-10">
      <div className="flex flex-col justify-start space-y-8">
        <Link href="/" className="flex gap-3 text-2xl font-extrabold">
          <Home className="h-8 w-8" />
          <span>Home</span>
        </Link>
        <Link href="/" className="flex gap-3 text-2xl font-extrabold">
          <LucideLayoutDashboard className="h-8 w-8" />
          <span>Dashboard</span>
        </Link>
        <Link href="/" className="flex gap-3 text-2xl font-extrabold">
          <History className="h-8 w-8" />
          <span>History</span>
        </Link>
        <Link href="/" className="flex gap-3 text-2xl font-extrabold">
          <Settings className="h-8 w-8" />
          <span>Settings</span>
        </Link>
      </div>
      <div className="flex justify-start items-center gap-2 mb-8">
        {username && (
          <>
            <Image
              src={image}
              width={35}
              height={35}
              alt="user-profile"
              className="rounded-full"
            />
            <div className="text-xl font-extrabold">{username}</div>
          </>
        )}
      </div>
    </div>
  );
}
