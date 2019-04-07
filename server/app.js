const path=require('path');
const http=require('http');
const express=require('express');
const socketIO=require('socket.io');
const publicPath=path.join(__dirname,'../public');
const port=process.env.PORT || 3001;
var app=express();
var server=http.createServer(app);
var io=socketIO(server);
app.use(express.static(publicPath));

io.on('connection',(socket)=>{
	console.log("New User Connected");
	socket.on('disconnect',()=>{
		console.log("User disconnected");
	})
	
	socket.on('createMessage',(message)=>{
	console.log("Message received",message);
	io.emit('newMessage',{
		from:message.from,
		text:message.text,
		createdAt:new Date().getTime()
	})
})
})



server.listen(port,()=>{
	console.log('Server is running...');
})
