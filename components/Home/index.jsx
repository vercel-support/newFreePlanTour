import { useState, useRef } from "react";

import Linkify from "react-linkify";
import Image from "next/image";
import validator from "validator";

import Logo from "../../assets/logo.png";
import Logo2 from "../../assets/logo2.png";

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
  "Cualquier mes",
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];
const subject = "Tu itinerario ya esta generado";

const Home = () => {
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
      setEmailError("Email Correcto!:)");
      setEmailOk(e.target.value);
    } else {
      setEmailError("Email no válido!");
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

    let prompt = `Por favor, genere un itinerario detallado para un viaje de ${duration} días a ${userInput} en el próximo ${selectedMonth}, 
	 incluyendo la programación horaria de todas las actividades, atracciones y comidas.
Asegúrese de que el itinerario incluya una mezcla de atracciones turísticas populares, experiencias locales y tiempo para relajarse. 
Además, incluya sugerencias para el almuerzo y la cena en una variedad de restaurantes diferentes para experimentar la diversa escena culinaria de la ciudad. 
Incluya la descripición, el rango de precios y un enlace a su Web oficial para cada restaurante y atracción sugerida.
Mantenga un área de viaje máxima del tamaño de Hokkaido, si es posible, para minimizar el tiempo de viaje entre ciudades.
Finalmente describe el clima en ese mes, y también 3 cosas para tomar nota sobre la cultura de ese país.`;
    /*
   if (nota) {
	prompt += `Además incluye la visita a `
	prompt += nota
   }
   prompt += `Finalmente describe el clima en ese mes, y también 3 cosas para tomar nota sobre la cultura de ese país.`
   
   */
    //console.log('Calling OpenAI with prompt...')
    //console.log(prompt)

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
          <div class="row">
            <div class="column">
              <Image
                src={Logo2}
                alt="Free Plan Tour"
                style={{ opacity: "0.8" }}
              />
            </div>
            <div class="column">
              <h2>
                <br />
                Cuéntanos tu viaje y tendrás un itinerario personalizado al
                instante. Como no hay 2 viajes iguales, cada guía generada es
                única.
              </h2>
            </div>
          </div>

          <div className="prompt-container">
            <div className="flex items-center">
              <IconCircleNumber1 color="rgb(110 231 183)" />
              <span className="ml-2">
                ¿Dónde quieres ir?<font color="#CA0935">*</font>
              </span>
            </div>
            {
              <input
                type="text"
                placeholder="Escribe tu destino"
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
                    ¿Cuántos días?<font color="#CA0935">*</font>
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
                  <span className="ml-2">Mes</span>
                </div>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="prompt-box"
                >
                  <option value="">Selecciona un Mes</option>
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
                        ...PREPARANDO...
                        <br />
                        Cuando ya no veas esto
                        <br />
                        tu guía aparecerá en la siguiente página
                        <br />
                      </span>
                    </div>
                  ) : (
                    <span className="font-semibold">Generar</span>
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
                <span style={{ fontWeight: "bold", color: "black" }}>
                  Te mandamos tu itinierario por correo:
                </span>
                <input
                  type="text"
                  style={{ fontWeight: "bold", color: "black" }}
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

export default Home;
