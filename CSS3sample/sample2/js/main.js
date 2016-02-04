var action;
var ctStr = 1;
var autoTimer;

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
	
	//GREE用
	greepf.requestScrollTo(0, 0);
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
	imgListLen = imgList.length;
	var checkStatus = function(){
		var ct = 0;
		for(var i=0; i<imgListLen; i++){
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
	
	setPreload();
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

//gameStart
/**
 * 開始
 */
function gameStart(){
	
	var elmCon = document.getElementById('contents');
	var elmCp1 = document.getElementById('cp1');
	var elmCp1Bg = document.getElementById('cp1_bg');
	var elmCp1DoorImgL = document.getElementById('cp1_door_img_l');
	var elmCp1DoorImgR = document.getElementById('cp1_door_img_r');
	var elmCp1DoorEff = document.getElementById('cp1_door_eff');
	var elmCp1DoorEff2 = document.getElementById('cp1_door_eff2');
	var elmCp1Black = document.getElementById('cp1_black');
	var elmCp1White = document.getElementById('cp1_white');
	
	var elmCp2 = document.getElementById('cp2');
	var elmCp2Bg = document.getElementById('cp2_bg');
	var elmCp2Angel = document.getElementById('cp2_angel');
	var elmCp2Particle1 = document.getElementById('cp2_particle1');
	var elmCp2Particle2 = document.getElementById('cp2_particle2');
	var elmCp2Feather1 = document.getElementById('cp2_feather1');
	var elmCp2Feather2 = document.getElementById('cp2_feather2');
	var elmCp2Title = document.getElementById('cp2_title');
	var elmCp2Stars = document.getElementById('cp2_stars');
	var elmCp2White = document.getElementById('cp2_white');
	
	/**
	 * cp1処理
	 */
	var doCp1 = function(){
	
		//スキップ可能に
		addTouchEvent(elmCon, skipCp1);
		
		//cp1後半へ
		elmCp1Bg.addEventListener("webkitAnimationEnd", function(e){
			e.currentTarget.removeEventListener("webkitAnimationEnd", arguments.callee, false);
			setTimeout(function(){doCp1_2();}, 600);
		}, false);
		
		
		//表示開始
		elmCp1.style.display = "block";
			
	}
	
	/**
	 * cp1後半の処理
	 */
	var doCp1_2= function(){

		//後半用のアニメーションに差し替え
		elmCp1Bg.style.webkitAnimation = "a_cp1_bg2 1.3s ease-in 1ms";
		elmCp1DoorImgL.style.webkitAnimation = "a_cp1_door 1.3s linear 2ms";
		elmCp1DoorImgR.style.webkitAnimation = "a_cp1_door 1.3s linear 3ms";
		elmCp1DoorEff.style.display = "block";
		elmCp1DoorEff2.style.display = "block";
		
		setTimeout(function(){elmCp1White.style.display = "block";}, 850);
		
		//cp2へ
		elmCp1White.addEventListener("webkitAnimationEnd", function(e){
			e.currentTarget.removeEventListener("webkitAnimationEnd", arguments.callee, false);
			doCp2();
			elmCp1.style.display = "none";
		}, false);
		
		
	}
	
	
	/**
	 * スキップ時の処理
	 */
	var skipCp1 = function(){
		doCp2();
	}

	/**
	 * cp2処理
	 */	
	var doCp2 = function(){
		remTouchEvent(elmCon, skipCp1);
		
		elmCp2White.addEventListener("webkitAnimationEnd", function(e){
			e.currentTarget.removeEventListener("webkitAnimationEnd", arguments.callee, false);
			setTimeout(function(){elmCp2Title.style.display = "block";}, 360);
			elmCp2Particle1.style.display = "block";
			elmCp2Particle2.style.display = "block";
			elmCp2Feather1.style.display = "block";
			elmCp2Feather2.style.display = "block";
		}, false);
		
		elmCp2Bg.addEventListener("webkitAnimationEnd", function(e){
			e.currentTarget.removeEventListener("webkitAnimationEnd", arguments.callee, false);
			elmCp2Stars.style.display = "block";
		}, false);
		
		elmCp2Feather2.addEventListener("webkitAnimationEnd", function(e){
			e.currentTarget.removeEventListener("webkitAnimationEnd", arguments.callee, false);
			setTouch();
		}, false);

		setTimeout(function(){elmCp2Angel.style.display = "block";}, 100);
		elmCp2.style.display = "block";
		elmCp1.style.display = "none";
		
	}
	
	
	//表示開始
	document.getElementById("field").style.display = "block";
	doCp1();

	
}


//touch enter
function setTouch(){
	skipDef();
	document.getElementById('touch').style.display = "block";
	document.getElementById('contents').addEventListener(action, getUrl, false);
	autoTimer = setTimeout(function(){
		getUrl();
	},8000);
}

function skipDef(){
	document.getElementById('touch_touch').style.display = "block";
	document.getElementById('touch_load').style.display = "none";
}

function skipLoad(){
	document.getElementById('touch_touch').style.display = "none";
	document.getElementById('touch_load').style.display = "block";
}

function getUrl(){
	clearTimeout(autoTimer);
	
	var con = document.getElementById('contents');
	con.removeEventListener(action, getUrl, false);
	skipLoad();
	
	setTimeout(function(){
		con.addEventListener(action, getUrl, false);
		skipDef();
	},10000);
	
	location.href = next_url;
}
