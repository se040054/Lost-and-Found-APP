import { createContext, useContext, useState } from "react"
import { login, register } from "../api/user"
import * as jose from 'jose'

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
  const [payload, setPayload] = useState(null)

  const registerProvider = async (form) => {
    try {
      const data = await register(form)
      return data; // 不用管成功失敗 前面抓過異常了 
    } catch (error) {
      return error
    }

  }
  const loginProvider = async (form) => {
    try {
      const data = await login(form)
      if (data.status === 'success') {
        const tempPayload = jose.decodeJwt(data.apiData.jwtToken)
        console.log('tempPayload' ,tempPayload)
        if (tempPayload) setPayload(tempPayload)
        else setPayload(null)
      }
      return data;  // 不用管成功失敗 前面抓過異常了 
    } catch (error) {
      console.log(error)
      return error
    }
  }

  return <AuthContext.Provider value={{
    isLogin,
    currentMember:payload,
    login: loginProvider,
    register: registerProvider,
    logout: null,
  }}

  >{children}
  </AuthContext.Provider>
}