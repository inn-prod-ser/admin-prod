"use client";

import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useClerk,
} from "@clerk/nextjs";

import { useAuth } from "../../hooks/useAuth";

export const AuthButtons = () => {
  const { isAuthenticated, isClient } = useAuth();
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      window.dispatchEvent(new Event("storage"));
    }
    await signOut();
  };

  if (!isClient) {
    return null;
  }

  return (
    <div>
      <SignedOut>
        <SignInButton>
          <button className="navbar__courses-link">INICIAR SESIÓN</button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <div className="flex items-center">
          <UserButton afterSignOutUrl="/" />
          {/* <button
            onClick={ handleSignOut }
            className="ml-4 text-xs text-gray-400 hover:text-gray-200"
          >
            Cerrar sesión
          </button> */}
        </div>
      </SignedIn>
    </div>
  );
};
