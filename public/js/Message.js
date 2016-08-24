//动画方式
function Check(){
    var li=document.getElementById("Main_left").getElementsByTagName("li");
    var index=1;
    console.log(li.length);
    for(var i=0;i<li.length;i++){
        li[i].onclick=function(){
            var myIndex=parseInt(this.getAttribute("index"));
            console.log(myIndex);
            var offset1=-920*(myIndex-index);
            console.log(offset1);
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
    console.log(document.body.scrollTop);
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

    socket.on('system01', function(nickName,roomUsers, countUsers, type) {
        //判断用户是连接还是离开以显示不同的信息
        var msg = nickName,
            sta=(type == "login" ? "joined" : "left"),
            count=roomUsers,
            num=countUsers.length,
            a=count.substr(5,1),
            tr = document.createElement('tr'),
            tab=document.getElementById(count);
        if(sta=="joined"){
            for(var i=0;i<4;i++){
                var trNum=tab.rows.length;
                var td=document.createElement('td');
                if(i==0){
                    td.innerHTML=trNum;
                }
                if(i==1){
                    td.innerHTML=msg;
                }
                if(i==2){
                    td.innerHTML=sta;
                }
                if(i==3){
                    td.innerHTML=count;
                }
                tr.appendChild(td);
            }
            tab.appendChild(tr);
            var len=tab.rows.length;
        }else{
            var len=tab.rows.length;
            for(var i=0;i<len;i++){
                console.log(i);
            }
            document.getElementById(count).deleteRow(num+1);
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
     * by:zzj
     * data:2016.8.24
     * express:实现左边导航栏动态获取在线人数与给指定房间发送系统消息
     */
    //接收在线人数
    socket.emit('adminLogin');
    socket.on('onlinePeoples' , function(onlinePeople){
		var textNums = document.getElementsByClassName("textNum");
		for(var i = 0; i < 9 ; i++){
			textNums.item(i).textContent = onlinePeople[i] +"人在线";
		}
	});

});