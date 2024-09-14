import { invoke } from "@tauri-apps/api/core";
import {
  Accessor,
  Component,
  createEffect,
  createResource,
  createSignal,
  For,
  on,
  Setter,
} from "solid-js";
import PreviewData from "./PreviewData/PreviewData";

const MAXIMUM_DATA_REQUESTED = 20;

interface Data {
  name: string;
  id: string;
  description: string;
  key_words: string[];
  pinned: boolean;
}
const [data, set_data] = createSignal<Data[]>([], {
  equals: false,
});
const [visible_data, set_visible_data] = createSignal(0);

const delete_fn = (index: number) => {
  set_data((prev) => {
    prev.splice(index, 1);
    set_visible_data((prev) => prev - 1);
    return prev;
  });
};
const pin_fn = (index: number) => {
  set_data((prev) => {
    let status = prev[index]["pinned"];
    status ? (prev[index]["pinned"] = false) : (prev[index]["pinned"] = true);
    return prev;
  });
};
const DataSection: Component<{
  status: {
    request_data: Accessor<boolean>;
    set_request_data: Setter<boolean>;
  };
}> = (props) => {
  const [finished, set_finished] = createSignal(false);

  createEffect(
    on(props.status.request_data, (_) => {
      if (props.status.request_data() && !finished()) {
        const visibleDataLength = visible_data();
        set_visible_data(visibleDataLength + MAXIMUM_DATA_REQUESTED);
        invoke("get_data_titles", { start: visibleDataLength })
          .then((res) => {
            let result = res as Data[];
            if (result) {
              set_data((prev) => {
                return [...prev, ...result];
              });
            }
            if (result.length != MAXIMUM_DATA_REQUESTED) {
              set_finished(true);
            }

            set_visible_data(data().length);
            props.status.set_request_data(false);
          })
          .catch((error) => {
            console.error("Failed to fetch data titles:", error);
            props.status.set_request_data(false);
          });
      }
    })
  );

  return (
    <div
      id="content_container"
      class=" gap-5 flex justify-center items-center flex-wrap flex-grow mb-5 mt-10"
    >
      <For each={Array.from({ length: visible_data() })}>
        {(key, index) => (
          <>
            {!data()[index()] ? (
              <div class="bg-background-50 flex flex-col gap-y-5 rounded-2xl min-w-64 w-1/6 min-h-52 h-72 p-5 m-2 ">
                <div class="skeleton h-12 w-28 pb-1"></div>
                <div class="skeleton h-12 w-full pb-1"></div>
                <div class="skeleton h-12 w-full pb-1"></div>
                <div class=" skeleton h-full w-full mt-2 rounded-2xl" />
              </div>
            ) : (
              <>
                <PreviewData
                  index={index()}
                  data={data()[index()]}
                  on_delete={delete_fn}
                  on_pin={pin_fn}
                />
              </>
            )}
          </>
        )}
      </For>
    </div>
  );
};
export default DataSection;
