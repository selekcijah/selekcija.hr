import { NavbarClient } from "./NavbarClient";

export function Header({ locales = [], navigation, settings, lang }) {
  return (
    <NavbarClient
      locales={locales}
      navigation={navigation}
      settings={settings}
      lang={lang}
    />
  );
}
