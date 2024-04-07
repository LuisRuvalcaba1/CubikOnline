import { useEffect, useState } from "react";
import "./Timer.css";
import { useForm } from 'react-hook-form';
import io from 'socket.io-client';
const socket = io('http://localhost:4000');

function TimerPvP() {
  const {register, handleSubmit} = useForm();
  const onSubmit = handleSubmit((data) => {
    socket.emit('message', data.message);
  });

  useEffect(() => {
    socket.on('received', (data) => {
      console.log(data);
    });
  }, []);

  return(
    <div>
      <form onSubmit={onSubmit}>
        <input type="text" 
        {...register("message", {required: true})}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}

export default TimerPvP;