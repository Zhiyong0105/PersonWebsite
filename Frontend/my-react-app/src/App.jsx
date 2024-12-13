import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import RootLayout from "./components/Layout";
import Header from "./components/Header";
import Avatar from "./components/Avatar";
import GithubIcon from "./icons/GithubIcon";
import Index from "./pages/Index";
import ListArticle from "./components/ListArticle";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <RootLayout>
              <Home />
            </RootLayout>
          }
        />
        <Route
          path="/home"
          element={
            <RootLayout>
              <Home />
            </RootLayout>
          }
        />
        <Route
          path="/blog"
          element={
            <RootLayout>
              <ListArticle />
            </RootLayout>
          }
        />
        <Route
          path="/message"
          element={
            <RootLayout>
              <Home />
            </RootLayout>
          }
        />
        <Route
          path="/about"
          element={
            <RootLayout>
              <Index />
            </RootLayout>
          }
        />
      </Routes>
    </Router>


    // <Header />
  );
}
