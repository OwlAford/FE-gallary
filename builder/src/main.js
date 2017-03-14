import './styles'

$(function(){
	setTimeout(function(){$('.sidebar .motto').addClass('done')},200);
	setTimeout(function(){$('.sidebar .base').addClass('done')},500);
	setTimeout(function(){$('#tab').addClass('done')},900);
	setTimeout(function(){$('#page').addClass('done')},1000);

	var init = function() {
		/*
		 * tab切换功能
		 */

		var tab = $('#tab');
		var tabLine = tab.find('.line');
		var tabWidth = tab.width();
		var tabState = 0;
		var scrollFlag = true;
		var allLi = tab.find('li');
		var num = allLi.size();
		var sWidth = tabWidth/num;
		var pozArr = [];

		// 生成映射数组
		for(var i = 0; i < num; i++){
			pozArr[i] = [i*sWidth, tabWidth - (i+1)*sWidth]
		}

		// 判断方向
		var setDirection = function(dir){
			dir ? 
			tabLine.css('transition-delay', '.0s,.2s') : 
			tabLine.css('transition-delay', '.2s,0s');
		}

		// 设置位置
		var setPoz = function(poz, clear){
			if(clear) tabLine.removeAttr('style');
			tabLine.css({
				left: poz[0] + 'px',
				right: poz[1] + 'px'
			});
		}

		allLi.on('mouseover', function(){
			var idx = $(this).index(), dir;
			idx > tabState ? dir = 1 : dir = 0;
			var poz = pozArr[idx];
			setDirection(dir);
			setPoz(poz);
		}).on('mouseout',function(){
			var idx = $(this).index(), dir;
			idx > tabState ? dir = 0 : dir = 1;
			if(tabState != idx){
				setDirection(dir);
				setPoz(pozArr[tabState]);
			}
		}).on('click',function(){
			var idx = tabState = $(this).index();
			allLi.removeClass('active');
			allLi.eq(idx).addClass('active');

			var curPoz = posArr[idx];
			scrollFlag = false;
			$('html, body').animate({
				scrollTop: curPoz - 60 + 'px'
			}, 300, function(){
				scrollFlag = true;
			});
		})

		/*
		 * 滚动定位	
		 */

		var doc = $(document);
		var base = $('.sidebar .base'); 


		// 判断固定fixed定位时机方法
		var preFixed = function(curtop, elem, left, top, gap, className){
			if(curtop > top){
				elem.css({
					position: 'fixed',
					top: gap + 'px',
					left: left + 'px'
				})
				if(className) elem.addClass(className);
			}else{
				elem.removeAttr('style');
				if(className) elem.removeClass(className);
			}
		}

		// 获取 offset
		var baseLeft, baseTop, tabLeft, tabTop;
		var getOffset = function(){
			baseLeft = base.offset().left;
			baseTop = base.offset().top;

			tabLeft = tab.offset().left;
			tabTop = tab.offset().top;
		}
		getOffset();

		// 设置 fixed 定位
		var setFixed = function(scTop){
			preFixed(scTop, base, baseLeft, baseTop, 10);
			preFixed(scTop, tab, tabLeft, tabTop, 0, 'fixed');
		}

		$(window).resize(function(){
			window.scrollTo(0,0);
			setTimeout(function(){
				getOffset();
				setFixed();
			},100)
		});


		// 锚定位功能，初始化锚定位元素以及映射数组
		var allUnit = $('#page .rds');
		// 生成位置映射数组
		var posArr = [];
		allUnit.each(function(i,e){
			posArr[i] = $(e).offset().top;
		})

		// 激活当前菜单条目
		var actvieItem = function(i){
			allLi.removeClass('active');
			allLi.eq(i).addClass('active');
			var dir;
			i > tabState ? dir = 1 : dir = 0;
			var poz = pozArr[i];
			setPoz(poz, true);
		}

		// 根据当前滚动位置定位应滚动索引值
		var getPozIdx = function(poz){
			for(var i = 0; i < posArr.length; i++){
				if(Math.abs(posArr[i] - poz)<120){
					actvieItem(i);
				}
			}
		}

		// 监听滚动事件
		$(window).on('scroll',function(){
			var scTop = doc.scrollTop();
			setFixed(scTop);
			scrollFlag && getPozIdx(scTop);
		})
		
	}
	init();
})
