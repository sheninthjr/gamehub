"use client";
import { PanelLeftOpen, PanelRightClose, PanelRightOpen } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

export function Navbar() {
  const { data: session } = useSession();
  const image = session?.user?.image || "";
  const username = session?.user?.name;
  const [toggleOpen, setToggleOpen] = useState(false);

  const handleToggleClick = () => {
    setToggleOpen((prev) => !prev);
  };

  return (
    <div className="flex justify-center items-center">
      <div className="fixed top-0 z-[999] flex justify-between p-5 w-full max-w-6xl mx-auto mt-4 rounded-xl items-center bg-white/10 backdrop-blur-xl backdrop-brightness-75">
        <button onClick={handleToggleClick}>
          {!toggleOpen && <PanelLeftOpen />}
          {toggleOpen && <PanelRightOpen />}
        </button>
        <a href="/" className="font-bold text-xl font-superwoobly">
          GameHub
        </a>
        {username && (
          <div className="flex justify-center items-center gap-2">
            <Image
              src={image}
              width={35}
              height={35}
              alt="user-profile"
              className="rounded-full"
            />
            <div className="font-semibold text-lg font-montserrat">
              {username}
            </div>
          </div>
        )}
      </div>
      {toggleOpen && (
        <div className="fixed top-24 h-full shadow-lg max-w-6xl z-[999] w-full mx-auto">
          <div className="w-1/4 bg-white/10 backdrop-blur-xl backdrop-brightness-75 h-[89%] rounded-xl">
          <div className="text-lg font-semibold">Hello</div>
          </div>
        </div>
      )}
    </div>
  );
}
