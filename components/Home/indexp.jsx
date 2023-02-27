import { useState, useEffect, useRef } from "react";
import Linkify from "react-linkify";
import Image from "next/image";
import validator from "validator";
import fetch from "node-fetch";
import {
  IconCircleNumber1,
  IconCircleNumber2,
  IconCircleNumber3,
  IconCircleNumber4,
} from "@tabler/icons";
import Logo2 from "../../assets/logo2.png";

const componentDecorator = (href, text, key) => (
  <a className="linkify__text" href={href} key={key} target="_blank">
    {text}
  </a>
);

const months = [
  "Cualquiera",
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
const subject = "Tu itinerario ya está generado";
const budget = ["€", "€€", "€€€"];

const Home = () => {
  const [data, setData] = useState(null);
  const [userInput, setUserInput] = useState("");
  const onUserChangedText = (event) => {
    console.log(event.target.value);
    setUserInput(event.target.value);
  };

  const [nota, setNota] = useState("");
  const onNotaChangedText = (event) => {
    console.log(event.target.value);
    setNota(event.target.value);
  };

  const [duration, setDuration] = useState(3);
  const [selectedMonth, setSelectedMonth] = useState("Cualquiera");
  const [selectedBudget, setSelectedBudget] = useState("");
  const [apiOutput, setApiOutput] = useState("");
  const [info, setInfo] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);

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

  useEffect(() => {
    document.title = "Generador de Itinerarios";
  }, []);

  const scrollToDiv = () => {
    window.scrollTo({
      top: divRef.current.offsetTop,
      behavior: "smooth",
    });
  };

  const callGenerateEndpoint = async () => {
    setIsGenerating(true);
    let prompt = `Genera un itinerario detallado para un viaje de ${duration} días a ${userInput} en ${selectedMonth}, 
    incluye la programación horaria de todas las actividades, atracciones y comidas.
    El itinerario tiene que ser una mezcla de atracciones turísticas populares, experiencias locales y tiempo para relajarse. 
    Además, incluye sugerencias para el almuerzo y la cena en una variedad de restaurantes diferentes para experimentar la diversa escena culinaria de la ciudad. 
    Incluye la descripción, el rango de precios y un enlace a su sitio web oficial para cada restaurante y atracción sugerida.`;

    if (nota) {
      prompt += `El itinerario debe tener un plan `;
      prompt += nota;
    }

    if (selectedBudget === "€") {
      prompt += ` Ajusta el itinerario a un precio bajo.`;
    }
    if (selectedBudget === "€€") {
      prompt += ` Ajusta el itinerario a un precio medio.`;
    }
    if (selectedBudget === "€€€") {
      prompt += ` Ajusta el itinerario a un precio alto.`;
    }

    prompt += ` Mantén un área de viaje máxima del tamaño de Hokkaido, si es posible, para minimizar el tiempo de viaje entre ciudades. Finalmente, describe el clima en ese mes, y también tres cosas a tener en cuenta sobre la cultura del país.`;

    // console.log('Calling OpenAI with prompt...');
    // console.log(prompt);

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

    // WikiVoyage

    fetch(
      `https://en.wikivoyage.org/w/api.php?origin=*&format=json&formatversion=2&action=query&list=prefixsearch&pssearch=${userInput}`
    )
      .then((res) => {
        if (!res.ok) {
          console.log(`Unable to fetch data: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        const page = data.query.pages;
        const pageId = Object.keys(data.query.pages)[0];
        setInfo(page[pageId]);
      })
      .catch((error) => {
        console.error(error);
      });

    setIsGenerating(false);

    scrollToDiv();
  };

  return (
    <div className="root">
      <div className="flex max-[600px]:flex-col w-full">
        <div className="container-left">
          <div className="row">
            <a href="https://gestat.io/" target="_blank" rel="noreferrer">
              <div className="column">
                <Image
                  src={Logo2}
                  alt="Free Plan Tour"
                  style={{ opacity: "0.8" }}
                />
              </div>
            </a>
            <div className="column">
              <h2>
                <br />
                Cuéntanos tu viaje y tendrás un itinerario personalizado al
                instante. Como no hay dos viajes iguales, cada guía generada es
                única.
              </h2>
            </div>
          </div>
          <div className="prompt-container">
            <div className="flex items-center">
              <IconCircleNumber1 color="rgb(110 231 183)" />
              <span className="ml-2">
                ¿Dónde quieres ir?
                <font color="#CA0935">*</font>
              </span>
            </div>
            {
              <input
                type="text"
                placeholder="Escribe tu destino"
                className="prompt-box"
                value={userInput}
                onChange={onUserChangedText}
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
                    ¿Días?
                    <font color="#CA0935">*</font>
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

              <div className="ml-3">
                <div className="flex items-center mb-2">
                  <IconCircleNumber3 color="rgb(110 231 183)" />
                  <span className="ml-2">Presupuesto</span>
                </div>
                <select
                  value={selectedBudget}
                  onChange={(e) => setSelectedBudget(e.target.value)}
                  className="prompt-box"
                >
                  <option value=""></option>
                  {budget.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="ml-4">
              <div className="flex items-center mb-2">
                <IconCircleNumber4 color="rgb(110 231 183)" />
                <span className="ml-2">Mes</span>
              </div>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="prompt-box"
              >
                <option value="">Cualquiera</option>
                {months.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div className="ml-4">
              <div className="flex items-center mb-2">
                <IconCircleNumber4 color="rgb(110 231 183)" />
                <span className="ml-2">Notas</span>
              </div>
              <input
                type="text"
                className="prompt-box"
                value={nota}
                onChange={onNotaChangedText}
              />
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
              <div className="output-content">
                {info && (
                  <div>
                    <span style={{ fontWeight: "bold", color: "black" }}>
                      {info.extract}
                    </span>
                  </div>
                )}
              </div>
              <span style={{ fontWeight: "bold", color: "black" }}>
                <br />
                Te mandamos tu itinerario por correo:
              </span>
              <input
                type="text"
                style={{ fontWeight: "bold", color: "black" }}
                id="                userEmail"
                onChange={(e2) => validateEmail(e2)}
              />
              <br />
              <span style={{ fontWeight: "bold", color: "red" }}>
                {emailError}
              </span>

              <div className="front">
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
  );
};

export default Home;
