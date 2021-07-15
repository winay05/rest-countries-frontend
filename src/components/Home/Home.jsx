import React, { Component } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

import "./Home.css";

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
          filteredCountries: this.countries,
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

  performAPICall = async (url) => {
    let response = [];
    try {
      response = await fetch(url);

      if (response.status === 200) {
        response = await response.json();

        if (!this.validateResponse(response)) return [];
      } else {
        alert("failed to get flags");
      }
    } catch (err) {
      console.log(err);
    } finally {
      return response;
    }
  };
  getCountries = async () => {
    let response = [];

    try {
      response = await this.performAPICall(
        "https://restcountries.eu/rest/v2/all?fields=name;capital;flag;population;region"
      );
    } catch (err) {
      console.log(err);
      // console.log("failed to get flags");
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
          <Row className="action-bar">
            <Col xs={12} sm={3}>
              <input
                className="control-element"
                placeholder="Search for a country..."
                onChange={this.debounceSearch}
              />
            </Col>
            <Col xs={12} sm={2}>
              <select
                className="control-element"
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
          <Row className="card-container">
            {this.state.filteredCountries.map((country) => (
              <Col xs={12} sm={6} md={4} lg={3}>
                <Link to={`/country/${country.name}`}>
                  <Card className="card">
                    <Card.Img
                      className="img-fluid card-img"
                      variant="top"
                      src={country.flag}
                      alt={`${country.name}-flag`}
                    />
                    <Card.Body className="card-body">
                      <Card.Title className="title mb-3">
                        {country.name}
                      </Card.Title>

                      <p>
                        <strong className="subtitle">Population</strong>:{" "}
                        {country.population}
                      </p>
                      <p>
                        <strong className="subtitle">Region</strong>:{" "}
                        {country.region}
                      </p>
                      <p>
                        <strong className="subtitle">Capital</strong>:{" "}
                        {country.capital}
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
