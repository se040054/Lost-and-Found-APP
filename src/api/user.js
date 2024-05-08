import axios from "axios";

const apiBaseURL = `${process.env.REACT_APP_API_BASE_URL}/users`

export const register = async (form) => {
  try {
    const { data } = await axios.post(`${apiBaseURL}/register`, form) // 資料格式為res.data
    return data;
  } catch (error) {
    return error.response.data //HTTP協議下失敗與成功的API返回架構不同 
  }
}

export const login = async (form) => {
  try {
    const { data } = await axios.post(`${apiBaseURL}/login`, form) // 資料格式為res.data
    return data;
  } catch (error) {
    return error.response.data //HTTP協議下失敗與成功的API返回架構不同 
  }
}

export const authToken = async (token) => {
  try {
    const { data } = await axios.get(`${apiBaseURL}/authToken`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return data
  } catch (error) {
    console.log(error)
    return error.response.data
  }
}

export const getUser = async (id) => {
  try {
    const { data } = await axios.get(`${apiBaseURL}/${id}`)
    return data
  } catch (error) {
    console.log(error)
    return error.response.data
  }



}