import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  HomePage,
  LoginPage,
  ProfilePage,
  RegisterPage,
  EditProfilePage,
  EditPasswordPage,
  CreateMerchantPage,
  MerchantInfoPage,
  EditMerchantPage,
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
              <Route path="home" element={<HomePage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="users/:id" element={<ProfilePage />} />
              <Route path="users/:id/edit" element={<EditProfilePage />} />
              <Route
                path="users/:id/editPassword"
                element={<EditPasswordPage />}
              />
              <Route path="merchants/post" element={<CreateMerchantPage />} />
              <Route path="merchants/:id" element={<MerchantInfoPage />} />
              <Route path="merchants/:id/edit" element={<EditMerchantPage />} />
              {/* <Route path="*" element={<Navigate to="home" />} /> */}
            </Routes>
          </AuthContextProvider>
        </ThemeContextProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
