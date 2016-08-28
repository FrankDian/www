/*
 * Created by FrankDian on 2016/8/24.
 */

$(document).ready(function(){
	//按钮变色效果
	$(".btn").click(function(){
		$(this).css("background-color","aquamarine");
		setTimeout(" $('.btn').css('background-color','#337AB7'); ",500);
	});
	
	//输入框变色效果
	var username = document.getElementById("username");
	var password = document.getElementById("password");
	inputChange(username);
	inputChange(password);
	
});
//检查用户名密码是否为空
function check(){
	if( $("#username").val().length > 0 && $("#password").val().length > 0){
		var username = $("#username").val();
		var password = $("#password").val();
		sessionStorage.setItem('username', username );
		sessionStorage.setItem('password', password );
		return true;
	}else{
		alert("用户名或者密码不能为空");
		return false;
	}
}
//输入框变色效果
function inputChange(inputs){
	inputs.onfocus = function(){
		this.style.border="1px solid #66AFE9";
	};
	inputs.onblur = function(){
		this.style.border="1px solid #ccc";
	};
}
