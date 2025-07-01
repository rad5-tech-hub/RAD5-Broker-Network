"use client";
import React from "react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white overflow-hidden">
      <div className="text-center space-y-6 px-4">
        {/* Glitch effect for 404 */}
        <h1 className="text-8xl md:text-9xl font-extrabold tracking-tighter animate-glitch relative">
          <span className="absolute text-blue-400 animate-glitch-top">404</span>
          <span className="absolute text-pink-400 animate-glitch-bottom">
            404
          </span>
          404
        </h1>
        <h2 className="text-3xl md:text-4xl font-semibold animate-pulse">
          Page Not Found
        </h2>
        <p className="text-lg md:text-xl text-gray-300 max-w-md mx-auto">
          Oops! Looks like this page is lost in the digital void. Let's get you
          back to reality.
        </p>
        <a
          href="/"
          className="inline-block px-8 py-3 bg-blue-500 hover:bg-blue-600 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Return Home
        </a>
      </div>

      {/* Background particles effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 animate-float" />
      </div>

      {/* Tailwind CSS with custom animations */}
      <style jsx>{`
        @keyframes glitch-top {
          0% {
            transform: translate(0, 0);
            opacity: 0.8;
          }
          2% {
            transform: translate(-2px, 2px);
            opacity: 0.6;
          }
          4% {
            transform: translate(2px, -2px);
            opacity: 0.8;
          }
          100% {
            transform: translate(0, 0);
            opacity: 0.8;
          }
        }
        @keyframes glitch-bottom {
          0% {
            transform: translate(0, 0);
            opacity: 0.8;
          }
          2% {
            transform: translate(2px, -2px);
            opacity: 0.6;
          }
          4% {
            transform: translate(-2px, 2px);
            opacity: 0.8;
          }
          100% {
            transform: translate(0, 0);
            opacity: 0.8;
          }
        }
        @keyframes float {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 1000px 1000px;
          }
        }
        .animate-glitch {
          position: relative;
          animation: glitch-top 2s linear infinite;
        }
        .animate-glitch-top {
          animation: glitch-top 1s linear infinite;
          clip-path: polygon(0 0, 100% 0, 100% 33%, 0 33%);
        }
        .animate-glitch-bottom {
          animation: glitch-bottom 1.5s linear infinite;
          clip-path: polygon(0 67%, 100% 67%, 100% 100%, 0 100%);
        }
        .animate-float {
          animation: float 50s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default NotFound;
