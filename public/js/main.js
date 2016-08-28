
$(function(){
	var username = '';
	var that = this;
	//-------------------建立连接------------------
	var socket = io.connect();
	
	//-------------------设置昵称------------------
	socket.on("connect",function(){
		document.getElementById("info").textContent = "请设置一个昵称";
		document.getElementById("nickWrapper").style.display = "block";
		document.getElementById("nicknameInput").focus();
	});
    //昵称被占用
    socket.on('nickExisted', function() {
        document.getElementById("info").textContent = "昵称已被占用,请另外输入一个";
    });
    //给名称提交按钮添加提交事件
	document.getElementById("loginBtn").addEventListener('click',function(){
    	var username = document.getElementById("nicknameInput").value;
    	if( username.trim().length != 0 ){
    		socket.emit("login",username);
    	}else{
    		document.getElementById("nicknameInput").focus();
    	}
    },false);

    //给输入昵称的输入框加入提交事件
    document.getElementById("nicknameInput").addEventListener('keyup', function(e) {
        if (e.keyCode == 13) {
            var username = document.getElementById("nicknameInput").value;
            if (username.trim().length != 0) {
                socket.emit('login', username);
            }
        }
    }, false);
    //发生错误
    socket.on("error",function(err){
    	if( document.getElementById("loginWrapper").style.display == "none" ){
    		document.getElementById("status").textContent ="连接失败!";
    	}else{
    		document.getElementById("info").textContent = "连接失败!";
    	}
    });
    //提交成功
    socket.on('loginSuccess', function(username) {
    	document.getElementById("username").textContent = username;
        document.title = document.getElementById('nicknameInput').value;
        document.getElementById('loginWrapper').style.display = 'none';
        document.getElementById('messageInput').focus();
    });
    //通知房内人员
    socket.on("system",function(username , roomUsers , type){
    	/*
		 * @author FrankDian 
		 * @date 2016/08/24
		 * 修改
		 */ 
		var msg = username + (type == "login" ? "加入了房间" : "离开了房间");
		displayNewMsg("管理员", msg , "red");
    	document.getElementById("status").textContent =roomUsers +"个用户在线";
    });
    //更新在线人员
    socket.on("online" ,function(onlineUsers){
    	var container = document.getElementById("OM-middle");
    	container.innerHTML = "";
    	var onlineh2 = document.createElement("h2");
    	onlineh2.innerHTML = "当前在线用户";
    	container.appendChild(onlineh2);
    	for (var i=0 ; i<onlineUsers.length ;i++) {
    		usersOnline = document.createElement("p");
    		usersOnline.innerHTML = "<span class='users'>"+ onlineUsers[i]  +"</span>";
    		container.appendChild(usersOnline);
    		container.scrollTop = container.scrollHeight;
    	}
    });
    
    //----------------发送消息------------------
    //按钮发送
    document.getElementById("sendBtn").addEventListener('click',function(){
    	var messageInput = document.getElementById("messageInput"),
    		msg = messageInput.value,
    		color = document.getElementById("colorStyle").value;
    	messageInput.value = "";
    	messageInput.focus();
    	if( msg.trim().length != 0){
    		socket.emit('postMsg' , msg ,color );
    		return;
    	}
    },false);
    //enter发送
    document.getElementById("messageInput").addEventListener("keyup" , function(e){
    	var messageInput = document.getElementById("messageInput"),
    		msg = messageInput.value,
    		color = document.getElementById("colorStyle").value;
    	if(e.keyCode == 13 && msg.trim().length != 0){
    		messageInput.value = "";
    		socket.emit("postMsg", msg , color);
    	}
    },false);
    
    
    
    
    //----------------接收消息------------------
   	socket.on('newMsg', function(user, msg, color) {
        displayNewMsg(user, msg, color);
    });
	socket.on('newMsg01', function(msg) {
		displayNewMsg01(msg);
	});
    socket.on('newImg', function(user, img, color) {
        displayImage(user, img, color);
    });
    
    
    //----------------清除历史记录------------------
    document.getElementById("clearBtn").addEventListener("click" , function(){
    	document.getElementById("historyMsg").innerHTML = "";
    }, false);
    
    
    //----------------发送图片------------------
    document.getElementById("sendImage").addEventListener("change" , function(){
    	if(this.files.length != 0){
    		//将图片读取为base64格式的字符串形式
    		var file = this.files[0],
    			reader = new FileReader(),
    			color = document.getElementById("colorStyle").value;
    		if( !reader ){
    			/*
    			 * @author FrankDian
    			 * @date 2016/08/24
    			 * 修改
    			 */
    			displayNewMsg('管理员', '你的浏览器不支持文件读取!' ,'red');
    			this.value = "";
    			return;
    		};
    		reader.onload = function(e){
    			this.value = "";
    			socket.emit('img' , e.target.result , color);
    		}
    		reader.readAsDataURL(file);
    	}
    },false);
    
    //----------------选择emoji表情------------------
    initialEmoji();
    document.getElementById("emoji").addEventListener('click',function(e){
    	var emojiwrapper = document.getElementById("emojiWrapper");
    	emojiwrapper.style.display = "block";
    	e.stopPropagation();//阻止冒泡
    },false);
    //收起表情页面
    document.body.addEventListener('click', function(e) {
        var emojiwrapper = document.getElementById('emojiWrapper');
        if (e.target != emojiwrapper) {
            emojiwrapper.style.display = 'none';
        };
    });
	//判断是否点击到了图片
	document.getElementById("emojiWrapper").addEventListener('click' ,function(e){
		var target = e.target;
		if( target.nodeName.toLowerCase() == "img" ){
			var messageInput = document.getElementById("messageInput");
			messageInput.focus();
			messageInput.value = messageInput.value + '[emoji:' +target.title + ']';
		};
	},false);
	

});

