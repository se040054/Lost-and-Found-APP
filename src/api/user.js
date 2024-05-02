import axios, { formToJSON } from "axios";

const apiBaseURL = 'http://localhost:3004/api/users'



export const login = async (form) => {
  // const { account, password, confirmPassword, name } = form
  try {
    const  {data}   = await axios.post(`${apiBaseURL}/register`, form) // 資料格式為res.data
    return data;
  } catch (error) {
    return error.response.data //HTTP協議下失敗與成功的API返回架構不同 
  }
}

