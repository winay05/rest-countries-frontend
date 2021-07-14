import { Component } from "react";
import { Card, Col, Container, Image, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

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
      alert("Not found");
    } else {
      info = await info.json();

      if (validateResponse(info)) return info;
    }
  } catch (err) {
    console.log(err);
    alert("couldnt get the country");
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

    let info = (await getCountry(countryName, true))[0];
    // console.log(info);

    let neighbors = info.borders;
    neighbors = await getCountry(neighbors, false);
    neighbors = neighbors.map((el) => el.name);
    info.borders = neighbors;
    // console.log(info);

    // console.log(info);
    this.setState({ info: { ...info } });
  }

  render() {
    return (
      <Container>
        <Row>
          <Link to="/">Back</Link>
        </Row>
        <Row className="d-flex justify-content-center">
          <Col xs={12} sm={5}>
            <Image src={this.state.info.flag} />
          </Col>
          <Col xs={12} sm={5}>
            <Card>
              <Card.Title>{this.state.info.name}</Card.Title>
              <br />
              <p>
                <strong>Native name: </strong>
                {this.state.info.nativeName}
              </p>
              <p>
                <strong>Population: </strong>
                {this.state.info.population}
              </p>
              <p>
                <strong>Region: </strong>
                {this.state.info.region}
              </p>
              <p>
                <strong>Sub region: </strong>
                {this.state.info.subRegion}
              </p>
              <p>
                <strong>Capital: </strong>
                {this.state.info.capital}
              </p>
              <p>
                <strong>Top level domain: </strong>
                {this.state.info.topLevelDomain?.join(", ")}
              </p>
              <p>
                <strong>Currencies: </strong>
                {this.state.info.currencies?.map((e) => (
                  <span>{e.name}</span>
                ))}
              </p>
              <p>
                <strong>Languages: </strong>
                {this.state.info.languages?.map((e) => (
                  <span>{e.name}</span>
                ))}
              </p>
            </Card>
            <Row>
              <strong>Border Countries: </strong>{" "}
              <span>
                {this.state.info.borders?.map((el) => (
                  <a href={`/country/${el}`} role="button">
                    {el}
                  </a>
                ))}
              </span>
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }
}
export default CountryDetails;
