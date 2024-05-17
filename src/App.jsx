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
  CreateItemPage,
  ItemPage,
  EditItemPage,
} from "./pages";
import React from "react";
import { GlobalStyles } from "./components/common/global";
import { ThemeContextProvider } from "./context/ThemeContext";
import { AuthContextProvider } from "./context/AuthContext";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { FavoriteContextProvider } from "./context/FavoriteContext";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ThemeContextProvider>
          <AuthContextProvider>
            <FavoriteContextProvider>
              <GlobalStyles />
              <Routes>
                <Route path="home" element={<HomePage />} />
                <Route path="login" element={<LoginPage />} />
                {/* users */}
                <Route path="register" element={<RegisterPage />} />
                <Route path="users/:id" element={<ProfilePage />} />
                <Route path="users/:id/edit" element={<EditProfilePage />} />
                <Route
                  path="users/:id/editPassword"
                  element={<EditPasswordPage />}
                />
                {/* merchants */}
                <Route path="merchants/post" element={<CreateMerchantPage />} />
                <Route path="merchants/:id" element={<MerchantInfoPage />} />
                <Route
                  path="merchants/:id/edit"
                  element={<EditMerchantPage />}
                />
                {/* items */}
                <Route path="items/post" element={<CreateItemPage />} />
                <Route path="items/:id" element={<ItemPage />} />
                <Route path="items/:id/edit" element={<EditItemPage />} />
                {/* <Route path="*" element={<Navigate to="home" />} /> */}
              </Routes>
            </FavoriteContextProvider>
          </AuthContextProvider>
        </ThemeContextProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
