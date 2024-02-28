import { createContext, useContext  } from "react";
export const AuthTimerContext = createContext();
import { timerRequest } from "../api/timer";

//import axios from 'axios';

export const useAuthTimer = () =>{
    const context = useContext(AuthTimerContext);
  if (!context) {
    throw new Error("useAuthTimer must be used within an AuthProvider");
  }
  return context;
}

export const TimerProvider = ({children}) => {
    const createNewTimer = async (timer) => {
        try {        
            const response = await timerRequest(timer);
            console.log(response);
        } catch (error) {
            console.error('Error creating timer:', error);
        }
    }   

    const value = {
        createNewTimer,
    }

    return (
        <AuthTimerContext.Provider value={value}>
            {children}
        </AuthTimerContext.Provider>
    )
}