import axios from "./axios.js";

export const timerRequest = async (newTimer) => {
    try {
        const response = await axios.post(`/timerul`, newTimer);
        return response;
    } catch (error) {
        console.error('Error creating timer:', error);
    }
}
