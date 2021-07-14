import React, { Component } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

class Home extends Component {
  constructor() {
    super();
    this.countries = [];
    this.regions = [];
    this.state = {
      filteredCountries: [],
      searchText: "",
    };
  }
  filterByRegion = (e) => {
    let newCountries;
    if (e.target.value === "") {
      newCountries = [...this.countries];
    } else {
      newCountries = [
        ...this.countries.filter((el) => el.region === e.target.value),
      ];
    }
    this.setState({ filteredCountries: [...newCountries] });
    // console.log(e.target.value);
  };
  validateResponse = (res) => {
    if (res.length < 1) {
      alert("No country found!");
      return false;
    }
    return true;
  };
  getCountries = async () => {
    let response = [];

    try {
      response = await fetch(
        "https://restcountries.eu/rest/v2/all?fields=name;capital;flag;population;region"
      );

      if (response.status === 200) {
        response = await response.json();

        if (!this.validateResponse(response)) return [];
      } else {
        alert("failed to get flags");
      }
    } catch (err) {
      console.log(err);
      console.log("failed to get flags");
    } finally {
      return response;
    }
  };
  async componentDidMount() {
    this.countries = await this.getCountries();
    this.regions = Array.from(
      new Set(
        this.countries
          .filter((el) => el.region.length > 0)
          .map((el) => el.region)
      )
    );
    this.setState({ filteredCountries: [...this.countries] });
  }

  render() {
    // console.log(this.state.filteredCountries);
    // console.log(this.regions);
    return (
      <>
        <Container className="mt-5">
          <Row className="d-flex justify-content-between action-bar">
            <Col xs={12} sm={5} lg={4}>
              <input placeholder="Search for a country..." />
            </Col>
            <Col xs={12} sm={5} lg={4}>
              <select
                defaultChecked="0"
                aria-label="Default select example"
                onChange={this.filterByRegion}
              >
                <option value="">Filter by Region</option>
                {this.regions.map((val) => (
                  <option value={val}>{val}</option>
                ))}
                {/* <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option> */}
              </select>
            </Col>
          </Row>
          <Row>
            {this.state.filteredCountries.map((country) => (
              <Col sm={3} xs={12}>
                <Link to={`/country/${country.name}`}>
                  <Card style={{ width: "18rem" }}>
                    <Card.Img variant="top" src={country.flag} />
                    <Card.Body>
                      <Card.Title>{country.name}</Card.Title>

                      <p>
                        <strong>Population</strong>: {country.population}
                      </p>
                      <p>
                        <strong>Region</strong>: {country.region}
                      </p>
                      <p>
                        <strong>Capital</strong>: {country.capital}
                      </p>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </Container>
      </>
    );
  }
}

export default Home;