//显示新信息
function displayNewMsg(user , msg , color){
	var container = document.getElementById("historyMsg"),
		msgToDisplay = document.createElement("p"),
		date = new Date().toTimeString().substr(0,8),
		msg = showEmoji(msg);//将表情添加入语句
		console.log("表情已添加入语句");
	msgToDisplay.style.color = color || "#000";
	msgToDisplay.innerHTML = user + "<span class='timespan'>( "+ date + "):</span>" + msg;
	container.appendChild(msgToDisplay);
	container.scrollTop = container.scrollHeight;
};
function displayNewMsg01(msg){
	var container = document.getElementById("OM-foot"),
		msgToDisplay = document.createElement("p"),
		date = new Date().toTimeString().substr(0,8),
		msg = showEmoji(msg);//将表情添加入语句
	msgToDisplay.style.color="red";
	/*
	 * @author FrankDian
	 * @date 2016/08/24
	 * 修改
	 */
	msgToDisplay.innerHTML = "管理员" + "<span class='timespan'>( "+ date + "):</span>" + msg;
	container.appendChild(msgToDisplay);
	container.scrollTop = container.scrollHeight;
};

//将消息中的表情替代符转化为表情
function showEmoji(msg){
    var match, result = msg,
        reg = /\[emoji:\d+\]/g,
        emojiIndex,
        totalEmojiNum = document.getElementById('emojiWrapper').children.length;
    while (match = reg.exec(msg)) {
        emojiIndex = match[0].slice(7, -1);
        if (emojiIndex > totalEmojiNum) {
            result = result.replace(match[0], '[X]');
        } else {
            result = result.replace(match[0], '<img class="emoji" src="../imgs/emoji/' + emojiIndex + '.gif" />');
        };
    };
    return result;
}

//初始化Emoji表情
function initialEmoji(){
	var emojiContainer = document.getElementById("emojiWrapper"),
		docFragment = document.createDocumentFragment();
	for (var i=69 ; i>0 ; i--) {
		var emojiItem = document.createElement('img');
		emojiItem.src = '../imgs/emoji/' + i + '.gif';
		emojiItem.title = i;
		docFragment.appendChild(emojiItem);
	};
	emojiContainer.appendChild(docFragment);
}

//展示图片
function displayImage(user , imgData , color){
	var container = document.getElementById("historyMsg"),
		msgToDisplay = document.createElement("p"),
		date = new Date().toTimeString().substr(0,8);
	msgToDisplay.style.color = color || "#000";
	msgToDisplay.innerHTML = user + "<span class ='timespan'>(" + date + "): </span><br /> <a href='" + imgData +"' target ='_blank'><img src=' " + imgData +"'/></a>";
	container.appendChild(msgToDisplay);
	container.scrollTop = container.scrollHeight;
}




















