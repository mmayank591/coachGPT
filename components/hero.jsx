"use client";
import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
const HeroSection = () => {
  const imageref = useRef(null);

  useEffect(() => {
    const imageElement = imageref.current;
    const handlescroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (scrollPosition > scrollThreshold) {
        imageElement.classList.add("scrolled");
      } else {
        imageElement.classList.remove("scrolled");
      }
    };
    window.addEventListener("scroll", handlescroll);
    return () => window.removeEventListener("scroll", handlescroll);
  }, []);

  return (
    <section className="w-full pt-36 md:pt-48 pb-10">
      <div className="space-y-6 text-center">
        <div className="space-y-6 margin mx-auto">
          <h1 className="  text-5xl font-bold md:text-6xl lg:text-7xl xl:text-8xl gradient-title">
            Your AI Career Coach for
            <br />
            Professional Success
          </h1>
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-x1">
            Advance your career with personalised guidance,Interview prep and
            AI-Powered tools for job sucess.
          </p>
        </div>
        <div className="flex justify-center space-x-4">
          <Link href="/dashboard" className="cursor-pointer">
            <Button size="lg" className="px-8 animate-bounce">
              Get Started
            </Button>
          </Link>

          <Link href="/dashboard" className="cursor-pointer">
            <Button size="lg" className="px-8 animate-bounce" variant="outline">
              Watch Demo
            </Button>
          </Link>
        </div>
        <div className="hero-image-wrapper mt-5 md:mt-0">
          <div ref={imageref} className="hero-image">
            <Image
              src={"/banner.jpeg"}
              width={1100}
              height={700}
              alt="Dashboard Preview"
              className="rounded-lg shadow-2xl border mx-auto"
              priority
            ></Image>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
