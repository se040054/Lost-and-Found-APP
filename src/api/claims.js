
import axios from "axios";

const apiBaseURL = `${process.env.REACT_APP_API_BASE_URL}/claims`

const tokenInstance = axios.create({
  baseURL: apiBaseURL,
});

tokenInstance.interceptors.request.use(function (config) {
  const token = localStorage.getItem('apiToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config;
}, function (error) {
  return Promise.reject(error);
});

export const getClaim = async (itemId) => {
  try {
    const { data } = await tokenInstance.get(`${apiBaseURL}/${itemId}`)
    return data
  } catch (error) {
    console.log(error)
    return error
  }
}

// export const postClaim = async (itemId) => {
//   try {
//     const { data } = await tokenInstance.post(itemId)
//     return data
//   } catch (error) {
//     console.log(error)
//     return error
//   }
// }