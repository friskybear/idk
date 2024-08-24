import { createSignal } from "solid-js";
import { convertFileSrc, invoke } from "@tauri-apps/api/core";
import "./App.css";
import Switch_Theme from "./Component/Switch_Theme/Switch_Theme";
import Logo from "./Component/Logo/Logo";
import { AppManager } from "./utils";
function App() {
  const app_manager = new AppManager({});

  return (
    <>
      <header class="flex justify-between m-2 animate">
        <Logo></Logo>
        <Switch_Theme theme={"dark"}></Switch_Theme>
      </header>
      <main class="h-screen w-screen animate"></main>
      <footer></footer>
    </>
  );
}

export default App;
