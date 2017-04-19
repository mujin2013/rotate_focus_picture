//这是一个立即执行函数，当页面一加载就会执行该函数
var loopPlayerInit=(function(){
	var $butLeft=null,
	    $butRight=null,
	  	$butPlay=null,
		$imglist=null,
		origin='232px 648px',  //前者是单张图片的宽度，后者根据情况调（只是为了将图片的中心点往下移）
		originImg='232px 680px',
		imgAll=createImg([
					['./images/s00005.jpg','./images/s00002.jpg','./images/s00004.jpg','./images/s00002.jpg','./images/s00001.jpg'],
					['./images/s00006.jpg','./images/s00007.jpg','./images/s00003.jpg','./images/s00002.jpg','./images/s00001.jpg'],
					['./images/s00005.jpg','./images/s00003.jpg','./images/s00003.jpg','./images/s00004.jpg','./images/s00005.jpg'],
					['./images/s00006.jpg','./images/s00007.jpg','./images/s00003.jpg','./images/s00002.jpg','./images/s00001.jpg'],
					['./images/s00001.jpg','./images/s00002.jpg','./images/s00003.jpg','./images/s00006.jpg','./images/s00007.jpg']
				]),
		imgArrIndex=0, //记录图片数组的索引
		imgAng=45,  //做动画时，每张图片旋转的角度
		imgTime=300,//每张图片的动画间隔是300ms
		rotating=false, //为标志，只是为了避免在动画期间，用户仍可以点击造成页面出错
		autoTime=null, //存周期性定时器
		autoInterval=3000;//自动播放的间隔时间

	//初始化函数
	function init(){
		$butLeft=$('.butLeft');
		$butRight=$('.butRight');
		$butPlay=$('.butPlay');
		$imglist=$('.mainbox ul li');

		configer(); //设置页面一加载，图片的旋转角度
		setEvent();//为各个按钮添加事件
	}

	function configer(){
		var ang=6,  //固定角度（每次加的角度）
			aint=-10;  //初始化角度（第一个图片的角度）
			$imglist.css('transform-origin',origin);//设置li的旋转中心
			$imglist.each(function(i){  //i是循环的索引
				var $this=$(this);
				$this.css({rotate:aint+(i*ang)+"deg"}); //对每个li进行旋转
			});
	}


	function setEvent(){
		$butLeft.bind("click",function(){
			anigo(-1);
			return false;
		});
		$butRight.bind("click",function(){
			anigo(1);
			return false;
		});
		$butPlay.bind("click",function(){
			var play="play",
				pause="pause",
				$but=$(this);
			if($but.text()=="play"){
				$but.text(pause);
				autoGo();
			}else{
				$but.text(play);
				autoStop();
			}
			return false;
		});
	}

	//根据提供的url生成span(有指定的图片背景)
	function createImg(arr){
		var imgArr=[];
		for(var i in arr){
			var $span;
			imgArr[i]=arr[i];
			for(var x in arr[i]){
				$span=$('<span style="background-image:url('+arr[i][x]+');background-size:cover;"></span>');
				imgArr[i][x]=$span;
			}
		}
		return imgArr;
	}

	//控制图片的切换和旋转
	function anigo(d){
		if(rotating) return false;  //一旦return，后面的代码就不执行了
		rotating=true;
		imgArrIndex+=d; //确定显示那一组的下标
		//下述if语句使得切换可以循环
		if(imgArrIndex>imgAll.length-1){
			imgArrIndex=0;
		}else if(imgArrIndex<0){
			imgArrIndex=imgAll.length-1;
		}
		//遍历页面中的li，并为其添加span，显示指定图片
		$imglist.each(function(i){
			var $thisItme=$(this);//当前li
			var $thisImg=$thisItme.children("span"); //当前li下的span
			var $targetImg=imgAll[imgArrIndex][i];
			var thisTime=(d==1) ? imgTime*i : imgTime*(imgAll.length-1-i);//从左往右时间增加，从右往左时间减少（只是为了实现每张图片是一个接一个旋转出来的效果）
			$thisItme.append($targetImg);
			
			$thisImg.css('transform-origin',originImg);  //设定原来图片的圆心点
			$targetImg.css({transformOrigin:originImg,rotate:(0-d)*imgAng+"deg"});  //初始化新图片的旋转圆心点和旋转角度
			
			setTimeout(function(){
				$thisImg.transition({rotate:imgAng*d+"deg"}); //原来的图片转出去
				$targetImg.transition({rotate:"0deg"},500,function(){
					$thisImg.remove(); //删除原来的图片
					if(thisTime==($imglist.length-1)*imgTime){  //当当前动画执行完之后，才允许再次执行
						rotating=false;
					}
				}); //新图片归位*/
			},thisTime);
		});
	}

	//实现自动播放
	function autoGo(){
		clearInterval(autoTime);//一定要清除，否则会生成多个定时器操作一个东西
		anigo(1);//使得处于播放状态时，页面一加载，就会自动播放
		autoTime=setInterval(function(){
			anigo(1);
		},autoInterval);
	}

	//实现暂停
	function autoStop(){
		clearInterval(autoTime);
	}
	return init;
})();

loopPlayerInit();