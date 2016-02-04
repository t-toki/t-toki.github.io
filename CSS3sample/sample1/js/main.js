var action;
var ctStr = 1;

window.onload = init;

//init
function init(){
	touch();

	if(debug == 0){
		document.getElementById('contents').addEventListener(action, function(e){
			e.preventDefault();
		}, false);
	}
	
	var ua = navigator.userAgent;
	if (ua.indexOf('Android') > 0) {
		var onresize = function(){
			//レイアウト再計算を誘発させる
			document.body.style.paddingLeft = '1px';
			setTimeout(function(){
				document.body.style.paddingLeft = 0;
			},0);
		};
		window.addEventListener("resize",onresize,false);
		//GalaxyS2でresizeが発生しない対策
		if (/SC-02C|SC-03D/.test(ua)) {
			var w = screen.width;
			setInterval(function(){
				if (w != screen.width){
					w = screen.width;
					onresize();
				}
			},500);
		}
	}

	setImg();
	setPreload();
	
	try{
		//GREE用
		greepf.requestScrollTo(0, 0);
	}
	catch(e){}
}

//スマフォ判定
function touch(){
	var touchFlg = false;
	if (navigator.userAgent.indexOf('iPhone') > 0 || navigator.userAgent.indexOf('iPad') > 0 || navigator.userAgent.indexOf('iPod') > 0 || navigator.userAgent.indexOf('Android') > 0) {
		touchFlg = true;
	}
	if (touchFlg == false) {
		action = 'click';
	} else {
		action = 'touchstart';
	}
}

//画像先読み登録
function setPreload(){

	var imgList = [];	
	imgList = document.getElementsByTagName('img');
	
	var checkStatus = function(){
		var ct = 0;
		for(var i=0; i<imgList.length; i++){
			if(imgList[i].complete){
				ct++;
			}
		}
		if(ct == imgList.length){
			setTimeout(gameStart, 300);
		}
		if(ct < imgList.length){
			setTimeout(checkStatus, 100);
		}
	}
	checkStatus();
}

//set img
function setImg(){
	if(debug == 1){
		var path;
		var imgList = document.getElementsByTagName('img');
		for(var i=0; i<imgList.length; i++){
			path = decodeURI(imgList[i].src); 
			path = path.replace('{{image_base_path}}', '.');  
			imgList[i].src = path;
		}
	}
	
	
	//BGラインの複製
	var nodeDiv = document.getElementById("cp1_bg_obj1").cloneNode(true);
	nodeDiv.id="cp1_bg_obj2";
	document.getElementById("cp1").insertBefore(nodeDiv, document.getElementById("cp1_bg_obj1"));
	
}

/**
 * タッチイベントを追加
 */
function addTouchEvent(elm, func){
	elm.addEventListener(action, func, false);
}

/**
 * タッチイベントを削除
 */
function remTouchEvent(elm, func){
	elm.removeEventListener(action, func);
}


/**
 * アニメーションの停止・再設定
 * @param {HTMLElement Array} arrElm
 * @param {boolean} flg 退避したアニメーションを元に戻す
 */
var skipAnimation = function(arrElm, flg){

	var len = arrElm.length;
	for(var i = 0; i < len; i++){
		var curElm = arrElm[i];
		var an = getComputedStyle(curElm, "").webkitAnimationName;
		if(!flg){
			//退避(停止)
			curElm.orgAnimationName = an;
			curElm.style.webkitAnimation = "dummy 0s linear";
		}
		else if(an === "dummy"){
			//元に戻す
			curElm.style.webkitAnimationName = curElm.orgAnimationName;
		}
	}
}


/**
 * Android4か調べる 
 */
function checkAndroid4(){
	if(navigator.userAgent.indexOf('Android 4.0') > 0) {
		return true;
	}
	else{
		return false;
	}
}


/**
 * 指定したclassNameのエレメントを配列で取得
 * @return {Array}
 */
var getArrElmsByClassName = function(className){
	return Array.prototype.slice.apply(document.getElementsByClassName(className));
}


