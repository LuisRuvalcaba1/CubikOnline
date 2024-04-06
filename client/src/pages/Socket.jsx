import io from 'socket.io-client'

function Socket() {
    
const socket = io()

console.log(socket)
    return (
        <div>
            <h1>Socket</h1>
        </div>
    )
}

export default Socket;


