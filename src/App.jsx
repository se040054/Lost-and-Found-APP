import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HomePage, LoginPage, RegisterPage } from "./pages";
import React from "react";
import { GlobalStyles } from "./components/common/global";
import { ThemeContextProvider } from "./context/ThemeContext";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ThemeContextProvider>
          <GlobalStyles />
          <Routes>
            <Route path="home" element={<HomePage />}></Route>
            <Route path="login" element={<LoginPage />}></Route>
            <Route path="register" element={<RegisterPage />}></Route>
            <Route path="*" element={<Navigate to="home" />} />
          </Routes>
        </ThemeContextProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