//gameStart
function gameStart(){

	var elmCon = document.getElementById('contents');
	var elmCp1 = document.getElementById('cp1');
	var elmCp1Bg = document.getElementById('cp1_bg');
	var elmCp1Ball = document.getElementById('cp1_ball');
	var elmCp1Obj = document.getElementById('cp1_obj');
	var elmCp1Camp = document.getElementById('cp1_camp');
	var elmCp1Particles1 = document.getElementById('cp1_particles1');
	var elmCp1Particles2 = document.getElementById('cp1_particles2');
	var elmCp1Light = document.getElementById('cp1_light');
	var elmCp1White = document.getElementById('cp1_white');
	var elmCp1Black = document.getElementById('cp1_black');
	
	var elmCp2 = document.getElementById('cp2');
	var elmCp2Camp = document.getElementById('cp2_camp');
	var elmCp2WaveBg = document.getElementById('cp2_wave_bg');
	var elmCp2Obj1 = document.getElementById('cp2_obj1');
	var elmCp2Text1 = document.getElementById('cp2_text1');
	var elmCp2Obj2 = document.getElementById('cp2_obj2');
	var elmCp2Obj2Anim = document.getElementById('cp2_obj2_anim');
	var elmCp2Text2_3 = document.getElementById('cp2_text2_3');
	var elmCp2Obj3 = document.getElementById('cp2_obj3');
	var elmCp2PlayerBox = document.getElementById('cp2_player_box');
	var elmCp2Obj3Timer = document.getElementById('cp2_obj3_timer');
	var elmCp2Obj4 = document.getElementById('cp2_obj4');
	var elmCp2White = document.getElementById('cp2_white');
	
	var elmStarsBox = document.getElementById('stars_box');
	
	var siCp2;
	
	var elmTouch = document.getElementById('touch');
	
	/**
	 * cp1処理
	 */
	var doCp1 = function(){
		addTouchEvent(elmCon, doCp1_3);
		
		elmCp1Ball.addEventListener("webkitAnimationEnd", function(e){
			elmCp1Ball.style.display = "none";
			elmCp1Bg.style.display = "none";
			elmCp1White.style.display = "block";
			elmCp1Camp.style.display = "block";
			elmCp1Obj.style.display = "block";
		}, false);
		
		
		
		//cp1中盤へ
		elmCp1Particles1.addEventListener("webkitAnimationEnd", doCp1_2, false);
		
		elmCp1.style.display = "block";
	}
	
	
	/**
	 * cp1中盤処理
	 */
	var doCp1_2 = function(){
		remTouchEvent(elmCon, doCp1_3);
		
		elmCp1Bg.style.display = "none";
		elmCp1White.style.display = "none";
		elmCp1Black.style.display = "none";
		elmCp1Particles1.style.display = "none";
		elmCp1Particles2.style.display = "none";
		
		elmCp1Obj.style.display = "block";
		elmTouch.style.display = "block";
		
		doCp1_3();
		
	}
	
	var doCp1_3 = function(){
		remTouchEvent(elmCon, doCp1_3);
		addTouchEvent(elmCon, doCp2);
		
		elmTouch.style.display = "block";
	}
	
	/**
	 * cp2処理
	 */
	var doCp2 = function(){
		remTouchEvent(elmCon, doCp2);

		elmCp2White.addEventListener("webkitAnimationEnd", function(e){
			elmCp2Obj1.style.display = "block";
			elmCp2White.style.display = "none";
			addTouchEvent(elmCon, doCp2_2);
		}, false);
		
		setMsg(true);
		
		elmCp2White.style.display = "block";
		elmCp2.style.display = "block";
		elmCp1.style.display = "none";
		
	}
	
	var doCp2_2 = function(){
		remTouchEvent(elmCon, doCp2_2);
		
		elmCp2Obj1.className = "cp2_obj1_ani";
		elmCp2Camp.className = "cp2_camp_ani";
		
		elmCp2Obj1.addEventListener("webkitAnimationEnd", function(e){
			elmCp2Obj1.style.display = "none";
			elmCp2Obj2.style.display = "block";
		}, false);
		
		
		elmCp2Text2_3.addEventListener("webkitAnimationEnd", function(e){
			e.currentTarget.removeEventListener("webkitAnimationEnd", arguments.callee, false);
			addTouchEvent(elmCon, doCp2_3);
		}, false);
			
		setMsg(true);
		
	}
	
	var doCp2_3 = function(){
		remTouchEvent(elmCon, doCp2_3);
		
		elmCp2Obj2Anim.className = "cp2_obj2_anim_ani";
		elmCp2Obj2Anim.addEventListener("webkitAnimationEnd", function(e){
			elmCp2Obj2Anim.style.display = "none";
			elmCp2Obj3.style.display = "block";
		}, false);
		
		//キャラの色変わり
		for(var i = 1; i <= 11; i++){
			document.getElementById("cp2_player_b" + i).addEventListener("webkitAnimationEnd", function(e){
				e.currentTarget.parentNode.getElementsByClassName("cp2_player_a")[0].style.display = "none";
				e.currentTarget.parentNode.getElementsByClassName("cp2_player_c")[0].style.display = "block";
				e.currentTarget.parentNode.getElementsByClassName("cp2_player_d")[0].style.display = "block";
			}, false);
		}
		
		//ループして定期的に再描画
		var arrPlayerA = getArrElmsByClassName("cp2_player_a");
		var arrPlayerC = getArrElmsByClassName("cp2_player_c");
		var arrPlayerD = getArrElmsByClassName("cp2_player_d");
		
		elmCp2PlayerBox.addEventListener("webkitAnimationEnd", function(e){
			if(e.currentTarget === e.target){
				elmCp2PlayerBox.style.display = "none"
				elmCp2PlayerBox.style.webkitAnimation = "dummy 0s linear";
			}
		}, false);
		
		elmCp2Obj3Timer.addEventListener("webkitAnimationEnd", function(e){
			elmCp2PlayerBox.style.webkitAnimation = "a_fade_out 0.4s linear";
			elmCp2PlayerBox.style.opacity = 0;
			setTimeout(function(){
				for(var i = 0; i < 11; i++){
					arrPlayerA[i].style.display = "block";
					arrPlayerC[i].style.display = "none";
					arrPlayerD[i].style.display = "none";
				}
				elmCp2PlayerBox.style.opacity = 1;
				elmCp2PlayerBox.style.display = "block";
			}, 1500);
		}, false);
		
		addTouchEvent(elmCon, doCp2_4);
		
		setMsg(true);
	}
	
	var doCp2_4 = function(){
		remTouchEvent(elmCon, doCp2_4);
		addTouchEvent(elmCon, doCp2_5);
		setMsg(true);
	}
	
	
	var doCp2_5 = function(){
		remTouchEvent(elmCon, doCp2_5);
		
		elmStarsBox.style.display = "block";
		elmCp2WaveBg.style.display = "none";
		
		elmCp2Obj4.style.display = "block";
		elmCp2Obj2.style.display = "none";
		elmCp2Obj3.style.display = "none";
		
		setMsg();
	}
	
	
	document.getElementById('field').style.display = "block";
	doCp1();
	
}


