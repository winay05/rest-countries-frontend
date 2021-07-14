import React, { Component } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

class Home extends Component {
  constructor() {
    super();
    this.countries = [];
    this.regions = [];
    this.debounceTimeout = 0;

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

  search = (text) => {
    if (text.length > 0) {
      this.setState((state) => {
        return {
          filteredCountries: this.countries.filter((el) =>
            el.name.toLowerCase().includes(text.toLowerCase())
          ),
        };
      });
    } else {
      this.setState((state) => {
        return {
          filteredProducts: this.countries,
        };
      });
    }
  };

  debounceSearch = (event) => {
    let txt = event.target.value;

    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }
    this.debounceTimeout = setTimeout(
      function () {
        this.search(txt);
      }.bind(this),
      300
    );
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
    if (!window.localStorage.getItem("countries")) {
      console.log("calling api");
      this.countries = await this.getCountries();
      window.localStorage.setItem("countries", JSON.stringify(this.countries));
    } else
      this.countries = JSON.parse(window.localStorage.getItem("countries"));

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
    return (
      <>
        <Container className="mt-5">
          <Row classNam="action-bar">
            <Col xs={12} sm={5} lg={4}>
              <input
                placeholder="Search for a country..."
                onChange={this.debounceSearch}
              />
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
