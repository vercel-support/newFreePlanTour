import { useState, useRef } from "react";

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
  "Tous les mois",
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  " Décembre",
];
const subject = "Tu itinerario ya esta generado";

const Homef = () => {
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
  const [selectedMonth, setSelectedMonth] = useState("Cualquier mes");

  const [apiOutput, setApiOutput] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);

  const [dataw, setDataw] = useState(null);

  const divRef = useRef(null);

  const [emailError, setEmailError] = useState("");
  const [emailOk, setEmailOk] = useState("");
  const validateEmail = (e) => {
    var email = e.target.value;

    if (validator.isEmail(email)) {
      setEmailError("adresse e-mail correcte!:)");
      setEmailOk(e.target.value);
    } else {
      setEmailError("email invalide!");
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

    let prompt = `Veuillez générer un itinéraire détaillé pour une excursion d'une journée de ${duration} à ${userInput} au cours du prochain ${selectedMonth},
y compris l'horaire de toutes les activités, attractions et repas.
Assurez-vous que l'itinéraire comprend un mélange d'attractions touristiques populaires, d'expériences locales et de temps pour se détendre.
De plus, incluez des suggestions de déjeuners et de dîners dans une variété de restaurants différents pour découvrir la scène culinaire diversifiée de la ville.
Incluez une description, une fourchette de prix et un lien vers votre site Web officiel pour chaque restaurant et attraction suggérés.
Gardez une zone de voyage maximale de la taille d'Hokkaido, si possible, pour minimiser le temps de trajet entre les villes.
Enfin, il décrit le temps qu'il fait ce mois-là, ainsi que 3 choses à prendre en compte sur la culture de ce pays.`;
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
                Parlez-nous de votre voyage et nous créerons instantanément un
                itinéraire personnalisé. Ne perdez pas de temps à chercher, vous
                aurez les meilleures recommandations.
              </h2>
            </div>
          </div>
          <div className="prompt-container">
            <div className="flex items-center">
              <IconCircleNumber1 color="rgb(110 231 183)" />
              <span className="ml-2">
                Tu veux aller où?<font color="#CA0935">*</font>
              </span>
            </div>
            {
              <input
                type="text"
                placeholder="écris ton destin"
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
                    Combien de jours?<font color="#CA0935">*</font>
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
                  <span className="ml-2">Mois</span>
                </div>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="prompt-box"
                >
                  <option value="">Sélectionnez un mois</option>
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
                        ...PRÉPARATION...
                        <br />
                        Quand tu ne vois plus ça votre guide apparaîtra sur la
                        page suivante
                        <br />
                      </span>
                    </div>
                  ) : (
                    <span className="font-semibold">Produire</span>
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
                Nous vous envoyons votre itinéraire par mail:{" "}
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

export default Homef;
