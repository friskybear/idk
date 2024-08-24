import { Component, createSignal } from "solid-js";

const handle_google_sign_in = () => {
  // Replace CLIENT_ID with your actual Google Client ID
  const clientId = import.meta.env["VITE_CLIENT_ID"];
  const redirectUri = "http://localhost:1420/api/callback/google"; // Set your redirect URI
  const scope = "https://www.googleapis.com/auth/drive.file"; // The scope you need

  const url = `https://accounts.google.com/o/oauth2/v2/auth?response_type=token&client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${encodeURIComponent(scope)}&include_granted_scopes=true`;

  // Redirect to the Google sign-in page
  window.location.href = url;
};

const Login: Component<{}> = (props) => {
  const [auth_code, set_auth_code] = createSignal();

  // Check if the URL contains a token when the component is mounted
  window.addEventListener("load", () => {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get("access_token");
      if (accessToken) {
        set_auth_code(accessToken);
      }
    }
  });

  return <button onClick={handle_google_sign_in}>Sign in with Google</button>;
};

export default Login;
