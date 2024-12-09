"use client";
import { LogIn, LogOut, PanelLeftOpen, PanelRightOpen } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { stateBoolean } from "@/types";

export function Navbar() {
  const { data: session } = useSession();
  const image = session?.user?.image || "";
  const username = session?.user?.name;
  const [toggleOpen, setToggleOpen] = useState<stateBoolean>(false);
  const [logout, setLogout] = useState<stateBoolean>(false);

  const handleToggleClick = () => {
    setToggleOpen((prev) => !prev);
  };

  const handleLogout = () => {
    setLogout((prev) => !prev);
  };

  return (
    <div className="flex justify-center items-center">
      <div className="fixed top-0 z-[999] flex justify-between p-5 w-full max-w-6xl mx-auto mt-4 rounded-xl items-center bg-white/10 backdrop-blur-xl backdrop-brightness-75">
        <button onClick={handleToggleClick}>
          {!toggleOpen ? <PanelLeftOpen /> : <PanelRightOpen />}
        </button>
        <a href="/" className="font-bold text-xl font-superwoobly">
          GameHub
        </a>
        <div className="relative">
          {username ? (
            <div
              className="flex justify-center items-center gap-2"
              onClick={handleLogout}
            >
              <Image
                src={image}
                width={35}
                height={35}
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
              className="absolute flex gap-1 bg-white justify-center items-center backdrop-blur-xl backdrop-brightness-75 rounded-lg p-2 w-24 text-secondary font-semibold right-0 mt-2"
              onClick={() => signOut()}
            >
              Logout <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
      {toggleOpen && (
        <div className="fixed top-24 h-full shadow-lg max-w-6xl z-[999] w-full mx-auto">
          <div className="w-80 bg-white/10 backdrop-blur-xl backdrop-brightness-75 h-[87%] rounded-xl">
            <Sidebar setToggleOpen={setToggleOpen} />
          </div>
        </div>
      )}
    </div>
  );
}
