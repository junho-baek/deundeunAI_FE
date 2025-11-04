import type { Translation } from "./types";

const es: Translation = {
  home: {
    title: import.meta.env.VITE_APP_NAME,
    subtitle: "Es hora de construir!",
  },
  navigation: {
    en: "Inglés",
    kr: "Coreano",
    es: "Español",
  },
};

export default es;
