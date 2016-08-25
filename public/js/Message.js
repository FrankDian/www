//动画方式
function Check(){
    var li=document.getElementById("Main_left").getElementsByTagName("li");
    var index=1;
    for(var i=0;i<li.length;i++){
        li[i].onclick=function(){
            var myIndex=parseInt(this.getAttribute("index"));
            var offset1=-920*(myIndex-index);
            animate(offset1);
        }
    }
}
function animate(offset){
    var list=document.getElementById("left");
    list.style.left=offset+'px';
}

/*左边导航栏定位*/
window.onscroll=function(){
    var left_Nav=document.getElementById("Main_left");
    if(document.body.scrollTop>=120){
        left_Nav.style.position="fixed";
        left_Nav.style.top="0";
    }
    if(document.body.scrollTop<=120){
        left_Nav.style.position="absolute";
        left_Nav.style.top="120px";

    }
}

//系统发布消息框弹出与收回
function Input(){
    var myinput=document.getElementById("input_btn");
    var out=document.getElementById("out");
    var system_input=document.getElementById("System_Input");
    myinput.onclick=function(){

        system_input.style.display="block";
    }
    out.onclick=function(){
        system_input.style.display="none";
    }
}

 /**
  * 作者：FrankDian
	时间：2016-08-24
	描述：增加管理员登录验证
  */
 function checkLogin(){
 	var username = sessionStorage.getItem("username");
 	var password = sessionStorage.getItem("password");
 	if( username == "admin" && password == "admin" ){
 		alert("登陆成功");
 	}else{
 		alert("登陆失败");
 		location="login.html";
 	}
 }

//主函数，处理接收的服务器数据
$(function(){
	checkLogin();//登录验证
    Check();
    Input();
    //建立到服务器的socket连接
    socket = io.connect();
    //监听socket的connect事件，此事件表示连接已经建立
	
	/*
	 * @author FrankDian
	 * @date 2016/08/25
	 * 修改后台在线用户列表bug
	 */
    socket.on('backOnline' ,function( roomID , onlineUsers){
    	console.log("backOnline事件接收");
    	console.log(roomID+"----"+onlineUsers);
    	var tab=document.getElementById(roomID),
    		len = onlineUsers.length;
    	tab.innerHTML ="<tr class='tr_1'><td>用户数目</td><td>用户id</td><td>用户状态</td><td>用户房间</td><td>待定</td><td>操作</td></tr>";
    	console.log(len);
    	for(var i=0 ; i<len ;i++){
    		var j = i+1;
    		console.log(onlineUsers[i]);
    		tr = document.createElement("tr");
    		tr.innerHTML = "<td>"+ len +"</td><td>"+ onlineUsers[i] +"</td><td>在线</td><td>"+ roomID +"</td><td></td><td></td>";
    		tab.appendChild(tr);
    	}
    });
   
    //发送系统消息
    document.getElementById("area_btn").addEventListener('click',function(){
        var messageInput = document.getElementById("SystemInput"),
            msg = messageInput.value,
            obj=document.getElementsByName("test"),//获取checkbox
            check_val="";
        messageInput.value = "";
        messageInput.focus();
        if(msg.trim().length != 0){
        	for(var i=0;i<9;i++){
        	//判断选中的checkbox
        	if(obj[i].checked==true){
        	check_val=obj[i].value;
        	var roomNum=check_val;
            socket.emit('postMsg01' , msg, roomNum );
            }
          }
        }
        
    },false);
    
    /*
     * by:FrankDian
     * data:2016.8.24
     * express:实现左边导航栏动态获取在线人数bug
     */
    //接收在线人数
    socket.emit('adminLogin');
    
    socket.on('onlinePeoples' , function(onlinePeople){
    	console.log("onlinePeoples事件接收 ");
		var textNums = document.getElementsByClassName("textNum");
		for(var i = 0; i < 9 ; i++){
			textNums.item(i).textContent = onlinePeople[i] +"人在线";
		}
	});
	
});

