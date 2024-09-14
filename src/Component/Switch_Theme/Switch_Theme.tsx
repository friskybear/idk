import autoAnimate from "@formkit/auto-animate";
import {
  Accessor,
  Component,
  createEffect,
  createSignal,
  Setter,
  Show,
  useContext,
} from "solid-js";
import { AppManagerContext } from "../../utils/Context";

function change_theme(theme: string) {
  let element = document.getElementsByTagName("html")[0];
  if (element) {
    element.setAttribute("data-theme", theme);
    element.setAttribute("class", theme);
  }
}

const Switch_Theme: Component<{}> = (props) => {
  const app = useContext(AppManagerContext);

  const [window_theme, setWindowTheme] = createSignal(app?.app_manager().theme!);

  createEffect(() => {
    change_theme(window_theme());
  });
  return (
    <section>
      <Show when={window_theme() === "light"}>{sun(setWindowTheme)}</Show>
      <Show when={window_theme() === "dark"}>{moon(setWindowTheme)}</Show>
    </section>
  );
};

export default Switch_Theme;

const moon = (setTheme: Setter<string>) => {
  return (
    <button
      class="drop-shadow-lg shadow-sm  rounded-full btn btn-primary shadow-accent-500 btn-md btn-square"
      onclick={() => setTheme("light")}
    >
      <svg
        fill="#000000"
        height="35"
        width="50"
        version="1.1"
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 352.726 352.726"
      >
        <g>
          <g>
            <g>
              <path
                d="M245.879,1.526c-5.6-2.8-12-1.6-16.8,2.4s-6.8,10-5.2,16c4,16.4,5.6,33.6,4.4,51.6c-5.2,84-72.8,151.2-156.8,156.4
                      c-17.2,1.2-34.4-0.4-51.6-4c-6-1.6-12,0.4-16,5.6c-4,4.8-4.8,11.2-2.4,16.8c30.4,65.2,95.2,106.4,167.2,106.4c3.2,0,6.8,0,10-0.4
                      c92.4-4.8,168.4-81.2,173.6-173.6C356.679,103.126,315.079,33.526,245.879,1.526z M336.279,177.926c-4.4,84.4-74,154-158.4,158.4
                      c-69.2,3.6-132.8-34.4-161.6-96.8c18.8,4.4,37.6,5.6,56.4,4.4c92-6,166-79.6,172-171.6c1.2-19.6-0.4-38.4-4.8-56.4
                      C302.279,45.126,340.279,108.726,336.279,177.926z"
              />
              <path
                d="M242.679,277.526c-3.6,2.4-4.4,7.6-2,11.2c1.6,2.4,4,3.6,6.8,3.6c1.6,0,3.2-0.4,4.4-1.2c30.8-21.6,52.8-52.8,60.8-89.2
                      c0.8-4.4-1.6-8.8-6-9.6c-4.4-0.8-8.4,1.6-9.6,6C289.879,230.726,270.679,258.726,242.679,277.526z"
              />
              <path
                d="M213.479,292.726c-2.4,0.8-4.4,1.6-7.2,2.4c-4.4,1.2-6.8,5.6-5.6,10c1.2,3.6,4.4,6,7.6,6c0.8,0,1.6,0,2.4-0.4
                      c3.6-0.8,6-2,8.8-3.2c4-1.6,6-6.4,4.4-10.4C222.279,292.726,217.479,290.726,213.479,292.726z"
              />
            </g>
          </g>
        </g>
      </svg>
    </button>
  );
};

const sun = (setTheme: Setter<string>) => {
  return (
    <button
      class="drop-shadow-lg shadow-sm  rounded-full btn btn-accent shadow-primary-600 btn-md btn-square"
      onclick={() => setTheme("dark")}
    >
      <svg
        width="40"
        height="50"
        viewBox="0 1 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2V3"
          stroke="#1C274C"
          stroke-width="1.5"
          stroke-linecap="round"
        />
        <path
          d="M12 21V22"
          stroke="#1C274C"
          stroke-width="1.5"
          stroke-linecap="round"
        />
        <path
          d="M22 12L21 12"
          stroke="#1C274C"
          stroke-width="1.5"
          stroke-linecap="round"
        />
        <path
          d="M3 12L2 12"
          stroke="#1C274C"
          stroke-width="1.5"
          stroke-linecap="round"
        />
        <path
          d="M19.0708 4.92969L18.678 5.32252"
          stroke="#1C274C"
          stroke-width="1.5"
          stroke-linecap="round"
        />
        <path
          d="M5.32178 18.6777L4.92894 19.0706"
          stroke="#1C274C"
          stroke-width="1.5"
          stroke-linecap="round"
        />
        <path
          d="M19.0708 19.0703L18.678 18.6775"
          stroke="#1C274C"
          stroke-width="1.5"
          stroke-linecap="round"
        />
        <path
          d="M5.32178 5.32227L4.92894 4.92943"
          stroke="#1C274C"
          stroke-width="1.5"
          stroke-linecap="round"
        />
        <path
          d="M6.34141 10C6.12031 10.6256 6 11.2987 6 12C6 15.3137 8.68629 18 12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C11.2987 6 10.6256 6.12031 10 6.34141"
          stroke="#1C274C"
          stroke-width="1.5"
          stroke-linecap="round"
        />
      </svg>
    </button>
  );
};
