import { Component, createSignal, useContext } from "solid-js";
import DataSection from "../DataSection/DataSection";
import Switch_Theme from "../Switch_Theme/Switch_Theme";
import Logo from "../Logo/Logo";
import { AppManagerContext } from "../../utils/Context";
import { debounce } from "lodash";
//import Add from "./Add/Add";

const SaveKeep: Component<{}> = (props) => {
  const app = useContext(AppManagerContext);
  const [request_data, set_request_data] = createSignal(true);
  const debounce_scroll = debounce((e) => {
    const element = e.target as HTMLElement;
    if (
      element.scrollTop + element.offsetHeight + 10 > element.scrollHeight &&
      !request_data()
    ) {
      set_request_data(true);
    }
  }, 100);
  return (
    <>
      <section
        class={` overflow-scroll h-screen w-screen pb-10 ${
          app?.app_manager().is_phone() ? "" : "top-9 absolute"
        }`}
        onscroll={debounce_scroll}
      >
        <header data-tauri-drag-region class="flex justify-between m-2 ">
          <Logo></Logo>
          <Switch_Theme></Switch_Theme>
        </header>
        <main>
          <DataSection
            status={{ request_data, set_request_data }}
          ></DataSection>
          <button class=" fixed right-2 bottom-2 drop-shadow-lg shadow-sm rounded-full btn btn-accent shadow-primary-600 btn-md btn-square">
            {plus}
          </button>
        </main>
      </section>
    </>
  );
};

export default SaveKeep;

const plus = (
  <svg
    height={30}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      {" "}
      <path
        d="M5 12H19"
        stroke="#323232"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>{" "}
      <path
        d="M12 5L12 19"
        stroke="#323232"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>{" "}
    </g>
  </svg>
);
