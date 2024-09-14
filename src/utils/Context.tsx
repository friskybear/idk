import {
  Accessor,
  createContext,
  createSignal,
  JSX,
  ParentComponent,
  Setter,
} from "solid-js";
import { AppManager } from "./utils";

export const AppManagerContext = createContext<{
  app_manager: Accessor<AppManager>;
  set_app_manager: Setter<AppManager>;
}>();

export const Provider: ParentComponent = (props) => {
  const [app_manager, set_app_manager] = createSignal(new AppManager({}));
  return (
    <AppManagerContext.Provider value={{ app_manager, set_app_manager }}>
      {props.children}
    </AppManagerContext.Provider>
  );
};
