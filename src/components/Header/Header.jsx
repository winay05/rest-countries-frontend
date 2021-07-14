import { Container, Nav, Navbar, Button } from "react-bootstrap";

const Header = () => (
  <Navbar>
    <Container>
      <Navbar.Brand href="#home">Where in the world?</Navbar.Brand>
      <Nav>
        <Button variant="light">
          <img src="moon.png" alt="" /> Dark mode
        </Button>
      </Nav>
    </Container>
  </Navbar>
);

export default Header;
