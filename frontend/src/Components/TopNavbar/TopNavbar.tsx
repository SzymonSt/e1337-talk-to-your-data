import React, { FC, useContext, useState } from "react";
import {
  Button,
  Col,
  Container,
  Nav,
  NavDropdown,
  Navbar,
  Row,
  Form,
} from "react-bootstrap";
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
        <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
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
                to="/database-connection"
                className={({ isActive, isPending }) =>
                  isPending
                    ? `${styles.pending}`
                    : isActive
                    ? styles.active
                    : styles.NavLink
                }
              >
                {langCtx.language === "ENG"
                  ? "Database Connection"
                  : "Połączenie z Bazą Danych"}
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
          </Nav>

          <Row>
            <Form.Select
              aria-label="Default select example"
              onChange={onLanguageChangeHandler}
              value={langCtx.language}
              className={styles.select}
            >
              <option value="ENG">🇬🇧 English</option>
              <option value="POL">🇵🇱 Polski</option>
            </Form.Select>
          </Row>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TopNavbar;
