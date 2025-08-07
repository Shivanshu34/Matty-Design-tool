import React from "react";
import bgImage from "../assets/Home_bg.jpg";

export default function Home() {
  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <div className="bg-white/30 backdrop-blur-md rounded-2xl p-10 max-w-xl w-full mx-4 text-center shadow-lg border border-white/40">
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-4">
          Welcome to <span className="text-indigo-600">Matty</span>
        </h1>
        <p className="text-gray-700 text-md md:text-lg mb-6">
          A gentle space to craft your ideas into beautiful designs — minimal, fluid, and smart.
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="/login"
            className="px-6 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-all"
          >
            Login
          </a>
          <a
            href="/register"
            className="px-6 py-2 rounded-full bg-white text-indigo-600 hover:bg-gray-100 transition-all"
          >
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}