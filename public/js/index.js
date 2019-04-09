var socket=io();
socket.on('connect',()=>{
	console.log('Connected');

});
socket.on('disconnect',()=>{
	console.log('Disconnected');
})

socket.on('newMessage',(message)=>{
	console.log('New Message:',message);
	var li=jQuery('<li></li>');
	li.text(`${message.from}:${message.text}`);
	jQuery('#messages').append(li);
})

jQuery('#message-form').on('submit',function(e){
	e.preventDefault();
	socket.emit('createMessage',{
		from:'User',
		text:jQuery('[name=message]').val()
	},function(){

	})
})