$(function(){
	//-------------------建立连接------------------
	var socket = io.connect();
	
	socket.on('onlinePeoples' , function(onlinePeople){
		var BottomTexts = document.getElementsByClassName("BottomText");
		for(var i = 0; i < 9 ; i++){
			BottomTexts.item(i).textContent = onlinePeople[i] +"人在线";
		}
	});
});