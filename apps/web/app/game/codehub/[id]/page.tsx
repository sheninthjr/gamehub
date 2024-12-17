'use client'
import React from 'react';
import Link from 'next/link';
import { Problems } from '@/data';
import { useParams } from 'next/navigation';

export default function Id() {
    const { id } = useParams()
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 max-w-7xl pt-32 mx-auto lg:grid-cols-3 gap-6 p-6">
            {Problems.map((problem) => (
                <Link 
                    key={problem.id} 
                    href={`/game/codehub/${id}/${problem.id}`}
                    className="block hover:scale-105 transition-transform duration-300 ease-in-out"
                >
                    <div className="bg-[#151516] border border-[#151516] rounded-lg shadow-md hover:shadow-lg p-6 h-full flex flex-col">
                        <div className="mb-4">
                            <h2 className="text-xl font-bold text-white mb-2">
                                {problem.title}
                            </h2>
                            <p className="text-sm text-gray-500">
                                Problem ID: {problem.id}
                            </p>
                        </div>
                        <div className="mt-auto flex flex-wrap gap-2">
                            {problem.language.map((lang) => (
                                <span 
                                    key={lang} 
                                    className="bg-[#151516] text-gray-200 text-xs font-medium px-2.5 py-0.5 rounded-full"
                                >
                                    {lang}
                                </span>
                            ))}
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}