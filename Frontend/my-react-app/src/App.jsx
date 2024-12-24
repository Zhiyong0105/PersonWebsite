import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import RootLayout from "./components/Layout";
import Header from "./components/Header";
import Avatar from "./components/Avatar";
import GithubIcon from "./icons/GithubIcon";
import Index from "./pages/Index";
import ListArticle from "./components/ListArticle";
import ShowArticleDetail from "./components/ShowArticleDetail"
import SidebarLayout from "./components/SidebarLayout";
import PrivateRoute from "./components/PrivateRoute";
import Projects from "./components/Projects";
import BlogLayout from "./components/BlogLayout";
import About from "./components/About";

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
          path="/project"
          element={
            <RootLayout>
              <Projects />
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
              <About />
            </RootLayout>
          }
        />
        <Route
          path="/admin/*"
          element={
            <PrivateRoute>
              <SidebarLayout />
            </PrivateRoute>
          }
        />
        <Route
          path="/article"
          element={
            <BlogLayout>
              <ListArticle />
            </BlogLayout>
          }
        />
        <Route path="/article/:id" element={
          <BlogLayout>
            <ShowArticleDetail />
          </BlogLayout>
        } />
      </Routes>
    </Router>
  );
}
