"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Trophy,
  Award,
  Zap,
  Users,
  Home,
  Heart,
  Star,
  Youtube,
  School,
  Code,
  ArrowLeft,
  Coffee,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 mb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
        <div className="relative mb-4 md:mb-0">
          <h1 className="text-3xl font-extrabold text-black uppercase tracking-wide font-boldonse inline-block relative z-10">
            ABOUT US
          </h1>
          <div className="absolute -bottom-2 left-0 h-3 w-full bg-yellow-400 -z-0"></div>
          <div className="absolute -top-2 -right-2 h-4 w-4 bg-red-500 border-2 border-black rounded-full"></div>
        </div>

        <Link href="/" className="relative inline-block group">
          <div className="bg-blue-500 border-[3px] border-black rounded-lg py-2 px-4 text-white font-extrabold shadow-[4px_4px_0px_0px_rgba(0,0,0)] transform transition-all group-hover:translate-y-[-2px] group-hover:shadow-[4px_6px_0px_0px_rgba(0,0,0)] font-boldonse flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" strokeWidth={3} />
            Back to Home
          </div>
          <div className="absolute -top-2 -right-2 h-4 w-4 bg-yellow-400 border-2 border-black rounded-full"></div>
          <div className="absolute -bottom-2 -left-2 h-4 w-4 bg-green-500 border-2 border-black rounded-full"></div>
        </Link>
      </div>

      {/* Main Content Box */}
      <div className="bg-white border-4 border-black rounded-xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0)] relative mb-10">
        {/* Comic book style decoration */}
        <div className="absolute -top-2 -right-2 h-5 w-5 bg-yellow-400 border-2 border-black rounded-full z-10"></div>
        <div className="absolute -bottom-2 -left-2 h-5 w-5 bg-blue-500 border-2 border-black rounded-full z-10"></div>

        {/* Halftone pattern overlay */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.3) 1px, transparent 1px)`,
            backgroundSize: "8px 8px",
          }}
        ></div>

        {/* Content */}
        <div className="p-6 md:p-8 relative z-10">
          {/* Project Description */}
          <div className="mb-10 bg-purple-100 border-3 border-black rounded-lg p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0)] relative">
            <h2 className="text-2xl font-bold mb-4 text-black font-boldonse uppercase">
              <Trophy className="inline-block mr-2 h-6 w-6" strokeWidth={2.5} />
              YUKTI VTU FEST 2025
            </h2>
            <div className="font-space">
              <p className="text-black mb-4 leading-relaxed">
                Welcome to{" "}
                <span className="font-bold text-purple-700">SEEVENT</span> - an
                event booking platform developed for the YUKTI VTU Fest
                Competition 2025! This project combines creative design with
                functional web development to create a memorable event booking
                experience.
              </p>
              <p className="text-black mb-4 leading-relaxed">
                Our comic book inspired design isn't just fun - it makes the
                booking process more engaging and intuitive. Discover events,
                select seats, and secure your spot all in one vibrant platform!
              </p>
            </div>
            <div className="absolute -top-2 -right-2 h-4 w-4 bg-red-500 border-2 border-black rounded-full"></div>
            <div className="absolute -bottom-2 -left-2 h-4 w-4 bg-green-500 border-2 border-black rounded-full"></div>
          </div>

          {/* College Section */}
          <div className="mb-10 bg-blue-100 border-3 border-black rounded-lg p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0)] relative">
            <h2 className="text-2xl font-bold mb-4 text-black font-boldonse uppercase">
              <School className="inline-block mr-2 h-6 w-6" strokeWidth={2.5} />
              BRINDAVAN COLLEGE
            </h2>
            <div className="font-space">
              <p className="text-black mb-4 leading-relaxed">
                Proudly representing{" "}
                <span className="font-bold text-blue-700">
                  Brindavan College
                </span>{" "}
                in the YUKTI VTU competition! Our college has a strong tradition
                of excellence in technology and innovation, and this project
                showcases the creative and technical skills we've developed
                during our time here.
              </p>
              <p className="text-black mb-3 leading-relaxed">
                This project was developed under the guidance of our dedicated
                professors who encouraged us to push the boundaries of
                conventional web design.
              </p>
            </div>
            <div className="absolute -top-2 -left-2 h-4 w-4 bg-yellow-400 border-2 border-black rounded-full"></div>
            <div className="absolute -bottom-2 -right-2 h-4 w-4 bg-blue-500 border-2 border-black rounded-full"></div>
          </div>

          {/* YouTube Competition */}
          {/* <div className="mb-10 bg-red-100 border-3 border-black rounded-lg p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0)] relative">
            <h2 className="text-2xl font-bold mb-4 text-black font-boldonse uppercase">
              <Youtube
                className="inline-block mr-2 h-6 w-6"
                strokeWidth={2.5}
              />
              YOUTUBE VIDEO COMPETITION 2025
            </h2>
            <div className="font-space">
              <p className="text-black mb-4 leading-relaxed">
                This project is our entry for the 2025 YouTube Video Competition
                where we demonstrate how technology and creative design can come
                together to solve real-world problems.
              </p>
              <p className="text-black mb-3 leading-relaxed">
                Check out our project demonstration video to see SEEVENT in
                action! We've documented our development journey, showcased the
                key features, and explained the technical challenges we
                overcame.
              </p>
              <div className="mt-4 p-3 bg-white border-2 border-black rounded-lg relative inline-block transform rotate-1">
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-red-600 flex items-center"
                >
                  <Youtube className="h-5 w-5 mr-2" strokeWidth={2.5} />
                  Watch our demo video!
                </a>
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 border-2 border-black rounded-full"></div>
              </div>
            </div>
            <div className="absolute -top-2 -right-2 h-4 w-4 bg-purple-500 border-2 border-black rounded-full"></div>
            <div className="absolute -bottom-2 -left-2 h-4 w-4 bg-yellow-400 border-2 border-black rounded-full"></div>
          </div> */}

          {/* Team Section */}
          <div className="bg-green-100 border-3 border-black rounded-lg p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0)] relative">
            <h2 className="text-2xl font-bold mb-6 text-black font-boldonse uppercase">
              <Users className="inline-block mr-2 h-6 w-6" strokeWidth={2.5} />
              OUR AWESOME TEAM
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Team Member 1 */}
              <div className="bg-white border-3 border-black rounded-lg p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0)] relative transform rotate-1">
                <div className="flex items-center mb-3">
                  <div className="w-16 h-16 bg-blue-400 border-3 border-black rounded-full flex items-center justify-center mr-3">
                    <Code className="h-8 w-8 text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-black font-boldonse">
                      Ankit Kumar Singh
                    </h3>
                    <p className="text-gray-700 font-bold font-space">
                      Full-Stack Developer
                    </p>
                  </div>
                </div>
                <p className="text-black font-space">
                  Coffee enthusiast turning ideas into code!{" "}
                  <Coffee
                    className="h-4 w-4 inline-block ml-1"
                    strokeWidth={2.5}
                  />{" "}
                  Specializes in frontend architecture and creating interactive
                  UI components.
                </p>
                <div className="absolute -top-2 -right-2 h-3 w-3 bg-blue-500 border-2 border-black rounded-full"></div>
              </div>

              {/* Team Member 2 */}
              <div className="bg-white border-3 border-black rounded-lg p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0)] relative transform -rotate-1">
                <div className="flex items-center mb-3">
                  <div className="w-16 h-16 bg-pink-400 border-3 border-black rounded-full flex items-center justify-center mr-3">
                    <Sparkles
                      className="h-8 w-8 text-white"
                      strokeWidth={2.5}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-black font-boldonse">
                      Sneha Priyadarshy
                    </h3>
                    <p className="text-gray-700 font-bold font-space">
                      UX Designer & Developer
                    </p>
                  </div>
                </div>
                <p className="text-black font-space">
                  Design thinker with an eye for detail!{" "}
                  <Heart
                    className="h-4 w-4 inline-block ml-1 text-red-500"
                    fill="red"
                    strokeWidth={2.5}
                  />{" "}
                  Creates beautiful user experiences and implements them with
                  precision.
                </p>
                <div className="absolute -top-2 -left-2 h-3 w-3 bg-pink-500 border-2 border-black rounded-full"></div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <div className="inline-block bg-yellow-400 border-3 border-black rounded-lg py-2 px-4 font-bold text-black shadow-[3px_3px_0px_0px_rgba(0,0,0)] transform rotate-2 relative">
                <p className="font-boldonse flex items-center justify-center">
                  <Star className="h-5 w-5 mr-2" strokeWidth={2.5} />
                  <span>Together, we make tech magic happen!</span>
                  <Zap className="h-5 w-5 ml-2" strokeWidth={2.5} />
                </p>
                <div className="absolute -bottom-2 -left-2 h-3 w-3 bg-red-500 border-2 border-black rounded-full"></div>
              </div>
            </div>

            <div className="absolute -top-2 -left-2 h-4 w-4 bg-green-500 border-2 border-black rounded-full"></div>
            <div className="absolute -bottom-2 -right-2 h-4 w-4 bg-red-500 border-2 border-black rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Tech Stack Section */}
      <div className="bg-white border-4 border-black rounded-xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0)] relative">
        <div className="absolute -top-2 -right-2 h-5 w-5 bg-green-400 border-2 border-black rounded-full z-10"></div>
        <div className="absolute -bottom-2 -left-2 h-5 w-5 bg-purple-500 border-2 border-black rounded-full z-10"></div>

        <div className="bg-gradient-to-r from-blue-500 to-purple-600 py-3 px-6 border-b-4 border-black">
          <h2 className="text-xl font-extrabold text-white uppercase tracking-wider font-boldonse flex items-center">
            <Code className="h-5 w-5 mr-2" strokeWidth={2.5} />
            Our Tech Stack
          </h2>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {[
              { name: "Next.js", color: "bg-black", textColor: "text-white" },
              { name: "React", color: "bg-blue-400", textColor: "text-white" },
              {
                name: "TypeScript",
                color: "bg-blue-600",
                textColor: "text-white",
              },
              {
                name: "Tailwind CSS",
                color: "bg-cyan-500",
                textColor: "text-white",
              },
              {
                name: "Lucide Icons",
                color: "bg-purple-500",
                textColor: "text-white",
              },
              { name: "Vercel", color: "bg-gray-800", textColor: "text-white" },
            ].map((tech, index) => (
              <div key={index} className="relative group">
                <div
                  className={`${tech.color} border-3 border-black rounded-lg py-3 px-2 text-center shadow-[3px_3px_0px_0px_rgba(0,0,0)] transition-all transform group-hover:-translate-y-1 group-hover:shadow-[3px_5px_0px_0px_rgba(0,0,0)]`}
                >
                  <p
                    className={`font-bold ${tech.textColor} font-boldonse text-sm md:text-base`}
                  >
                    {tech.name}
                  </p>
                </div>
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-yellow-400 border-2 border-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
