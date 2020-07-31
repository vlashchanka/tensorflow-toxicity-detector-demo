import React from "react";
import "./styles.css";

import "@tensorflow/tfjs-backend-webgl";
import * as toxicity from "@tensorflow-models/toxicity";
import { div } from "@tensorflow/tfjs-core";

async function loadModel() {
  // The minimum prediction confidence.
  const threshold = 0.9;
  return toxicity.load(threshold);
}

export default function App() {
  const [value, setValue] = React.useState("");
  const [model, setModel] = React.useState(null);
  const [predictions, setPredictions] = React.useState([]);
  React.useEffect(() => {
    (async function() {
      const loadedModel = await loadModel();
      setModel(loadedModel);
    })();
  }, []);
  const changeTextarea = event => {
    setValue(event.target.value);
    model.classify([event.target.value]).then(resultPredictions => {
      setPredictions(resultPredictions);
      console.log(JSON.stringify(predictions, 0, 2));
    });
  };

  const YesNo = ({ prediction }) => {
    const [no, yes] = prediction.results[0].probabilities;
    return (
      <div>
        <span className={yes > 0.5 ? "green" : ""}>yes ({yes.toFixed(3)})</span>{" "}
        / no ({no.toFixed(3)})
      </div>
    );
  };
  return (
    <div className="App">
      <h1>Toxicity Detector</h1>
      <h2>Start editing to see some magic happen!</h2>
      <textarea onChange={changeTextarea} value={value} />
      {predictions.map(prediction => {
        const [no, yes] = prediction.results[0].probabilities;
        return (
          <div>
            <b className={yes > 0.5 ? "red" : ""}>{prediction.label}</b>
            <YesNo prediction={prediction} />
          </div>
        );
      })}
    </div>
  );
}
