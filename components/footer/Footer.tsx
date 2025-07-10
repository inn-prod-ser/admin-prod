import Link from "next/link";

import { LogoFooterSvg } from "../shared/ui/svg";

import { COMPANY_LINKS, COURSE_LINKS, SOCIAL_LINKS } from "./utils";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-sections">
            <div className="footer-links">
              <div className="footer-section">
                <h2 className="footer-title">EMPRESA</h2>

                <ul className="footer-list">
                  {COMPANY_LINKS.map(({ href, text }) => (
                    <li key={href}>
                      <Link className="footer-link" href={href}>
                        {text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="footer-section">
                <h2 className="footer-title">
                  <Link href="/cursos">CURSOS</Link>
                </h2>

                <ul className="footer-list">
                  {COURSE_LINKS.map(({ href, text }) => (
                    <li key={text}>
                      <Link className="footer-link" href={href}>
                        {text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="footer-social">
              <div className="footer-social-links">
                {SOCIAL_LINKS.map(({ href, icon: Icon }) => (
                  <Link key={href} className="footer-social-icon" href={href}>
                    <Icon />
                  </Link>
                ))}
              </div>

              <Link className="footer-logo" href="/">
                <LogoFooterSvg />
              </Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-links">
            <Link className="footer-link" href="/privacidad">
              Políticas de privacidad
            </Link>
            <span className="footer-divider">|</span>
            <Link className="footer-link" href="/terminos">
              Términos y condiciones
            </Link>
          </div>
          <span className="footer-bottom-text">
            INNOVANCE ACADEMY S.A. © {currentYear}
          </span>
        </div>
      </div>
    </footer>
  );
};
