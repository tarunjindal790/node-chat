var socket=io();
socket.on('connect',()=>{
	console.log('Connected');

});
socket.on('disconnect',()=>{
	console.log('Disconnected');
})

socket.on('newMessage',(message)=>{
	console.log('New Message:',message)
})