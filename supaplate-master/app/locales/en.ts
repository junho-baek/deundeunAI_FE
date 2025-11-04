import type { Translation } from "./types";

const en: Translation = {
  home: {
    title: import.meta.env.VITE_APP_NAME,
    subtitle: "It's time to build!",
  },
  navigation: {
    en: "English",
    kr: "Korean",
    es: "Spanish",
  },
};

export default en;
