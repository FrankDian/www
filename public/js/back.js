window.onload=function(){
	Check();
	Input();
}
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






