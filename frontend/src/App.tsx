import { Route, Routes } from "react-router-dom";
import "./App.css";

import Chat from "./Components/Chat/Chat";
import TopNavbar from "./Components/TopNavbar/TopNavbar";
import Schema from "./Components/Schema/Schema";

function App() {
  return (
    <div className="App">
      <TopNavbar></TopNavbar>
      <Routes>
        <Route path="/" Component={Chat} />
        <Route path="/schema" Component={Schema} />
      </Routes>
    </div>
  );
}

export default App;
