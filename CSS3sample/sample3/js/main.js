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
	
	//カード画像の先読み
	var elmCp1Card = document.getElementById("cp1_card");
	var elmCp2Card = document.getElementById("cp2_card");
	for(var i = 1; i <= window.rep; i++){
		var img = document.createElement("img");
		var img2 = document.createElement("img");
		img.src = window["card" + i];
		img2.src = window["card" + i];
		img.id = "cp1_card_img" + i;
		img2.id = "cp2_card_img" + i;
		img.className = "cp1_card_img";
		img2.className = "cp2_card_img";
		elmCp1Card.insertBefore(img, elmCp1Card.firstChild);
		elmCp2Card.insertBefore(img2, elmCp2Card.firstChild);
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
		var an = getComputedStyle(curElm, "").webkitAnimationName
		if(!flg){
			//退避(停止)
			curElm.orgAnimationName = an;
			curElm.style.webkitAnimationName = "dummy";
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
	
	var cntLoop = 0;
	var cntCardNow = window["card_now"];
	var cntCardMax = window["card_max"];
	
	var elmCp1 = document.getElementById("cp1");
	var elmCp1Obj = document.getElementById("cp1_obj");
	var elmCp1Men = document.getElementById("cp1_men")
	var elmCp1Card = document.getElementById("cp1_card");
	var elmCp1Touch = document.getElementById("cp1_touch");
	var elmCp1Timer =  document.getElementById("cp1_timer");
	var elmCp1Timer2 =  document.getElementById("cp1_timer2");
	
	var elmCp2 = document.getElementById("cp2");
	var elmCp2Card = document.getElementById("cp2_card");
	var elmCp2CardImg = document.getElementById("cp2_card_img");
	var elmCp2CntLeft =  document.getElementById("cp2_counter_left");
	var elmCp2Touch = document.getElementById("cp2_touch");
	var elmCp2Timer =  document.getElementById("cp2_timer");
	var elmCp2Thunder1;
	var elmCp2Thunder2;
	
	var elmAllSkip = document.getElementById("all_skip");
	
	//属性色用配列
	var arrPropCol = ["", "r", "g", "b"];


	//cp1スキップ用初期処理
	var arrElmCp1Skip = [elmCp1Obj, elmCp1Timer];
	arrElmCp1Skip = arrElmCp1Skip.concat(Array.prototype.slice.call(document.getElementsByClassName("cp1_skippable")));
	arrElmCp1Skip = arrElmCp1Skip.concat(Array.prototype.slice.call(document.getElementsByClassName("char_sil")));
	
	//初回は左右の兵士の代わりにスクロールする兵士を表示
	elmCp1Men.style.opacity="0";

	/**
	 * cp1処理
	 */
	var doCp1 = function(){
		
		cntLoop++;
		
		//シルエット
		var elmCharSil = document.getElementById("char" + window["chara" + cntLoop]);
	
		//カード画像
		if(cntLoop > 1){
			document.getElementById("cp1_card_img" + (cntLoop - 1)).style.display = "none";
		}
		document.getElementById("cp1_card_img" + cntLoop).style.display = "block";
		elmCp1Card.style.webkitMaskImage = "url(" + elmCharSil.src + ")";

		//アニメーション開始
		document.getElementById('field').style.display = "block";
		elmCp1.style.display = "block";
		elmCharSil.style.display = "block";
	
		//兵士アニメーション
		if(cntLoop === 1){
			document.getElementById("cp1_bg").addEventListener("webkitAnimationEnd", function(e){this.removeEventListener("webkitAnimationEnd", arguments.callee, false);elmCp1Men.style.opacity="1.0";}, false);
		}
	
		//スキップできるように
		addTouchEvent(elmCp1, doCp1Skip);
	
		//cp1後半へ
		elmCp1Timer.addEventListener("webkitAnimationEnd", function(e){this.removeEventListener("webkitAnimationEnd", arguments.callee, false);remTouchEvent(elmCp1, doCp1Skip);doCp1_2();}, false);
		

	
	};
	
	/**
	 * cp1後半の処理
	 * @param {boolean} skipped
	 */
	var doCp1_2 = function(skipped){
		remTouchEvent(elmCp1, doCp1Skip);
		
		document.getElementById("char2_" + window["chara" + cntLoop]).style.display = "block";
		document.getElementById("cp1_card_grad_" + arrPropCol[window["colorType" + cntLoop]]).style.display = "block";
		
		elmCp1Timer2.style.display = "block";
		elmCp1Card.style.display = "block";
		
		//２回目以降はスクロールする兵士たちを表示しない
		document.getElementById("cp1_weapons").style.display = "none";
		document.getElementById("cp1_weapons_l").style.display = "none";
		
		//タッチ画像を表示、タッチでcp1終了処理するように
		if(skipped){
			elmCp1Touch.style.display = "block";
			addTouchEvent(elmCp1, doCp1Touch);
		}
		else{
			elmCp1Timer2.addEventListener("webkitAnimationEnd", function(e){this.removeEventListener("webkitAnimationEnd", arguments.callee, false);addTouchEvent(elmCp1, doCp1Touch);elmCp1Touch.style.display="block";}, false);
		}
		
				
	}
	
	/**
	 * cp1スキップ時の処理
	 */
	var doCp1Skip = function(e){
		
		e.stopPropagation();
		remTouchEvent(elmCp1, doCp1Skip);
		skipAnimation(arrElmCp1Skip);
		elmCp1Men.style.opacity="1.0";
		doCp1_2(true);
	}
	
	/**
	 * cp1タッチ時の処理
	 */
	var doCp1Touch = function(e){
		e.stopPropagation();
		remTouchEvent(elmCp1, doCp1Touch);
		elmCp1Touch.style.display = "none";
		doCp1End();
	};
	
	/**
	 * cp1終了処理
	 */
	var doCp1End = function(){
		
		doCp2();
		
		document.getElementById("cp1_card_grad_" + arrPropCol[window["colorType" + cntLoop]]).style.display = "none";
		elmCp1Timer2.style.display = "none";
		elmCp1Card.style.display = "none";
		elmCp1.style.display = "none";
		document.getElementById("char" + window["chara" + cntLoop]).style.display = "none";
		document.getElementById("char2_" + window["chara" + cntLoop]).style.display = "none";
		
		//スキップされたアニメーションをもとに戻す
		skipAnimation(arrElmCp1Skip, true);
		
	};
	
	
	/**
	 * cp2処理
	 */
	var doCp2 = function(){

		cntCardNow++;
		
		elmCp2Thunder1 = document.getElementById("cp2_thunder1_" + arrPropCol[window["colorType" + cntLoop]]);
		elmCp2Thunder2 = document.getElementById("cp2_thunder2_" + arrPropCol[window["colorType" + cntLoop]]);
		
		//最大カード数を代入
		document.getElementById("cp2_counter_right").innerHTML = cntCardMax;
		
		//雷エフェクト
		elmCp2Thunder1.style.display = "block";
		elmCp2Thunder2.style.display = "block";
	
		//カウンター
		elmCp2CntLeft.style.webkitAnimation = (cntCardNow + 10 >= cntCardMax) ? "a_counter_red 0.67s linear infinite" : "";
		elmCp2CntLeft.innerHTML = cntCardNow;

		//レアカードエフェクト
		document.getElementById("cp2_stars").style.display = (window["rare" + cntLoop]) ? "block" : "none";

		//カード画像
		if(cntLoop > 1){
			document.getElementById("cp2_card_img" + (cntLoop - 1)).style.display = "none";
		}
		document.getElementById("cp2_card_img" + cntLoop).style.display = "block";

		//アニメーション開始
		setTimeout(function(){elmCp2Card.style.display = "block";}, 500);
		
		elmCp1.style.display = "none";
		elmCp2.style.display = "block";
		
		//タッチ画像を表示、タッチでcp2終了処理するように
		elmCp2Timer.addEventListener("webkitAnimationEnd", function(e){this.removeEventListener("webkitAnimationEnd", arguments.callee, false);addTouchEvent(elmCp2, doCp2Touch);elmCp2Touch.style.display="block";}, false);
	};
	
	
	/**
	 * cp2タッチ時の処理
	 */
	var doCp2Touch = function(e){
		e.stopPropagation();
		remTouchEvent(elmCp2, doCp2Touch);
		
		if(cntLoop >= window["rep"]){	
			//メッセージがない時
			if(typeof window["str1_1"] === "undefined"){
				getUrl();
				autoTimer = setTimeout(function(){
					getUrl();
				},8000);
				return;
			}
			//メッセージがある時
			else{
				elmCp2Touch.style.display="none";
				setMsg();
			}
		}
		else{
			elmCp2Touch.style.display="none";
			doCp2End();
		}
		
	};

	/**
	 * cp2終了処理
	 */
	var doCp2End = function(){
		doCp1();
		elmCp2.style.display = "none";
		elmCp2Card.style.display = "none";
		elmCp2CardImg.src = "";
		elmCp2Thunder1.style.display = "none";
		elmCp2Thunder2.style.display = "none";

	};
	
	
	//全スキップ処理
	var doAllSkip = function(e){
		e.stopPropagation();
		
		getUrl(true);
		autoTimer = setTimeout(function(){
			getUrl(true);
		},8000);
		return;
	}
	
	
	//全スキップを可能に
	addTouchEvent(elmAllSkip, doAllSkip);
	
	//カード取得ループ開始
	setTimeout(doCp1,300);

}


//message
function setMsg(){
	var con = document.getElementById('contents');
	con.removeEventListener(action, setMsg, false);
	
	document.getElementById('msg_box').style.display = "block";
	
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
	
	if(typeof window["str"+ ctStr + "_1"] != "undefined"){
		con.addEventListener(action, setMsg, false);
		
	}else{
		con.addEventListener(action, getUrl, false);
		autoTimer = setTimeout(function(){
			getUrl();
		},8000);
	}
	
	skipDef();
}


//message skip
function skipDef(){
	document.getElementById('msg_skip').style.webkitAnimation = "skip_img 0.4s ease-out 0 infinite";
	document.getElementById('skip_img').style.webkitAnimation = "";
	document.getElementById('cp2_touch_touch').style.display = "block";
	document.getElementById('cp2_touch_load').style.display = "none";
}

function skipLoad(){
	document.getElementById('msg_skip').style.webkitAnimation = "";
	document.getElementById('skip_img').style.webkitAnimation = "skip_img2 0.6s linear 0 infinite";
	document.getElementById('cp2_touch_touch').style.display = "none";
	document.getElementById('cp2_touch_load').style.display = "block";
}

function getUrl(isAllSkip){
	clearTimeout(autoTimer);
	
	var con = document.getElementById('contents');
	con.removeEventListener(action, getUrl, false);
	skipLoad();
	
	setTimeout(function(){
		con.addEventListener(action, getUrl, false);
		skipDef();
	},10000);
	
	if(isAllSkip === true){
		location.href = next_url_2;
	}
	else{
		location.href = next_url;
	}
}

