import { createContext, useContext, useState } from "react";
export const AuthTimerContext = createContext();
import { timerRequest } from "../api/auth";

//import axios from 'axios';

export const useAuthTimer = () =>{
    const context = useContext(AuthTimerContext);
  if (!context) {
    throw new Error("useAuthTimer must be used within an AuthProvider");
  }
  return context;
}

export const TimerProvider = ({children}) => {
    const [time, setTime] = useState('');
    const [scramble, setScramble] = useState('');
    const [session, setSession] = useState('');

    // function checkUser(){
    //     try {
    //         const response = verifyTokenRequest();

    //         console.log(response);
    //         setUser(response.data);
    //     } catch (error) {
    //         console.error('Error checking user:', error);
    //     }
    // }
    const createNewTimer = async (time, scramble, session) => {
        try {            
            const newTimer = {
                time,
                scramble,
                session
            }
            console.log(newTimer);
            const response = await timerRequest(newTimer);
            console.log(response);
        } catch (error) {
            console.error('Error creating timer:', error);
        }
    }   

    const value = {
        time,
        scramble,
        session,
        createNewTimer
    }

    return (
        <AuthTimerContext.Provider value={value}>
            {children}
        </AuthTimerContext.Provider>
    )
}