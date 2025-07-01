"use client";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export const UserJwt = () => {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    const createToken = async () => {
      if (!user) return;

      try {
        const userInfo = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.primaryEmailAddress?.emailAddress || "",
        };

        const response = await fetch("/es/api/auth/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userInfo),
        });

        if (!response.ok) {
          throw new Error("Failed to create token");
        }

        const data = await response.json();

        if (data.token) {
          localStorage.setItem("token", data.token);

          const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND}/api/auth/validate-token`;

          const validationResponse = await fetch(backendUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: data.token }),
          });

          if (!validationResponse.ok) {
            throw new Error("Failed to validate token with backend");
          }
        }
      } catch (error) {
        console.error("Error creating token:", error);
      }
    };

    if (isLoaded && user) {
      createToken();
    }
  }, [user, isLoaded]);

  return null;
};
