import { Container, Nav, Navbar } from "react-bootstrap";

import styles from "./Header.module.css";

const Header = () => (
  <Navbar className={styles.navigation}>
    <Container>
      <Navbar.Brand className="title" href="/">
        Where in the world?
      </Navbar.Brand>
      <Nav>
        <div className="title" role="button">
          <img src="moon-regular.svg" style={{ height: 30 }} alt="" /> Dark mode
        </div>
        {/* <Button className="title" variant="light">
          
        </Button> */}
      </Nav>
    </Container>
  </Navbar>
);

export default Header;
