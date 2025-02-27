"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { VscDebugConsole } from "react-icons/vsc";
import classnames from "classnames";

const NavBar = () => {
  const currentPath = usePathname();

  console.log(currentPath);

  const links = [
    { label: "Dashboard", href: "/" },
    { label: "Issues", href: "/issues" },
  ];
  return (
    <nav className="flex space-x-6 border-b mb-5 px-5 h-14 items-center">
      <Link href="/">
        <VscDebugConsole />
      </Link>
      <ul className="flex space-x-6 ">
        <li>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={classnames({
                "text-zinc-900": link.href === currentPath,
                "text-zinc-500": link.href !== currentPath,
                "hover:text-zinc-800 transition-colors": true,
                "mx-6":true
              })}
            >
              {link.label}
            </Link>
          ))}
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
