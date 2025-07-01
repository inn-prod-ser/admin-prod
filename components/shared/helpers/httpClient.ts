const API_URL = process.env.NEXT_PUBLIC_BACKEND;


const getToken = () => {
  if ( typeof window !== "undefined" ) {
    return localStorage.getItem( "token" );
  }
  return null;
};

const globalSignOut = async () => {
  if ( typeof window !== "undefined" ) {
    localStorage.removeItem( "token" );
    localStorage.removeItem( "key_token" );
    window.dispatchEvent( new Event( "storage" ) );
    const mod = await import( "@clerk/nextjs" );
    if ( mod && typeof mod.useClerk === "function" ) {
      const { signOut } = mod.useClerk();
      if ( signOut ) {
        signOut();
      }
    } else if ( ( window as any ).Clerk && typeof ( window as any ).Clerk.signOut === "function" ) {
      ( window as any ).Clerk.signOut();
    }
  }
};

export const request = async <T>(
  endpoint: string,
  method: "GET" | "POST" | "PATCH" | "DELETE",
  data?: unknown,
): Promise<T> => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${ getToken() }`,
  };

  try {
    const res = await fetch( `${ API_URL }${ endpoint }`, {
      body: data ? JSON.stringify( data ) : undefined,
      headers,
      method,
    } );

    if ( res.status === 401 ) {
      await globalSignOut();
      throw new Error( "Sesión expirada o no autorizada" );
    }

    if ( !res.ok ) {
      const errorData = await res.text();
      throw new Error( errorData || "Request error" );
    }

    if ( res.status === 204 ) {
      return {} as T;
    }

    const textResponse = await res.text();
    return textResponse ? JSON.parse( textResponse ) : ( {} as T );
  } catch ( error ) {
    throw new Error( error instanceof Error ? error.message : "Network error" );
  }
};
