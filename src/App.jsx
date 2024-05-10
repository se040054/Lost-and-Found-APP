import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  HomePage,
  LoginPage,
  ProfilePage,
  RegisterPage,
  EditProfilePage,
} from "./pages";
import React from "react";
import { GlobalStyles } from "./components/common/global";
import { ThemeContextProvider } from "./context/ThemeContext";
import { AuthContextProvider } from "./context/AuthContext";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ThemeContextProvider>
          <AuthContextProvider>
            <GlobalStyles />
            <Routes>
              <Route path="home" element={<HomePage />}></Route>
              <Route path="login" element={<LoginPage />}></Route>
              <Route path="register" element={<RegisterPage />}></Route>
              <Route path="users/:id" element={<ProfilePage />}></Route>
              <Route
                path="users/:id/edit"
                element={<EditProfilePage />}
              ></Route>
              {/* <Route path="*" element={<Navigate to="home" />} /> */}
            </Routes>
          </AuthContextProvider>
        </ThemeContextProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
