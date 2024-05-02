import { createContext, useContext, useState } from "react"
import { login } from "../api/user"

const defaultAuthContext = {
  isLogin: null,
  currentMember: null,
  login: null,
  register: null,
  logout: null
}

const AuthContext = createContext(defaultAuthContext)

export const useAuth = () => useContext(AuthContext)

export const AuthContextProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(null)
  const [currentMember, setCurrentMember] = useState(null)

  const loginProvider = async (form) => {
    const status =  await login(form)
    if (status === 'success'){
    }
    return status;
  }

  return <AuthContext.Provider value={{
    isLogin,
    currentMember,
    login: loginProvider,
    register: null,
    logout: null,
  }}

  >{children}
  </AuthContext.Provider>
}