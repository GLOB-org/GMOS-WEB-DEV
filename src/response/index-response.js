import openSocket from "socket.io-client";
const socket = openSocket("https://chats-front.herokuapp.com/");

function connect_socket(cb) {

    // const room = `${buyer_id.toString()}-${seller_id.toString()}`

    socket.emit("send_data_nego_to_admin", {
        seller_id: 20,
        buyer_id: 10,
        room_id: "10-20"
    })

    socket.emit("join_room_nego", {
        room_id: "10-20"
    })

    socket.on('nego_response', data => {
        cb(data);
    })

}

export {
    connect_socket
};
