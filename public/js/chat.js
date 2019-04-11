var socket=io();

function scrollToBottom(){
	var messages=jQuery('#messages');
	var newMessage=messages.children('li:last-child');
	var clientHeight=messages.prop('client-height');
	var scrollTop=messages.prop('scrollTop');
	var scrollHeight=messages.prop('scrollHeight');
	var newMessageHeight=newMessage.innerHeight();
	var lastMessageHeight=newMessage.prev().innerHeight();

	if(clientHeight+scrollTop+newMessageHeight+lastMessageHeight>=scrollHeight){
		// messages.scrollTop(scrollHeight);
		console.log('Scroll');
	}
}
socket.on('connect',()=>{
	var params=jQuery.deparam(window.location.search);
	socket.emit('join',params,function(err){
		if(err){
			alert(err);
			window.location.href='/';
		}else{
			console.log('No error');
		}
	})
	console.log('Connected');

});
socket.on('disconnect',()=>{
	console.log('Disconnected');
})

socket.on('updateUserList',function(users){
	var ol=jQuery('<ol></ol>');
	users.forEach(function(user){
		ol.append(jQuery('<li></li>').text(user));
	})
	jQuery('#users').html(ol);
})

socket.on('newMessage',(message)=>{
	var formattedTime=moment(message.createdAt).format('h:mm a');
	// console.log('New Message:',message);
	var li=jQuery('<li></li>');
	li.text(`${message.from} ${formattedTime}: ${message.text}`);
	jQuery('#messages').append(li);
	scrollToBottom();
})

socket.on('newLocationMessage',function(message){
	var formattedTime=moment(message.createdAt).format('h:mm a');
	var li=jQuery('<li></li>');
	var a=jQuery('<a target="_blank">My Current Location</a>');
	li.text(`${message.from} ${formattedTime}: `);
	a.attr('href',message.url);
	li.append(a);
	jQuery('#messages').append(li);
	scrollToBottom();
})

jQuery('#message-form').on('submit',function(e){
	e.preventDefault();
	var messageTextBox=jQuery('[name=message]');
	socket.emit('createMessage',{
		text:messageTextBox.val()
	},function(){
		messageTextBox.val('');
	})
})

var locationButton=jQuery('#send-location');
locationButton.on('click',function(){
	if(!navigator.geolocation){
		return alert('Geolocation not supported by your browser');
	}

	locationButton.attr('disabled','disabled').text('Sending Location...');

	navigator.geolocation.getCurrentPosition(function(position){
		locationButton.removeAttr('disabled').text('Send Location');
		socket.emit('createLocationMessage',{
			latitude:position.coords.latitude,
			longitude:position.coords.longitude
		});
	},function(){
		locationButton.removeAttr('disabled').text('Send Location');
		alert('Unable to fetch location.');
	})
})