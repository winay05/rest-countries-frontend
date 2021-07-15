import { useState } from "react";

import { Container, Nav, Navbar } from "react-bootstrap";

import "./Header.css";

function setTheme(themeName) {
  window.localStorage.setItem("theme", themeName);
  document.getElementsByTagName("body")[0].className = themeName;
} // function to toggle between light and dark theme
const toggleTheme = () => {
  if (window.localStorage.getItem("theme") === "theme-dark") {
    setTheme("theme-light");
  } else {
    setTheme("theme-dark");
  }
};

const Light = () => (
  <>
    <img style={{ height: 32 }} src="sun.png" alt="" /> Light mode
  </>
);

const Dark = () => (
  <>
    <img style={{ height: 32 }} src="moon-dark.png" alt="" /> Dark mode
  </>
);
function Header() {
  const [dark, toggle] = useState(
    window.localStorage.getItem("theme") === "theme-dark"
  );

  const handleClick = () => {
    toggle(!dark);
    toggleTheme();
  };
  return (
    <Navbar className="navigation">
      <Container>
        <Navbar.Brand className="title" href="/">
          Where in the world?
        </Navbar.Brand>
        <Nav>
          <div className="title" role="button" onClick={handleClick}>
            {dark ? <Light /> : <Dark />}
          </div>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Header;
