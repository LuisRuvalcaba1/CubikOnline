import { createContext, useContext, useState } from "react";
export const AuthTimerContext = createContext();
import { timerRequest, getTimerByIdRequest} from "../api/timer";

//import axios from 'axios';

export const useAuthTimer = () =>{
    const context = useContext(AuthTimerContext);
  if (!context) {
    throw new Error("useAuthTimer must be used within an AuthProvider");
  }
  return context;
}

export const TimerProvider = ({children}) => {
    const [timer, setTimer] = useState([]);
    const createNewTimer = async (timer) => {
        try {        
            const response = await timerRequest(timer);
            console.log(response);
        } catch (error) {
            console.error('Error creating timer:', error);
        }
    }   

    const getTimers = async (timer) => {
        try {
          const response = await getTimerByIdRequest(timer);
          return response; // Devuelve la respuesta completa
        } catch (error) {
          throw new Error(`Error fetching timers: ${error.message}`);
        }
      };

    const value = {
        timer,
        createNewTimer,
        getTimers
    }

    return (
        <AuthTimerContext.Provider value={value}>
            {children}
        </AuthTimerContext.Provider>
    )
}