import React, { useState } from "react";
//components
import Home from "../components/Home/index";
import Homen from "../components/Home/indexn";
import Homef from "../components/Home/indexf";
import Homep from "../components/Home/indexp";
import Homed from "../components/Home/indexd";
import Header from "../components/header/index";

function HomePage() {
  const [currentLanguage, setCurrentLanguage] = useState("es");
  return (
    <div>
      <Header
        setCurrentLanguage={setCurrentLanguage}
        currentLanguage={currentLanguage}
      />
      {currentLanguage === "es" && <Home />}
      {currentLanguage === "en" && <Homen />}
      {currentLanguage === "de" && <Homed />}
      {currentLanguage === "fr" && <Homef />}
      {currentLanguage === "pt" && <Homep />}
    </div>
  );
}

export default HomePage;
