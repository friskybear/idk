/* @refresh reload */
import { render } from "solid-js/web";
import App from "./App";
import { Router, Route } from "@solidjs/router";
import Login from "./Component/Login/Login";

render(
  () => (
    <Router root={App}>
      <Route path="/home" component={App} />
    </Router>
  ),
  document.getElementById("root") as HTMLElement
);
