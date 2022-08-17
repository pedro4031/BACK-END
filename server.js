//https://socket.io/docs/v4/server-initialization/
const express = require("express");
const app = express();

//IMPLEMENTACION
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer);

httpServer.listen(process.env.PORT || 8080, () => console.log("SERVER ON"));

app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	res.sendFile("index.html", { root: __dirname });
});

let chat = [];

io.on("connection", (socket) => {
	chat.push(`Se unió al chat: ${socket.id}`);
	io.sockets.emit("arr-chat", chat);

	socket.on("datos", (data) => {
		chat.push(data);
		io.sockets.emit("arr-chat", chat);
	});
});
