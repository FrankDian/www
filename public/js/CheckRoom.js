$(function(){
	//-------------------建立连接------------------
	var socket = io.connect();
	
	/*
     * by:FrankDian
     * data:2016.8.27
     * express:实现左边导航栏动态获取在线人数bug
     */
    //接收在线人数
    socket.emit('adminLogin');
	
	socket.on('onlinePeoples' , function(onlinePeople){
		var BottomTexts = document.getElementsByClassName("BottomText");
		for(var i = 0; i < 9 ; i++){
			BottomTexts.item(i).textContent = onlinePeople[i] +"人在线";
		}
	});
});