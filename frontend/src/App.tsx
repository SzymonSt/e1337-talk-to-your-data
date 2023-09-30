import { Route, Routes } from "react-router-dom";
import "./App.css";

import Chat from "./Components/Chat/Chat";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" Component={Chat} />
      </Routes>
    </div>
  );
}

export default App;
