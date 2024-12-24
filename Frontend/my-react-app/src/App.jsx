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
import PrivateElement from './components/PrivateElement';
import Dashboard from "./components/Dashboard";
import ArticleManager from "./components/ArticleManager";
import ArticleEditor from "./components/ArticleEditor";
import UserManager from "./components/UserManager";
import UserCenter from './components/UserCenter';
import Experience from "./components/Experience";

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
        <Route path="/admin/*" element={<PrivateRoute><SidebarLayout /></PrivateRoute>}>
          <Route index element={
            <PrivateElement element={<Dashboard />} requiredRole="admin" />
          } />
          <Route path="user-center" element={<UserCenter />} />
          <Route 
            path="articles" 
            element={<PrivateElement element={<ArticleManager />} requiredRole="admin" />} 
          />
          <Route 
            path="editor" 
            element={<PrivateElement element={<ArticleEditor />} requiredRole="admin" />} 
          />
          <Route 
            path="users" 
            element={<PrivateElement element={<UserManager />} requiredRole="admin" />} 
          />
        </Route>
        <Route
          path="/experience"
          element={
            <RootLayout>
              <Experience />
            </RootLayout>
          }
        />
      </Routes>
    </Router>
  );
}
