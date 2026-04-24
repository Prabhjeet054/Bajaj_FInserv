import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function callBFHL(dataArray) {
  try {
    const response = await axios.post(
      `${BASE_URL}/bfhl`,
      { data: dataArray },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 10000
      }
    );
    return { success: true, data: response.data };
  } catch (err) {
    if (err.response) {
      return {
        success: false,
        error: err.response.data?.message || `Server error: ${err.response.status}`
      };
    }
    if (err.request) {
      return {
        success: false,
        error: "Could not reach the server. Check your connection or API URL."
      };
    }
    return { success: false, error: err.message };
  }
}
