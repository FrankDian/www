/*
 * Created by FrankDian on 2016/8/24.
 */

$(document).ready(function(){
	$(".btn").click(function(){
		$(this).css("background-color","aquamarine");
		setTimeout("btn()",500);
	});
});

function btn(){
	$(".btn").css("background-color","#337AB7");
}
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
function change(inputs){
	inputs.style.border="1px solid #66AFE9";
}
function change1(inputs){
	inputs.style.border="1px solid #ccc";
}