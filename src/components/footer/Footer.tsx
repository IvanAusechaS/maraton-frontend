import type { FC } from "react";
import { Link } from "react-router-dom";
import "./Footer.scss";
import linealLogo from "../../assets/lineal-logo.svg";

const Footer: FC = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        <span>footer</span>
      </div>
    </footer>
  );
};

export default Footer;
