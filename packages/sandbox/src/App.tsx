import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { Button, Page } from "./uimix";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <Button
        ref={(e) => console.log(e)}
        textProps={{
          children: "Hello, world!",
          ref: (e) => {
            console.log(e);
          },
        }}
        // TODO
        //textAs={(props) => <p {...props} />}
        onClick={() => setCount((count) => count + 1)}
      />
      <Page
        buttonProps={{
          onClick: () => setCount((count) => count + 1),
        }}
        stackProps={{
          // TODO: typing
          // @ts-ignore
          textProps: {
            children: "Override inner item",
          },
        }}
      />
    </div>
  );
}

export default App;
