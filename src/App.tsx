import { createContext, createEffect, createSignal, Show } from "solid-js";
import { convertFileSrc, invoke } from "@tauri-apps/api/core";
import "./App.css";
import TitleBar from "./Component/Titlebar/TitleBar";
import { useNavigate } from "@solidjs/router";
import SaveKeep from "./Component/Save&Keep/SaveKeep";
import { Provider } from "./utils/Context";

function App() {
  return (
    <Provider>
      <TitleBar></TitleBar>
      <SaveKeep></SaveKeep>
      <div class="bg-red-100 w-screen h-full"></div>
    </Provider>
  );
}

export function clickMe() {
  const nav = useNavigate();
  return (
    <>
      <button
        class="btn h-36 w-36 btn-square btn-primary"
        onclick={() => {
          nav("/home", { replace: true });
        }}
      >
        click me
      </button>
    </>
  );
}

export default App;
