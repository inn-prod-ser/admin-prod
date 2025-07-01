"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { UI } from "../../ui";
import { menuItems } from "../helpers";
import { JwtService } from "../../services";

export const ToolsMenu = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);

    const token = JwtService.getStoredToken();

    setIsAuthenticated(!!token);

    const handleStorageChange = () => {
      const token = JwtService.getStoredToken();

      setIsAuthenticated(!!token);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  if (!isClient) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="tools-menu">
      <div className="tools-menu__container">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            className="tools-menu__item group"
            href={item.route}
          >
            <div className="tools-menu__icon-container group-hover:bg-white/10">
              <UI.Image
                alt={item.label}
                className="tools-menu__icon group-hover:scale-125"
                src={item.icon}
              />
            </div>

            <span className="tools-menu__label group-hover:opacity-100">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};
