/**
 * New node file
 */
var express = require('express'),
	path = require('path'),
	//A router object is an isolated instance of middleware and routes.
	//You can think of it as a “mini-application,”
	router = express.Router(),
	app = express(),
	http = require('http').Server(app),
	io = require('socket.io')(http);

//房间信息，二维,几号房间有哪些人
var roomInfo = {};

//指定静态文本存储的地方
app.use(express.static( path.join(__dirname, 'public' ) ) );
app.set("views", path.join(__dirname , 'views'));//A directory or an array of directories for the application's views.
app.set("view engine","hbs");//The default engine extension to use when omitted.

 // 获取请求建立socket连接的url
  // 如: http://localhost:3000/room/room_1, roomID为room_1
io.on("connection" ,function(socket){//用户连接事件
	var url = socket.request.headers.referer;//socket.request.headers.cookie
	var splited = url.split("/");
	var roomID = splited[splited.length -1];//房间ID
	var user = "";//用户名
	
	//1.用户加入	
//	socket.on('join' , function(username){
	socket.on('login' , function(username){
		user = username;
		//更新房间信息
		//加入房间
		socket.join(roomID);
		if( !roomInfo[roomID] ){
			roomInfo[roomID] = [];
		}else if( roomInfo[roomID].indexOf(user) > -1 ){
			socket.emit('nickExisted');
		}else{
		roomInfo[roomID].push(user);
		/*
		 * 增加
		 */
		socket.emit('loginSuccess');
		
		//通知房内人员
//		io.to(roomID).emit('systemMsg', user + "加入了房间", roomInfo[roomID]);
		io.to(roomID).emit('systemMsg', user , roomInfo[roomID].length , 'login' );
		console.log(user + "加入了" + roomID);
		}
		});
	
	//2.用户离开
//	socket.on('leave' , function(){
//		socket.emit('disconnect');
//	});
	socket.on('disconnect' , function(){
		//update the room message
		var index = roomInfo[roomID].indexOf(user);
		if(index != -1 ){
			roomInfo[roomID].splice( index , 1);//删除此用户
		}
		socket.leave(roomID);
		//通知房内人员
//		io.to(roomID).emit('systemMsg', user + "退出了房间", roomInfo[roomID]);
		socket.broadcast.emit('systemMsg', user ,roomInfo[roomID].length, 'logout');
		console.log(user + "退出了" + roomID);
	});
	
	//3.接收消息并发送到响应的房间
//	socket.on('message',function(msg){
	socket.on('postMsg',function(msg,color){
		//如果用户不在此房间内则不发送消息
		if( roomInfo[roomID].indexOf(user) === -1){
			return false;
		}
		console.log(user + ":" + msg);
		io.to(roomID).emit( 'newMsg', user , msg , color );
//		io.to(roomID).emit( 'msg', user , msg );
	});
	
	//new image get
    socket.on('img', function(imgData, color) {
        socket.broadcast.emit('newImg', socket.nickname, imgData, color);
    });
    
});

	

//房间页面
//Renders a view and sends the rendered HTML string to the client. Optional parameters:
router.get( '/room/:roomID' , function(req,res){//同 app.get
	var roomID = req.params.roomID;
	
	//渲染页面数据 views/room.hbs
	res.render('room',{//pass a local variable to the view
		roomID : roomID,
		users : roomInfo[roomID]
	});
});

// only requests to /* will be sent to our "router"
//所有的网址请求都会通过router处理
app.use('/',router);

http.listen(8888,function(){
	console.log('listening on port 8888');
});
