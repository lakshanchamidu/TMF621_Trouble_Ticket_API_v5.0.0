import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Component/HomePage";
import ApiTester from "./Component/ApiTester";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apiTester" element={<ApiTester />} />
      </Routes>
    </Router>
  );
}

export default App;
