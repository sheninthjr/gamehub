"use client";
import {
  Gamepad,
  LogIn,
  LogOut,
  PanelLeftOpen,
  PanelRightOpen,
} from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { stateBoolean } from "@/types";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function Navbar() {
  const { data: session } = useSession();
  const image = session?.user?.image || "";
  const path = usePathname();
  const username = session?.user?.name;
  const [toggleOpen, setToggleOpen] = useState<stateBoolean>(false);
  const [logout, setLogout] = useState<stateBoolean>(false);
  const [currentPath, setCurrentPath] = useState("home");

  const handleToggleClick = () => {
    setToggleOpen((prev) => !prev);
  };

  useEffect(() => {
    if (path === "/") {
      setCurrentPath("home");
    } else if (path === "/dashboard") {
      setCurrentPath("dashboard");
    } else if (path === "/history") {
      setCurrentPath("history");
    } else if (path === "/settings") {
      setCurrentPath("settings");
    }
  }, [path]);

  const handleLogout = () => {
    setLogout((prev) => !prev);
  };

  return (
    <div className="flex justify-center items-center">
      <div className="fixed top-0 z-[999] flex  justify-between p-5 max-w-7xl mx-auto w-full mt-4 rounded-xl items-center">
        <button onClick={handleToggleClick} className="lg:hidden">
          {!toggleOpen ? <PanelLeftOpen /> : <PanelRightOpen />}
        </button>
        <a
          href="/"
          className="flex gap-2 items-center font-bold text-3xl font-montserrat"
        >
          <Gamepad size={40} /> GAMEHUB
        </a>
        <div className="hidden lg:flex gap-10 top-4 left-1/2 absolute transform -translate-x-1/2 font-semibold justify-center text-lg self-center mx-auto items-center">
          <Link
            href="/"
            className={`${currentPath === "home" && "text-2xl font-bold px-2 py-1 rounded-xl"} hover:scale-125`}
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className={`${currentPath === "dashboard" && "text-2xl font-bold px-2 py-1 rounded-xl"} hover:scale-125`}
          >
            Dashboard
          </Link>
          <Link
            href="/history"
            className={`${currentPath === "history" && "text-2xl font-bold px-2 py-1 rounded-xl"} hover:scale-125`}
          >
            History
          </Link>
          <Link
            href="/settings"
            className={`${currentPath === "settings" && "text-2xl font-bold px-2 py-1 rounded-xl"} hover:scale-125`}
          >
            Settings
          </Link>
        </div>
        <div className="relative">
          {username ? (
            <div
              className="flex justify-center items-center gap-2"
              onClick={handleLogout}
            >
              <Image
                src={image}
                width={38}
                height={38}
                alt="user-profile"
                className="rounded-full"
              />
            </div>
          ) : (
            <button onClick={() => signIn()}>
              <LogIn />
            </button>
          )}
          {logout && (
            <button
              className="absolute flex gap-1 bg-white border border-neutral-600 justify-center items-center backdrop-blur-xl backdrop-brightness-75 rounded-lg px-2 py-1 w-24 text-secondary font-semibold right-0 mt-2"
              onClick={() => signOut()}
            >
              Logout <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
      {toggleOpen && (
        <div className="fixed top-24 h-full shadow-lg max-w-7xl z-[999] w-full mx-auto">
          <div className="w-80 bg-white/60 backdrop-blur-xl backdrop-brightness-75 h-[87%] rounded-xl">
            <Sidebar setToggleOpen={setToggleOpen} />
          </div>
        </div>
      )}
    </div>
  );
}
