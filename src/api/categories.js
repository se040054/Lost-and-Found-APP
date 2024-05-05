import axios from "axios";

const apiBaseURL = `${process.env.REACT_APP_API_BASE_URL}/categories`

export const getCategories = async () => {
  try {
    const { data } = await axios.get(apiBaseURL)
    return data
  } catch (error) {
    console.log(error)
    return error.response.data
  }

} 