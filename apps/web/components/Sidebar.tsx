"use client";
import { History, Home, LucideLayoutDashboard, Settings } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export function Sidebar({
  setToggleOpen,
}: {
  setToggleOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { data: session } = useSession();
  const username = session?.user.name;
  const image = session?.user.image || "";

  const onClickLink = () => {
    setToggleOpen(false);
  };

  return (
    <div className="flex flex-col justify-between h-full pl-10 pt-10">
      <div className="flex flex-col justify-start space-y-8">
        <Link
          href="/"
          className="flex gap-3 text-2xl font-extrabold"
          onClick={onClickLink}
        >
          <Home className="h-8 w-8" />
          <span>Home</span>
        </Link>
        <Link
          href="/dashboard"
          className="flex gap-3 text-2xl font-extrabold"
          onClick={onClickLink}
        >
          <LucideLayoutDashboard className="h-8 w-8" />
          <span>Dashboard</span>
        </Link>
        <Link
          href="/history"
          className="flex gap-3 text-2xl font-extrabold"
          onClick={onClickLink}
        >
          <History className="h-8 w-8" />
          <span>History</span>
        </Link>
        <Link
          href="/settings"
          className="flex gap-3 text-2xl font-extrabold"
          onClick={onClickLink}
        >
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
