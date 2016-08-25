/**
 * 
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
var roomInfo = [];
//在线人数信息，记录每个房间有多少人
var onlinePeople = new Array(9);

//指定静态文本存储的地方
app.use(express.static( path.join(__dirname, 'public' ) ) );
app.set("views", path.join(__dirname , 'views'));//A directory or an array of directories for the application's views.
app.set("view engine","hbs");//The default engine extension to use when omitted.

 // 获取请求建立socket连接的url
  // 如: http://localhost:3000/room/room_1, roomID为room_1
io.on("connection" ,function(socket){//用户连接事件
	var url = socket.request.headers.referer;
	var splited = url.split("/");
	var roomID = splited[splited.length -1];//房间ID
	var user = "";//用户名
	/*
	 * @author FrankDian
	 * @date 2016/08/24
	 * 修改
	 * @date 2016/08/25
	 * 修改后台在线用户列表bug
	 */
	//后台在线总人数和在线人数列表的更新
	socket.on('adminLogin',function(){
		var JsonStr = "";
		for (var i = 0; i<9 ;i++) {
			var j = i+1;
			var roomid = "room_"+j;
			if( roomInfo[roomid] == undefined ){
				roomInfo[roomid] = [];
				onlinePeople[i] = 0;
			}else{
				onlinePeople[i] = roomInfo[roomid].length;
				io.sockets.emit('backOnline', roomid , roomInfo[roomid]);
			}
		}
		io.sockets.emit( 'onlinePeoples' , onlinePeople);
	});
	
	
	//1.用户加入
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
			socket.emit('loginSuccess',user);
			
		/*
		 * @author FrankDian 
		 * @date 2016/08/24
		 * 修改
		 */
			//通知房内人员
			io.to(roomID).emit('system', user , roomInfo[roomID].length, 'login' );
		
		
			//后台在线总人数的更新
			for (var i = 0;i<9;i++) {
				var j = i+1;
				var roomid = "room_"+j;
				if(roomInfo[roomid] == undefined ){
					roomInfo[roomid] = [];
					onlinePeople[i] = 0;
				}else{
					onlinePeople[i] = roomInfo[roomid].length;
				}
			}
			io.sockets.emit( 'onlinePeoples' , onlinePeople);
			
		/*
		 * @author FrankDian 
		 * @date 2016/08/25
		 * 修改
		 */
		//在线人数列表的更新
		io.sockets.emit('backOnline', roomID , roomInfo[roomID]);
			
			console.log(user + "加入了" + roomID);
			//在线人数列表更新
			var onlineUsers = roomInfo[roomID];
			io.to(roomID).emit("online" , onlineUsers );
		}
		});
		
	//2.用户离开
	socket.on('disconnect' , function(){
		//update the room message
		
		/*
		 * @author FrankDian 
		 * @date 2016/08/24
		 * 修改
		 */
//		var index = roomInfo[roomID].indexOf(user);
		if(user != null ){
			var index = roomInfo[roomID].indexOf(user);
		}else{
			var index = -1;
		}
		
		
		if(index != -1 ){
			roomInfo[roomID].splice( index , 1);//删除此用户
		}
		socket.leave(roomID);
		//通知房内人员
		/*
		 * @author FrankDian 
		 * @date 2016/08/24
		 * 修改
		 */
		io.to(roomID).emit('system', user , roomInfo[roomID].length, 'logout' );
			
		console.log(user + "退出了" + roomID);
		
		//后台在线总人数和在线人数列表的更新
			for (var i = 0;i<9;i++) {
				var j = i+1;
				var roomid = "room_"+j;
				if(roomInfo[roomid] == undefined ){
					roomInfo[roomid] = [];
					onlinePeople[i] = 0;
				}else{
					onlinePeople[i] = roomInfo[roomid].length;
				}
			}
		io.sockets.emit( 'onlinePeoples' , onlinePeople);
		/*
		 * @author FrankDian 
		 * @date 2016/08/25
		 * 修改
		 */
		//在线人数列表的更新
		io.sockets.emit('backOnline', roomID , roomInfo[roomID]);
		
		
		//在线人数列表更新
		var onlineUsers = roomInfo[roomID];
		io.to(roomID).emit("online" , onlineUsers );
		
	});
	
	//3.接收消息并发送到响应的房间
	socket.on('postMsg',function(msg,color){
		//如果用户不在此房间内则不发送消息
		if( roomInfo[roomID].indexOf(user) === -1){
			return false;
		}
		console.log(user + ":" + msg);
		io.to(roomID).emit( 'newMsg', user , msg , color );
	});
	
	/*
	 * @author:zzj
	 * date:2016.8.24
	 * express:接收后台发的消息
	 */
	socket.on('postMsg01',function(msg,roomNum){
		io.to(roomNum).emit('newMsg01', msg);
	});
	
	//上传新照片
    socket.on('img', function(imgData, color) {
        io.to(roomID).emit('newImg', user , imgData, color);
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
app.use('/',router);

http.listen(8888,function(){
	console.log('listening on port 8888');
});
