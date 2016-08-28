//动画方式
function Check(){
    var li=document.getElementById("Main_left").getElementsByTagName("li");
    var index=1;
    for(var i=0;i<li.length;i++){
        li[i].onclick=function(){
            var myIndex=parseInt(this.getAttribute("index"));
            var offset1=-920*(myIndex-index);
            animate(offset1);
            showButton(myIndex);
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
    var myinput=document.getElementById("input_btn"),
        out=document.getElementById("out"),
        system_input=document.getElementById("System_Input"),
        input_button=document.getElementById("input_button"),
        obj=document.getElementsByName("test");//获取checkbox
        input_button.onclick=function(){
        	input_button.value==1?input_button.value=2 : input_button.value=1;
        	for(var i=0;i<9;i++){
             if(input_button.value==1){
                 obj[i].checked=false;//全不选
                 }else{
                 obj[i].checked=true;//全选
               }
            }
        }
    myinput.onclick=function(){
        system_input.style.display="block";
        document.getElementById("loginWrapper").style.display="block";
    }
    out.onclick=function(){
        system_input.style.display="none";
        document.getElementById("loginWrapper").style.display="none";
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
	
	/*
	 * @author FrankDian
	 * @date 2016/08/25
	 * 修改后台在线用户列表bug
	 */
    socket.on('backOnline' ,function( roomID , onlineUsers){
    	var tab=document.getElementById(roomID),
    		len = onlineUsers.length;
    	tab.innerHTML ="<tr class='tr_1'><td>序号</td><td>用户id</td><td>用户状态</td><td>用户房间</td></tr>";
    	for(var i=0 ; i<len ;i++){
    		var j = i+1;
    		tr = document.createElement("tr");
    		tr.innerHTML = "<td>"+ j +"</td><td>"+ onlineUsers[i] +"</td><td>在线</td><td>"+ roomID +"</td>";
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
        Clear();
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
			textNums.item(i).textContent = onlinePeople[i];
		}
	});
	
});

//清除
function Clear(){
	for(var i=0;i<9;i++){
	document.getElementsByName("test")[i].checked=false;
	}
}

function showButton(index){
	var li=document.getElementById("Main_left").getElementsByTagName("li");
		for(var i=0;i<li.length;i++){
			if(li[i].className=="on"){
				li[i].className="";
				break;
			}
		}
		li[index-1].className="on";
	}