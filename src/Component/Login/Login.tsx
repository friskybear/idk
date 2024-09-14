import { useNavigate } from "@solidjs/router";
import { invoke } from "@tauri-apps/api/core";
import axios from "axios";
import { Component, createSignal } from "solid-js";

const client_id = import.meta.env["VITE_CLIENT_ID"];
const redirect_uri = "http://localhost:1420/api/callback/google"; // Set your redirect URI
const scope = "https://www.googleapis.com/auth/drive.file"; // The scope you need

//! TODO: REDESIGN NEEDED

const handle_google_sign_in = () => {
  // Replace CLIENT_ID with your actual Google Client ID

  const response_type = "code"; // Authorization Code Flow

  const url = `https://accounts.google.com/o/oauth2/v2/auth?response_type=${response_type}&client_id=${client_id}&redirect_uri=${encodeURIComponent(
    redirect_uri
  )}&scope=${encodeURIComponent(scope)}&access_type=offline&prompt=consent`;

  // Redirect to the Google sign-in page
  window.location.href = url;
};

async function rust_log_in(token: string, refresh_token: string) {
  const navigate = useNavigate();
  invoke("rand");
  await invoke("google_drive_log_in", {
    clientId: client_id,
    clientSecret: import.meta.env["VITE_CLIENT_SECRET"],
    redirectUrl: redirect_uri,
    token: token,
    refreshToken: refresh_token,
  });
  navigate("/home");
}

const Login: Component<{}> = (props) => {
  // Check if the URL contains a token when the component is mounted
  if (localStorage.getItem("refresh_token")) {
    rust_log_in(
      localStorage.getItem("token")!,
      localStorage.getItem("refresh_token")!
    );
  } else {
    window.addEventListener("load", async () => {
      const code = new URL(window.location.href).searchParams.get("code");
      if (code) {
        const response = await axios.post(
          "https://oauth2.googleapis.com/token",
          {
            code,
            client_id,
            client_secret: import.meta.env["VITE_CLIENT_SECRET"],
            redirect_uri,
            grant_type: "authorization_code",
          }
        );
        const { access_token, refresh_token } = response.data;
        localStorage.setItem("token", access_token);
        localStorage.setItem("refresh_token", refresh_token);
        rust_log_in(access_token, refresh_token);
      }
    });
  }
  const [color, set_color] = createSignal(true);
  return (
    <>
      <button onClick={handle_google_sign_in}>Sign in with Google</button>
      <button
        class={`${color() ? "bg-red-700" : "bg-green-600"} h-20 w-20`}
        onclick={() => {
          set_color((prev) => !prev);
        }}
      ></button>
    </>
  );
};

export default Login;
