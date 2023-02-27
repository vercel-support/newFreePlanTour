import React from "react";
import "./styles.css";
import "./font.css";

function App({ Component, ...pageProps }) {
  return <Component {...pageProps} />;
}

export default App;
