import { Page } from "./components.uimix.js";
import { Landing } from "./landing.uimix.js";

function App() {
  return (
    <>
      <Page />
      <Landing
        style={{
          width: "100%",
        }}
      />
    </>
  );
}

export default App;
