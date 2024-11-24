import React from "react";
import { Github, GitMergeIcon, ZapIcon, Activity } from "lucide-react";
import Link from "next/link";
import LoginWithGitHub from "@/components/LoginwithGithub";

const Hero: React.FC = () => {
  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <nav className="container mx-auto flex justify-around items-center py-6">
        <div className=" text-2xl lg:text-3xl md:text-2xl font-bold">
          Pull<span className="text-[#60A5FA]">Mate</span>
        </div>
        <div className="space-x-6">
          <Link
            href="#"
            className="hover:text-gray-300 font-semibold lg:text-lg md:text-base hidden md:inline"
          >
            Features
          </Link>
          <Link
            href="#"
            className="hover:text-gray-300 font-semibold lg:text-lg md:text-base hidden md:inline"
          >
            Pricing
          </Link>
          <Link
            href="#"
            className="hover:text-gray-300 font-semibold lg:text-lg md:text-base hidden md:inline"
          >
            About
          </Link>
        </div>
        <div className="space-x-4">
          <button className="text-white hover:text-gray-300 font-semibold lg:text-lg md:text-base">
            Try Demo
          </button>
          <LoginWithGitHub title="Login" />
        </div>
      </nav>

      <main className="container mx-auto mt-[7vw] text-center relative">
        <div className="absolute top-[25vw] md:top-0 lg:left-40 md:left-20 animate-bounce">
          <Github size={48} className="text-gray-600" />
        </div>
        <div className="absolute top-[25vw] right-1 md:top-0 lg:right-40 md:right-20 animate-bounce">
          <GitMergeIcon size={48} className="text-blue-500" />
        </div>
        <div className="absolute bottom-0 left-10 md:bottom-0 md:left-1/4 animate-pulse">
          <ZapIcon size={48} className="text-yellow-500" />
        </div>
        <div className="absolute bottom-0 right-10 md:bottom-0 md:right-1/4 animate-pulse">
          <Activity size={48} className="text-red-500" />
        </div>

        <h2 className="text-lg lg:text-2xl md:text-xl mb-4 text-blue-400">
          Your #1 companion for streamlined PR reviews
        </h2>
        <h1 className=" text-4xl lg:text-7xl md:text-5xl font-bold mb-6 leading-tight">
          Automate the Tedious, <br /> Focus on the Code
        </h1>
        <p className="text-xl lg:text-2xl md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          Lint. Analyze. Secure. All in One Workflow.
        </p>
        <LoginWithGitHub title="Get Started Free" />
      </main>
    </div>
  );
};

export default Hero;
