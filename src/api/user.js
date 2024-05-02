import axios, { formToJSON } from "axios";

const apiBaseURL = 'http://localhost:3004/api/users'



export const login = async (form) => {
  // const { account, password, confirmPassword, name } = form
  try {
    const  {data}   = await axios.post(`${apiBaseURL}/register`, form)
    return data.status;
  } catch (error) {
    console.log(error.response.data)
    return error.response.data
  }
}

