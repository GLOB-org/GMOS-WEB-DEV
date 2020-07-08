import openSocket from "socket.io-client";
//const socket = openSocket("http://localhost:5000/");
//const socket = openSocket("http://18.141.184.60/response/alert");
const socket = openSocket("http://18.141.184.60/");
//const socket = openSocket.connect('http://18.141.184.60', {path:'/response/alert'})

//const socket = openSocket("http://18.141.184.60/socket.io/?EIO=3&transport=websocket");

// ws://18.141.184.60/socket.io/?EIO=3&transport=polling&t=NCeb578
// ws://<heroku app name>.herokuapp.com/socket.io/?EIO=4&transport=websocket

function connect_socket(cb) {
    socket.on('GCM01', message => {
        console.log(message);
        cb(message);
    });
}

export {
    connect_socket
};