//message
function setMsg(flgOnlyDisp){
	var con = document.getElementById('contents');

	document.getElementById('msg_box').style.display = "block";
	setTimeout(function(){
		document.getElementById('msg_skip').style.opacity = 1;
	},200);
	
	var msg_txt = document.getElementById('msg_txt');
	msg_txt.innerHTML = "";
	
	var msg;
	var i = 1;
	while(typeof window["str"+ ctStr + "_" + i] != "undefined"){
		msg = document.createElement('div');
		msg.className = 'str';
		msg.innerHTML = window["str"+ ctStr + "_" + i];
		msg_txt.appendChild(msg);
		i++;
	}
	ctStr++;
	
	if(flgOnlyDisp === true){
		skipDef();
		return true;
	}
	
	if(typeof window["str"+ ctStr + "_1"] != "undefined"){
		con.addEventListener(action, setMsg, false);
	}
	else{
		con.removeEventListener(action, setMsg, false);
		con.addEventListener(action, getUrl, false);
	}
	
	skipDef();
}

//message skip
function skipDef(){
	document.getElementById('msg_skip').style.webkitAnimation = "ball_skip 0.18s ease-in 0 infinite alternate";
	document.getElementById('ball_mask').style.webkitTransform = "rotate(90deg)";
}

function skipLoad(){
	document.getElementById('msg_skip').style.webkitAnimation = "";
	document.getElementById('ball_mask').style.webkitTransform = "rotate(0)";
}

function getUrl(){
	var con = document.getElementById('contents');
	con.removeEventListener(action, getUrl, false);
	skipLoad();
	
	setTimeout(function(){
		con.addEventListener(action, getUrl, false);
		skipDef();
	},10000);
	
	location.href = next_url;
}
