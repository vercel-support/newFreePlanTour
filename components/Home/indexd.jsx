import { useState, useRef, useEffect } from "react";
import Linkify from "react-linkify";
import Image from "next/image";
import validator from "validator";

import Logo from "../../assets/logo.png";

import {
  IconCircleNumber1,
  IconCircleNumber2,
  IconCircleNumber3,
} from "@tabler/icons";

const componentDecorator = (href, text, key) => (
  <a className="linkify__text" href={href} key={key} target="_blank">
    {text}
  </a>
);

const months = [
  "Jeder Monat",
  "Januar",
  "Februar",
  "März",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember",
];
const subject = "Tu itinerario ya esta generado";

const Homed = () => {
  const [data, setData] = useState(null);

  const [userInput, setUserInput] = useState("");

  const onUserChangedText = (event) => {
    console.log(event.target.value);
    setUserInput(event.target.value);
  };

  const [nota, setNota] = useState(false);
  const onNotaChangedText = (event) => {
    console.log(event.target.value);
    setNota(event.target.value);
  };

  const [duration, setDuration] = useState(3);
  const [selectedMonth, setSelectedMonth] = useState("Jeder Monat");

  const [apiOutput, setApiOutput] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);

  const [dataw, setDataw] = useState(null);

  const divRef = useRef(null);

  const [emailError, setEmailError] = useState("");
  const [emailOk, setEmailOk] = useState("");
  const validateEmail = (e) => {
    var email = e.target.value;

    if (validator.isEmail(email)) {
      setEmailError("E-Mail Richtig!:)");
      setEmailOk(e.target.value);
    } else {
      setEmailError("ungültige E-Mail!");
    }
  };

  const scrollToDiv = () => {
    window.scrollTo({
      top: divRef.current.offsetTop,
      behavior: "smooth",
    });
  };

  const callGenerateEndpoint = async () => {
    setIsGenerating(true);

    let prompt = `Bitte erstellen Sie eine detaillierte Reiseroute für einen Tagesausflug von ${duration} nach ${userInput} im nächsten ${selectedMonth},
einschließlich des Zeitplans aller Aktivitäten, Attraktionen und Mahlzeiten.
Stellen Sie sicher, dass die Reiseroute eine Mischung aus beliebten Touristenattraktionen, lokalen Erlebnissen und Zeit zum Entspannen enthält.
Außerdem erhalten Sie Vorschläge zum Mittag- und Abendessen in einer Vielzahl verschiedener Restaurants, um die vielfältige kulinarische Szene der Stadt zu erleben.
Fügen Sie für jedes vorgeschlagene Restaurant und jede Attraktion eine Beschreibung, eine Preisspanne und einen Link zu Ihrer offiziellen Website hinzu.
Halten Sie nach Möglichkeit ein maximales Reisegebiet in der Größe von Hokkaido ein, um die Reisezeit zwischen den Städten zu minimieren.
Schließlich beschreibt es das Wetter in diesem Monat und auch 3 Dinge, die man über die Kultur dieses Landes beachten sollte.`;
    /*
   if (nota) {
	prompt += `Además incluye la visita a `
	prompt += nota
   }
   prompt += `Finalmente describe el clima en ese mes, y también 3 cosas para tomar nota sobre la cultura de ese país.`
   
   */
    console.log("Calling OpenAI with prompt...");
    // console.log(prompt)

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    const { output } = data;
    console.log("OpenAI replied...", output.text);

    setApiOutput(`${output.text}`);

    setIsGenerating(false);

    scrollToDiv();
  };

  return (
    <div className="root">
      <div className="flex max-[600px]:flex-col w-full">
        <div className="container-left">
          <div className="header">
            <div className="header-title">
              <h1>freeplantour.com</h1>
            </div>
            <div className="header-subtitle">
              <h2>
                Erzählen Sie uns von Ihrer Reise und wir erstellen sofort eine
                personalisierte Reiseroute. Verschwenden Sie keine Zeit mit der
                Suche, Sie haben die besten Empfehlungen.
              </h2>
            </div>
          </div>
          <div className="prompt-container">
            <div className="flex items-center">
              <IconCircleNumber1 color="rgb(110 231 183)" />
              <span className="ml-2">
                Wohin willst du gehen?<font color="#CA0935">*</font>
              </span>
            </div>
            {
              <input
                type="text"
                placeholder="schreibe dein Schicksal"
                className="prompt-box"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
              />
            }

            <div className="flex w-100 mt-4">
              <div
                className="flex-none mr-6 flex-col items-start"
                style={{ display: "flex", width: "180px" }}
              >
                <div className="flex items-center mb-2">
                  <IconCircleNumber2 color="rgb(110 231 183)" />
                  <span className="ml-2">
                    Wie viele Tage?<font color="#CA0935">*</font>
                  </span>
                </div>
                <input
                  type="number"
                  className="rounded block"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  style={{ width: "180px" }}
                />
              </div>
              <div className="ml-4">
                <div className="flex items-center mb-2">
                  <IconCircleNumber3 color="rgb(110 231 183)" />
                  <span className="ml-2">Monat</span>
                </div>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="prompt-box"
                >
                  <option value="">Jeder Monat</option>
                  {months.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="prompt-buttons">
              <button
                className="pushable py-2 px-4 rounded"
                onClick={callGenerateEndpoint}
                disabled={isGenerating}
              >
                <span className="shadow"></span>
                <span className="edge"></span>
                <div className="front">
                  {isGenerating ? (
                    <div>
                      <span className="loader mr-2"></span>
                      <span>
                        ...VORBEREITUNG...
                        <br />
                        Wenn du das nicht mehr siehst Ihre Anleitung erscheint
                        auf der nächsten Seite
                        <br />
                      </span>
                    </div>
                  ) : (
                    <span className="font-semibold">Generieren</span>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="container-right" ref={divRef}>
          {apiOutput && (
            <div className="output">
              <div className="output-content">
                <p>
                  <Linkify componentDecorator={componentDecorator}>
                    {apiOutput}
                  </Linkify>
                </p>
                <br />
                Wir senden Ihnen Ihren Reiseplan per E-Mail:{" "}
                <input
                  type="text"
                  className="prompt-box"
                  id="userEmail"
                  onChange={(e2) => validateEmail(e2)}
                ></input>
                <br />
                <span style={{ fontWeight: "bold", color: "red" }}>
                  {emailError}
                </span>
                <br />
                <div class="front">
                  <span>
                    <a
                      href={`mailto:${
                        emailOk || "edu@edu.com"
                      }?subject=${encodeURIComponent(
                        subject
                      )}&body=${encodeURIComponent(apiOutput)}`}
                    >
                      Enviar Plan
                    </a>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="badge-container grow">
        <a href="https://gestat.io/" target="_blank" rel="noreferrer">
          <div className="badge">
            <Image src={Logo} alt="Gestat.io logo" style={{ opacity: "0.8" }} />
          </div>
        </a>
      </div>
    </div>
  );
};

export default Homed;
