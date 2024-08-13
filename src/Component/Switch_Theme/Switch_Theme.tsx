import { Component, createSignal } from "solid-js";

const Switch_Theme: Component<{}> = (props) => {
  const [theme, SetTheme] = createSignal("dark");
  return (
    <button
      class="rounded-full btn btn-primary btn-md btn-square"
      onclick={() => {
        let element = document.getElementsByTagName("html")[0];
        if (element) {
          let attr = element.getAttribute("data-theme");
          if (attr === "dark") {
            element.setAttribute("data-theme", "light");
            element.setAttribute("class", "light");
          } else {
            element.setAttribute("data-theme", "dark");
            element.setAttribute("class", "dark");
          }
        }
      }}
    ></button>
  );
};

export default Switch_Theme;
