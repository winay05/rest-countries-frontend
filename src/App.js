import { Route, Switch, withRouter } from "react-router-dom";
import CountryDetails from "./components/CountryDetails/CountryDetails";
import Home from "./components/Home/Home";
import Header from "./components/Header/Header";

function App(props) {
  return (
    <div className="App">
      <Header />

      <Switch>
        <Route exact path="/country/:name">
          <CountryDetails history={props.history} />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </div>
  );
}

export default withRouter(App);
