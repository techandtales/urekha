const { io } = require("socket.io-client");
const socket = io("http://127.0.0.1:4040");

socket.on("connect", () => {
    console.log("Connected");
    socket.emit("join_jyotisham", { room_id: "test1" });
    fetch('http://127.0.0.1:4040/jyotisham/binnashtakvarga', { 
        method: 'POST', headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ room: 'test1', payload: { date: '15/01/1995', time: '14:30', latitude: 25.594, longitude: 85.137, tz: 5.5, lang: 'en', planet: "Sun" } }) 
    });
});

socket.on("jyotisham_result/test1/binnashtakvarga", (data) => {
    console.log(data);
    process.exit(0);
});
