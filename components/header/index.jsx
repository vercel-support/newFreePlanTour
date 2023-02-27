import React from 'react'
import { useRouter } from 'next/router'

const Header = ({ setCurrentLanguage, currentLanguage }) => {
  const router = useRouter()
  return (
    <nav class="front">
      <a
        href="#"
        style={{
          textDecoration: currentLanguage === "es" ? "none" : "underline",
        }}
        onClick={() => setCurrentLanguage("es")}
      >
        ES
      </a>
      {" | "}
      <a
        href="#"
        style={{
          textDecoration: currentLanguage === "en" ? "none" : "underline",
        }}
        onClick={() => setCurrentLanguage("en")}
      >
        EN
      </a>
      {" | "}
      <a
        href="#"
        style={{
          textDecoration: currentLanguage === "de" ? "none" : "underline",
        }}
        onClick={() => setCurrentLanguage("de")}
      >
        DE
      </a>
      {" | "}
      <a
        href="#"
        style={{
          textDecoration: currentLanguage === "fr" ? "none" : "underline",
        }}
        onClick={() => setCurrentLanguage("fr")}
      >
        FR
      </a>
      {" | "}
      <a
        href="#"
        style={{
          textDecoration: currentLanguage === "pt" ? "none" : "underline",
        }}
        onClick={() => setCurrentLanguage("pt")}
      >
        PT
      </a>
      <button
        style={{
          textTransform: "uppercase",
          color: "white",
          backgroundColor: "#00db64",
          padding: 10,
          margin: `0px 10px`,
        }}
        onClick={() => router.push('subscription')}
      >
        Subscribe
      </button>
      &nbsp;&nbsp;
      <a href="http://gestat.io/viajes/Sevilla.pdf" target="_blank">
        Sevilla
      </a>
      &nbsp;&nbsp;
      <a href="http://gestat.io/viajes/FreePlanTour.pdf" target="_blank">
        Seul
      </a>
      <div class="topnav">
        <div id="myLinks">
          <a href="#news">News</a>
          <a href="#contact">Contact</a>
          <a href="#about">About</a>
        </div>
        <a href="javascript:void(0);" class="icon" onclick="myFunction()">
          <i class="fa fa-bars"></i>
        </a>
      </div>
    </nav>
  )
}

export default Header