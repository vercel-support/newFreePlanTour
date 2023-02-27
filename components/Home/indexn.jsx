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
  "Any month",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const subject = "Tu itinerario ya esta generado";

const Homen = () => {
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
  const [selectedMonth, setSelectedMonth] = useState("Any month");

  const [apiOutput, setApiOutput] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);

  const [dataw, setDataw] = useState(null);

  const divRef = useRef(null);

  const [emailError, setEmailError] = useState("");
  const [emailOk, setEmailOk] = useState("");
  const validateEmail = (e) => {
    var email = e.target.value;

    if (validator.isEmail(email)) {
      setEmailError("Email OK!:)");
      setEmailOk(e.target.value);
    } else {
      setEmailError("Email Wrong!");
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

    let prompt = `Please generate a detailed itinerary for a ${duration} day trip to ${userInput} next ${selectedMonth}, including a schedule of all activities, attractions, and meals.
Ensure the itinerary includes a mix of popular tourist attractions, local experiences, and relaxation time.
Additionally, include suggestions for lunch and dinner at a variety of different restaurants to experience the diverse culinary scene of the city.
Include a description, price range, and official website link for each suggested restaurant and attraction.
Keep travel area to a maximum size of Hokkaido if possible to minimize travel time between cities.
Finally, describe the weather in that month and also three cultural notes to take note of in that country.`;
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
              <h1>Freeplantour.com</h1>
            </div>
            <div className="header-subtitle">
              <h2>
                Tell us about your trip and we'll create a customized itinerary
                on the spot. Do not waste time searching, you'll have the best
                recommendations.
              </h2>
            </div>
          </div>
          <div className="prompt-container">
            <div className="flex items-center">
              <IconCircleNumber1 color="rgb(110 231 183)" />
              <span className="ml-2">
                Where do you want to go?<font color="#CA0935">*</font>
              </span>
            </div>
            {
              <input
                type="text"
                placeholder="Write your destiny"
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
                  <span className="ml-2">Month</span>
                </div>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="prompt-box"
                >
                  <option value="">Select a month</option>
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
                        ...COOKING...
                        <br />
                        When you no longer see this,
                        <br />
                        your guide will appear on the next page
                        <br />
                      </span>
                    </div>
                  ) : (
                    <span className="font-semibold">Generate</span>
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

                <span className="output-content">
                  We send you your itinerary by mail:{" "}
                </span>
                <input
                  type="text"
                  className="prompt-box"
                  id="userEmail"
                  onChange={(e2) => validateEmail(e2)}
                ></input>

                <span style={{ fontWeight: "bold", color: "red" }}>
                  {emailError}
                </span>
                <div class="front">
                  <span>
                    <a
                      href={`mailto:${
                        emailOk || "edu@edu.com"
                      }?subject=${encodeURIComponent(
                        subject
                      )}&body=${encodeURIComponent(apiOutput)}`}
                    >
                      Send Plan
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

export default Homen;
