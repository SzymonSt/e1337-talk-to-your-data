import React, { FC, useContext } from "react";
import { Container, Nav, Navbar, Form } from "react-bootstrap";
import styles from "./TopNavbar.module.css";
import { NavLink } from "react-router-dom";
import { languageContext } from "../../context/LanguageContext";

interface TopNavbarProps {}

const TopNavbar: FC<TopNavbarProps> = () => {
  const langCtx = useContext(languageContext);

  const onLanguageChangeHandler: React.ChangeEventHandler<HTMLSelectElement> = (
    e
  ) => {
    langCtx.setLanguage(e.target.value);
  };

  return (
    <Navbar expand="lg" className={`bg-body-tertiary ${styles.TopNavbar}`}>
      <Container>
        <Navbar.Brand className={styles.Brand}>
          <img
            alt=""
            src="/SQLucjan-logo.svg"
            width="50"
            height="30"
            className="d-inline-block align-top"
          />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link>
              <NavLink
                to="/"
                className={({ isActive, isPending }) =>
                  isPending
                    ? `${styles.pending}`
                    : isActive
                    ? styles.active
                    : styles.NavLink
                }
              >
                {langCtx.language === "ENG" ? "Chat" : "Czat"}
              </NavLink>
            </Nav.Link>

            <Nav.Link>
              <NavLink
                to="/schema"
                className={({ isActive, isPending }) =>
                  isPending
                    ? `${styles.pending}`
                    : isActive
                    ? styles.active
                    : styles.NavLink
                }
              >
                {langCtx.language === "ENG" ? "Schema" : "Struktura"}
              </NavLink>
            </Nav.Link>
            <Form.Select
              aria-label="Default select example"
              onChange={onLanguageChangeHandler}
              value={langCtx.language}
              className={styles.select}
            >
              <option value="ENG">🇬🇧 English</option>
              <option value="POL">🇵🇱 Polski</option>
            </Form.Select>
          </Nav>
        </Navbar.Collapse>

        {/* <Navbar.Collapse className="justify-content-center"></Navbar.Collapse> */}

        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            Powered by <strong style={{ color: "#fb00d8" }}>SQLucjan</strong>
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TopNavbar;
