"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";

import { JwtUserPayload } from "../../../interfaces/auth-types";
import { JwtService } from "../services";

export const useAuth = () => {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [ isAuthenticated, setIsAuthenticated ] = useState<boolean>( false );
  const [ isAuthenticating, setIsAuthenticating ] = useState<boolean>( false );
  const [ isClient, setIsClient ] = useState<boolean>( false );
  const intervalRef = useRef<NodeJS.Timeout | null>( null );

  useEffect( () => {
    setIsClient( true );

    const token = JwtService.getStoredToken();

    setIsAuthenticated( !!token );

    const handleStorageChange = () => {
      const token = JwtService.getStoredToken();

      setIsAuthenticated( !!token );
    };

    window.addEventListener( "storage", handleStorageChange );

    return () => {
      window.removeEventListener( "storage", handleStorageChange );
    };
  }, [] );

  useEffect( () => {
    const setupUserAuth = async () => {
      if ( !isLoaded || !user || isAuthenticating ) return;

      const token = JwtService.getStoredToken();

      if ( !token ) {
        try {
          setIsAuthenticating( true );

          const userData: JwtUserPayload = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.primaryEmailAddress?.emailAddress || "",
          };

          const { token } = await JwtService.createUserToken( userData );

          JwtService.storeToken( token );
        } catch ( error ) {
          console.error( "Authentication setup failed:", error );
        } finally {
          setIsAuthenticating( false );
        }
      }
    };

    setupUserAuth();
  }, [ user, isLoaded, isAuthenticating ] );

  useEffect( () => {
    if ( !isLoaded || !user ) return;

    if ( intervalRef.current ) {
      clearInterval( intervalRef.current );
      intervalRef.current = null;
    }

    const token = JwtService.getStoredToken();
    if ( token ) {
      const renewToken = async () => {
        try {
          await JwtService.validateTokenWithBackend( token );
        } catch ( error ) {
          console.error( "Token renewal failed:", error );
        }
      };

      renewToken();

      intervalRef.current = setInterval( renewToken, 5 * 60 * 1000 );
    }

    return () => {
      if ( intervalRef.current ) {
        clearInterval( intervalRef.current );
        intervalRef.current = null;
      }
    };
  }, [ isLoaded, user ] );

  useEffect( () => {
    if ( !isLoaded ) return;

    if ( !user && JwtService.getStoredToken() ) {
      JwtService.removeToken();
    }
  }, [ user, isLoaded ] );

  return {
    isAuthenticated: !!JwtService.getStoredToken(),
    isClient,
  };
};
