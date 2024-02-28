import { createContext, useContext  } from "react";
export const AuthTimerContext = createContext();
import { timerRequest, getTimersRequest} from "../api/timer";

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

    const getTimers = async () => {
        try {
            const response = await getTimersRequest();
            console.log(response);
        } catch (error) {
            console.error('Error getting timers:', error);
        }
    }

    const value = {
        createNewTimer,
        getTimers
    }

    return (
        <AuthTimerContext.Provider value={value}>
            {children}
        </AuthTimerContext.Provider>
    )
}