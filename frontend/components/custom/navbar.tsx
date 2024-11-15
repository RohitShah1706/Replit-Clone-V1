"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ThemeModeToggle } from "./theme-mode-toggle";
import { signIn, useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { UserDropdownMenu } from "./user-drop-down-menu";

export const Navbar = () => {
  const { data: session } = useSession();

  return (
    <nav className="sticky top-0 w-full border-b border-gray-200 dark:border-gray-900 bg-[#FEFFFE] dark:bg-[#0B0B0A] z-10">
      <div className="container flex flex-wrap items-center justify-between p-3">
        <Link
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <div className="block dark:hidden">
            <Image src="/vercel.svg" alt="github" width={32} height={32} />
          </div>
          <div className="hidden dark:block">
            <Image
              src="/vercel-white.svg"
              alt="github"
              width={32}
              height={32}
            />
          </div>
          <span className="hidden sm:block self-center sm:text-3xl md:text-4xl font-semibold whitespace-nowrap dark:text-white text-black">
            Replit
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeModeToggle />
          {session?.user ? (
            <UserDropdownMenu user={session.user} />
          ) : (
            <div className="flex items-center gap-2">
              <Button onClick={() => signIn("github")}>Log In</Button>

              <Button onClick={() => signIn("github")} variant="outline">
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
