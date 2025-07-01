import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

interface Props {
  children: React.ReactNode;
}

export async function NextIntlProvider({ children }: Props) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
