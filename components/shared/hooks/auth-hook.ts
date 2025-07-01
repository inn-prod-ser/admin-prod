import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";

import { JwtService } from "../services";

import { JwtUserPayload } from "@/interfaces";

export const useAuth = () => {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    const setupUserAuth = async () => {
      if (!isLoaded || !user) return;

      try {
        const userData: JwtUserPayload = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.primaryEmailAddress?.emailAddress || "",
        };

        const { token } = await JwtService.createUserToken(userData);

        JwtService.storeToken(token);
      } catch (error) {
        console.error("Authentication setup failed:", error);
      }
    };

    setupUserAuth();
  }, [user, isLoaded]);

  return {
    isAuthenticated: !!user && isLoaded,
  };
};
