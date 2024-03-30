import io from 'socket.io-client';
import {useState} from "react";
const socket = io("/socket")

function Socket () {
    const [message, setMessage] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        socket.emit('message', message)
    }

  return (
    <div>
      <h1>Socket</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Socket;
