/* @refresh reload */
import { render } from "solid-js/web";
import App from "./App";
import { Router, Route } from "@solidjs/router";

render(
  () => <Router root={App}>
    
  </Router>,
  document.getElementById("root") as HTMLElement
);
