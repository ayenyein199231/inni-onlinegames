"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function GamesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  const games = [
    {
      id: "snake",
      title: "Snake Game",
      description: "Classic Snake game with modern graphics.",
      image: "/textures/snake-game.jpg",
      category: "Arcade",
      path: "/games/snake",
      available: true,
    },
    {
      id: "coming-soon-1",
      title: "3D Adventure",
      description: "Exciting 3D adventure game built with Babylon.js.",
      image: "/textures/snake-game.jpg",
      category: "Adventure",
      path: "#",
      available: false,
    },
    {
      id: "coming-soon-2",
      title: "Puzzle Master",
      description: "Challenge your brain with complex puzzles.",
      image: "/textures/snake-game.jpg",
      category: "Puzzle",
      path: "#",
      available: false,
    },
    {
      id: "coming-soon-3",
      title: "Racing Simulator",
      description: "High-speed racing game with realistic physics.",
      image: "/textures/snake-game.jpg",
      category: "Racing",
      path: "#",
      available: false,
    },
    {
      id: "coming-soon-4",
      title: "Space Shooter",
      description: "Defend the galaxy from alien invaders.",
      image: "/textures/snake-game.jpg",
      category: "Action",
      path: "#",
      available: false,
    },
    {
      id: "coming-soon-5",
      title: "Strategy Commander",
      description: "Build your base and conquer your enemies.",
      image: "/textures/snake-game.jpg",
      category: "Strategy",
      path: "#",
      available: false,
    },
  ];

  const categories = ["All Categories", ...Array.from(new Set(games.map((g) => g.category)))];

  const filteredGames =
    selectedCategory === "All Categories"
      ? games
      : games.filter((g) => g.category === selectedCategory);

  return (
    <div className="p-6 space-y-8 max-w-screen-xl mx-auto">
      {/* Header + Filter */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-white">All Games</h1>
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-gray-800 text-white rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
          >
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
                fillRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Game Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGames.map((game) => (
          <Link
            href={game.available ? game.path : "#"}
            key={game.id}
            className={`group block ${!game.available ? "cursor-not-allowed opacity-70" : ""}`}
          >
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-purple-500/30 transition duration-300 h-full flex flex-col">
              <div className="relative h-48 w-full">
                <Image
                  src={game.image}
                  alt={game.title}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority={game.id === "snake"}
                />
                {!game.available && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-lg font-semibold">
                    Coming Soon
                  </div>
                )}
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-1">
                    {game.title}
                  </h2>
                  <p className="text-gray-400 text-sm">{game.description}</p>
                </div>
                <span className="text-sm text-purple-400 mt-2 block">
                  {game.category}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
