"use client";
import { ProfileDetails, ProfileUpdate } from "@/actions/settings";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Settings() {
  const { data: session } = useSession();
  const userId = session?.user.id;

  const [formData, setFormData] = useState<{
    bio: string;
    favouriteGame: string;
    github: string;
    phone: string;
  }>({
    bio: "",
    favouriteGame: "",
    github: "",
    phone: "",
  });

  useEffect(() => {
    if (userId) {
      async function main() {
        const res = await ProfileDetails(userId as string);
        if (!res?.id) {
          return;
        }
        setFormData({
          bio: res.bio || "",
          favouriteGame: res.favouriteGame || "",
          github: res.github || "",
          phone: res.phone || "",
        });
      }
      main();
    }
  }, [userId]);

  const handleUpdate = async () => {
    const res = await ProfileUpdate(
      userId!,
      formData.bio,
      formData.favouriteGame,
      formData.github,
      formData.phone,
    );
  };

  return (
    <div className="max-w-7xl flex mx-auto justify-start items-center">
      <div className="flex flex-col pt-32 md:pt-0 md:flex-row justify-evenly w-full h-screen ">
        <div className="flex flex-col justify-center items-center gap-4 md:w-1/4">
          <Image
            src={session?.user.image!}
            width={140}
            height={140}
            alt="User Profile"
            className="rounded-xl"
          />
          <div>
            <h1 className="font-bold text-3xl">{session?.user.name}</h1>
          </div>
        </div>
        <div className="pt-6 m-4 md:m-0 pb-4 md:pb-0 md:pt-32 flex flex-col items-center space-y-8 md:w-1/2">
          <div className="flex gap-4 flex-col w-full">
            <h1 className="font-extrabold text-2xl self-center md:self-start">
              Bio
            </h1>
            <textarea
              placeholder="Type something about yourself..."
              value={formData.bio}
              rows={5}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              className="bg-neutral-700 rounded-xl px-2 py-2 flex justify-center items-center outline-none"
            />
          </div>
          <div className="gap-4 flex flex-col w-full">
            <h1 className="font-extrabold text-2xl self-center md:self-start">
              Email
            </h1>
            <div>
              <p className="bg-neutral-700 p-2 rounded-lg text-neutral-400">
                {session?.user.email}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-4 w-full">
            <h1 className="font-extrabold text-2xl self-center md:self-start">
              Favourite Game
            </h1>
            <div>
              <input
                type="text"
                value={formData.favouriteGame}
                onChange={(e) =>
                  setFormData({ ...formData, favouriteGame: e.target.value })
                }
                placeholder="What's your favourite game?"
                className="bg-neutral-700 outline-none rounded-xl px-2 py-2 w-full flex justify-center items-center"
              />
            </div>
          </div>
          <div className="flex flex-col gap-4 w-full">
            <h1 className="font-extrabold text-2xl self-center md:self-start">
              Github
            </h1>
            <div>
              <input
                type="text"
                value={formData.github}
                onChange={(e) =>
                  setFormData({ ...formData, github: e.target.value })
                }
                placeholder="Your Github Link"
                className="bg-neutral-700 outline-none rounded-xl px-2 py-2 w-full flex justify-center items-center"
              />
            </div>
          </div>
          <div className="flex flex-col gap-4 w-full">
            <h1 className="font-extrabold text-2xl self-center md:self-start">
              Phone Number
            </h1>
            <div>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="Your number..."
                className="bg-neutral-700 outline-none rounded-xl px-2 py-2 w-full flex justify-center items-center"
              />
            </div>
          </div>
          {userId && (
            <button
              className="px-2 py-1 bg-purple-800 rounded-xl font-medium text-lg"
              onClick={handleUpdate}
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
