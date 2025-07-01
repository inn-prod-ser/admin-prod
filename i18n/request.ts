import { getRequestConfig } from "next-intl/server";

export default getRequestConfig( async ( { locale } ) => {
  const defaultLocale = "es";
  const actualLocale = locale || defaultLocale;


  return {
    locale: actualLocale as string,
    messages: ( await import( `../messages/${ actualLocale }.json` ) ).default,
  };
} );