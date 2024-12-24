import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import BlogLayout from "./components/BlogLayout";
import ListArticle from "./components/ListArticle";
import ShowArticleDetail from "./components/ShowArticleDetail";
import SidebarLayout from "./components/SidebarLayout";
import PrivateRoute from "./components/PrivateRoute";
import PrivateElement from './components/PrivateElement';
import Dashboard from "./components/Dashboard";
import ArticleManager from "./components/ArticleManager";
import ArticleEditor from "./components/ArticleEditor";
import UserManager from "./components/UserManager";
import UserCenter from './components/UserCenter';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route
          path="/article"
          element={
            <BlogLayout>
              <ListArticle />
            </BlogLayout>
          }
        />
        <Route 
          path="/article/:id" 
          element={
            <BlogLayout>
              <ShowArticleDetail />
            </BlogLayout>
          } 
        />

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

        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/project" element={<Navigate to="/#project" replace />} />
        <Route path="/about" element={<Navigate to="/#about" replace />} />
        <Route path="/experience" element={<Navigate to="/#experience" replace />} />
      </Routes>
    </Router>
  );
}
