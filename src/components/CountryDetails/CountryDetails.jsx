import { Component } from "react";
import { Card, Col, Container, Image, Row, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

import "./CountryDetails.css";

const reqFields = [
  "flag",
  "name",
  "nativeName",
  "region",
  "population",
  "subregion",
  "capital",
  "topLevelDomain",
  "currencies",
  "languages",
  "borders",
];

const validateResponse = (res) => {
  if (res.length < 1) return false;
  return true;
};
const getCountry = async (param, byName = true) => {
  let info = [];

  let url;
  if (byName)
    url = `https://restcountries.eu/rest/v2/name/${param}?fullText=true&fields=${reqFields.join(
      ";"
    )}`;
  else {
    param = param.map((el) => el.toLowerCase());
    param = param.join(";");
    url = `https://restcountries.eu/rest/v2/alpha?codes=${param}&fields=name`;
  }

  try {
    info = await fetch(url);
    // console.log(info);
    if (info.status !== 200) {
      // alert("Not found");
    } else {
      info = await info.json();

      if (validateResponse(info)) return info;
    }
  } catch (err) {
    console.log(err);
    // alert("couldnt get the country");
  }
};
class CountryDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      info: {},
    };
  }
  async componentDidMount() {
    const countryName = this.props.history.location.pathname.split("/")[2];
    let info;

    if (!window.localStorage.getItem(countryName)) {
      info = (await getCountry(countryName, true))[0];
      // console.log(info);

      let neighbors = info.borders;
      neighbors = await getCountry(neighbors, false);
      neighbors = neighbors?.map((el) => el.name);
      info.borders = neighbors;

      window.localStorage.setItem(countryName, JSON.stringify(info));
    } else {
      info = JSON.parse(window.localStorage.getItem(countryName));
    }

    // console.log(info);

    // console.log(info);
    this.setState({ info: { ...info } });
  }

  render() {
    return (
      <Container>
        {/* <div className="row details-action-bar"></div> */}
        <Row styles={{ width: "auto" }} className="details-action-bar">
          <Link className="" to="/">
            <Button
              variant="light"
              className="details-control-element subtitle"
            >
              Back
            </Button>
          </Link>
        </Row>
        <Row className="d-flex justify-content-between">
          <Col xs={12} sm={5}>
            <Image style={{ width: "100%" }} src={this.state.info.flag} />
          </Col>
          <Col xs={12} sm={6}>
            <Card className="details-card">
              <Card.Header
                style={{
                  border: "none",
                  backgroundColor: "inherit",
                  paddingTop: "2rem",
                }}
              >
                <Card.Title className="title">
                  {this.state.info.name}
                </Card.Title>
              </Card.Header>

              <Card.Body>
                <Row>
                  <Col sm={6} xs={12}>
                    <p>
                      <strong className="subtitle">Native name: </strong>
                      {this.state.info.nativeName}
                    </p>
                    <p>
                      <strong className="subtitle">Population: </strong>
                      {this.state.info.population}
                    </p>
                    <p>
                      <strong className="subtitle">Region: </strong>
                      {this.state.info.region}
                    </p>
                    <p>
                      <strong className="subtitle">Sub region: </strong>
                      {this.state.info.subRegion}
                    </p>
                    <p>
                      <strong className="subtitle">Capital: </strong>
                      {this.state.info.capital}
                    </p>
                  </Col>
                  <Col sm={6} xs={12}>
                    <p>
                      <strong className="subtitle">Top level domain: </strong>
                      {this.state.info.topLevelDomain?.join(", ")}
                    </p>
                    <p>
                      <strong className="subtitle">Currencies: </strong>
                      {this.state.info.currencies?.map((e) => (
                        <span>{e.name}</span>
                      ))}
                    </p>
                    <p>
                      <strong className="subtitle">Languages: </strong>
                      {this.state.info.languages?.map((e) => (
                        <span>{e.name}</span>
                      ))}
                    </p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          {this.state.info.borders?.length > 0 ? (
            <Col className="mt-3 neighbor-container" xs={12}>
              <strong className="subtitle">Border Countries: </strong>{" "}
              {this.state.info.borders?.map((el) => (
                <a
                  className="link-button details-control-element"
                  href={`/country/${el}`}
                  role="button"
                >
                  {el}
                </a>
              ))}
            </Col>
          ) : (
            ""
          )}
        </Row>
      </Container>
    );
  }
}
export default CountryDetails;
