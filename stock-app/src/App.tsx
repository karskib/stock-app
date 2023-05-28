import { useState } from "react";
import "./App.css";

function App() {
  const [counter, setCounter] = useState<number>(0);

  return (
    <div>
      <button
        onClick={() => {
          setCounter((prev) => prev + 1);
        }}
      >
        Click Me
      </button>
      {counter}
    </div>
  );
}

export default App;
