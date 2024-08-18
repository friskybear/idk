import { createSignal } from "solid-js";
import { convertFileSrc, invoke } from "@tauri-apps/api/core";
import "./App.css";
import Switch_Theme from "./Component/Switch_Theme/Switch_Theme";
import Logo from "./Component/Logo/Logo";
//import { debounce } from "lodash";

function App() {


  return (
    <>
      <header class="flex justify-between m-2">
        <Logo></Logo>
        <Switch_Theme></Switch_Theme>
      </header>
      <main>
      </main>
      <footer></footer>
    </>
  );
}

export default App;
