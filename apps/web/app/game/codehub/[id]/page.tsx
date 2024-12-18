"use client";
import React from "react";
import Link from "next/link";
import { Problems } from "@/data";
import { useParams } from "next/navigation";

export default function Id() {
  const { id } = useParams();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 max-w-7xl pt-32 mx-auto lg:grid-cols-3 gap-6 p-6">
      {Problems.map((problem) => (
        <Link
          key={problem.problemId}
          href={`/game/codehub/${id}/${problem.problemId}`}
          className="block hover:scale-105 transition-transform duration-300 ease-in-out"
        >
          <div className="bg-[#151516] border h-56 border-[#151516] rounded-xl shadow-md hover:shadow-lg p-6 flex flex-col">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-white mb-2">
                {problem.title}
              </h2>
              <p className="text-lg text-gray-500">Problem ID: {problem.problemId}</p>
            </div>
            <div className="mt-auto flex flex-wrap gap-2">
              {problem.language.map((lang) => (
                <span
                  key={lang}
                  className="bg-[#151516] border border-slate-700 text-gray-200 text-lg font-montserrat font-medium px-2.5 py-0.5 rounded-full"
                >
                  {lang.toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
