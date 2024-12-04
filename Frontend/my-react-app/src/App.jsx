import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RootLayout from "./components/layout";
import Home from "./pages/Home";
import About from "./pages/Project";
// import Contact from "./pages/Contact";

function App() {
  return (
    <Router>
      <RootLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/project" element={<About />} />
          {/* <Route path="/contact" element={<Contact />} /> */}
        </Routes>
      </RootLayout>
    </Router>
  );
}

export default App;
