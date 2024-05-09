import axios from "axios";

const apiBaseURL = `${process.env.REACT_APP_API_BASE_URL}/items`

export const getItems = async ({ page = 1, category = null, search = null }) => {
  try {
    console.log(apiBaseURL)
    const { data } = await axios.get(`${apiBaseURL}`, {
      params: {
        page,
        category,
        search
      }
    })
    return data
  } catch (error) {
    console.log(error)
    return error.response.data
  }


}