/* @refresh reload */
import { render } from "solid-js/web";
import App, { clickMe } from "./App";
import { Router, Route } from "@solidjs/router";
import Login from "./Component/Login/Login";
import { Provider } from "./utils/Context";

render(
  () => (
    <Router>
      <Route path="/" component={clickMe} />
      <Route path={"/login"} component={Login}></Route>
      <Route path="/home" component={App} />
    </Router>
  ),
  document.getElementById("root") as HTMLElement
);
