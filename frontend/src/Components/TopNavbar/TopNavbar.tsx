import React, { FC } from "react";
import { Container, Nav, NavDropdown, Navbar } from "react-bootstrap";
import styles from "./TopNavbar.module.css";
import { Link, NavLink } from "react-router-dom";

interface TopNavbarProps {}

const TopNavbar: FC<TopNavbarProps> = () => (
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
              Chat
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
              Database Connection
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
              Schema
            </NavLink>
          </Nav.Link>

          {/* <Nav.Link href="#link">Link</Nav.Link>
          <NavDropdown title="Dropdown" id="basic-nav-dropdown">
            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.2">
              Another action
            </NavDropdown.Item>
            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#action/3.4">
              Separated link
            </NavDropdown.Item>
          </NavDropdown> */}
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
);

export default TopNavbar;
