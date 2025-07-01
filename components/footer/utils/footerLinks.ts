import { EmailSvg, InstagramSvg, LinkedinSvg } from "../../shared/ui/svg";
import { CompanyLink, SocialLink } from "../types";

export const COMPANY_LINKS: readonly CompanyLink[] = [
  { href: "/nosotros", text: "Sobre nosotros" },
  { href: "/contacto", text: "Contacto" },
];

export const COURSE_LINKS: readonly CompanyLink[] = [
  { href: "/cursos", text: "Finanzas" },
  { href: "/cursos", text: "Economía" },
  { href: "/cursos", text: "Contabilidad" },
  { href: "/cursos", text: "Derecho" },
  { href: "/cursos", text: "Programación" },
];

export const SOCIAL_LINKS: readonly SocialLink[] = [
  {
    href: "mailto:contacto@innovance.academy",
    icon: EmailSvg,
  },
  {
    href: "https://www.instagram.com/innovanceacademy/",
    icon: InstagramSvg,
  },
  {
    href: "https://ar.linkedin.com/school/innovanceacademy/",
    icon: LinkedinSvg,
  },
];
