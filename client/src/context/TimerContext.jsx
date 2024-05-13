import { createContext, useContext } from "react";
export const AuthTimerContext = createContext();
import { timerRequest, getTimersRequest} from "../api/timer";
import { useAuth } from "./AuthContext";

//import axios from 'axios';

export const useAuthTimer = () =>{
    const context = useContext(AuthTimerContext);
  if (!context) {
    throw new Error("useAuthTimer must be used within an AuthProvider");
  }
  return context;
}

export const TimerProvider = ({children}) => {
  const { user } = useAuth();

  
  const getTimersContext = async () => {
    try {
      const response = await getTimersRequest();
      console.log(response);
      return response;
    } catch (error) {
      throw new Error(`Error fetching timers: ${error.message}`);
    }
  };

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
        getTimersContext,
    }

    return (
        <AuthTimerContext.Provider value={value}>
            {children}
        </AuthTimerContext.Provider>
    )
}