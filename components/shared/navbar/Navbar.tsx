"use client";
import Link from "next/link";

import { LogoSvg } from "../ui/svg";

import { NavbarActions } from "./components";
import { useNavbarScroll } from "./hooks";

export const Navbar = () => {
  const isScrolled = useNavbarScroll();

  return (
    <nav className={`navbar ${isScrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar__container">
        <Link className="navbar__logo" href="/">
          <LogoSvg />
        </Link>

        <NavbarActions />
      </div>
    </nav>
  );
};
