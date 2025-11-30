"use client";

import React from "react";
import Link from "next/link";

function Header() {
  return (
    <header className="bg-black border-b fixed z-50 border-white w-full h-[60px] flex items-center">
      <div className="container px-12">
        <div className="flex justify-between items-center">
          <div>
            <Link href="/">
              <h1 className="text-2xl font-bold mb-0">Media Feed</h1>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
