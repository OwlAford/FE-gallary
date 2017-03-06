// 判断浏览器是否支持css3属性
var supports = (function() { 
	var div = document.createElement('div'), 
	vendors = 'Khtml O Moz Webkit'.split(' '), 
	len = vendors.length; 
	return function(prop) { 
		if ( prop in div.style ) return true; 
		if ('-ms-' + prop in div.style) return true; 
		prop = prop.replace(/^[a-z]/, function(val) { 
			return val.toUpperCase(); 
		}); 
		while(len--) { 
			if ( vendors[len] + prop in div.style ) { 
				return true; 
			} 
		} 
		return false; 
	}; 
})(); 

// 判断浏览器是否支持css3动画
var couldAnimate = supports('animation');

window.onload = function() {
	//console.log(supports('animation'));
	// 页面元素加载完之后方执行首屏动画
	var phone = $('#phone');
	var txtWrap = $('#textWrap');
	var qrcode = $('#qrcode');
	var meteors = $('#meteor .m');
	var meteorData = [];
	if (couldAnimate) {
		phone.css({left: '50%', opacity: '1'});
		txtWrap.css({right: '50%', opacity: '1'});
		var timerAni = setTimeout(function(){
			qrcode.css({marginTop: 0, opacity: '1'});
			clearTimeout(timerAni);
		}, 1000)
	} else {
		phone.animate({left: '50%', opacity: 1}, 1600, 'easeInQuad');
		txtWrap.animate({right: '50%', opacity: 1}, 1000, 'easeInCubic');
		var timerAni = setTimeout(function(){
			qrcode.animate({marginTop: 0, opacity: 1}, 600, 'swing');
			clearTimeout(timerAni);
		}, 1000)
		// 因为低版本（ie9-）浏览器不支持css3动画，故需要脚本模拟
		meteors.each(function(i, e){
			meteorData.push([e.style.top.replace('px', '') * 1, e.style.right.replace('px', '') * 1]);
		})
		var ani = [], tmpTimer = [];
		meteors.each(function(i, e){
			var during = 1200 + i*200;
			var delay = 100 + i*200;
			ani[i] = function() {
				$(e).css({top: meteorData[i][0] + 'px', right: meteorData[i][1] + 'px', opacity: 1});
				$(e).animate({top: meteorData[i][0] + 400 + 'px', right: meteorData[i][1] + 400 + 'px', opacity: 0}, during, 'linear', function() {
					tmpTimer[i] = setTimeout(function(){
						ani[i]();
						clearTimeout(tmpTimer[i]);
					}, delay)
				})
			}
			ani[i]();
		})
	}
	
}

$(function(){
	var winHeight = $(window).height();
	var winWidth = $(window).width();
	var phoneBg = $('#phoneBg'); 
	var slider = $('#slider');
	var pageSlide = $('#pageSlide');
	var deviceWrapper = $('#deviceWrapper');
	var allRows = pageSlide.find('.row');
	var indexContainer = $('#indexContainer');
	var phoneBgSize = [414, 627]; 
	var sliderInfo = [255, 455, 141, 66];
	var pozArr = [];
	
	function setSize(ratio) {
		phoneBg.css({
			height: phoneBgSize[1] * ratio + 'px',
			width: phoneBgSize[0] * ratio + 'px'
		})
		slider.css({
			height: sliderInfo[1] * ratio + 'px',
			width: sliderInfo[0] * ratio + 'px',
			left: sliderInfo[2] * ratio + 'px',
			top: sliderInfo[3] * ratio + 'px'
		})
	}
	
	// 激活当前页触发方法
	var allItems = $('#slider .item');
	// 默认激活第一页
	var activeIndex = 0;
	var maxZ = 5;
	allItems.each(function(i, e){
		e.style.zIndex = $(e).attr('data-index');
	})
	
	function activeItems(index) {
		var idx = index;
		if (index == activeIndex) {
			return
		}
		var curItem = allItems.eq(idx);
		curItem.css({opacity: 0, zIndex: maxZ}).animate({opacity: 1}, 300);
		maxZ++;
		activeIndex = idx;
	}
	
	// 初始化尺寸
	function initSize() {
		pozArr = [];
		allRows.each(function(i, e){
			pozArr.push($(e).offset().top)
		});
		// console.log(pozArr);
		winHeight = $(window).height();
		winWidth = $(window).width();
		if (winWidth < 1440) {
			indexContainer.removeClass('f_07').addClass('f_08');
			pageSlide.removeClass('f_07').addClass('f_08');
			setSize(0.8);
			if (winWidth < 1200 || winHeight < 800) {
				indexContainer.removeClass('f_08').addClass('f_07');
				pageSlide.removeClass('f_08').addClass('f_07');
				setSize(0.7);
			}
		} else {
			indexContainer.removeClass('f_07 f_08');
			pageSlide.removeClass('f_07 f_08');
			setSize(1);
		}
	}
	initSize();
	$(window).resize($.throttle(29, initSize));
	
	
	var curPage = 0;
	function frame() {
		ST = $(this).scrollTop();
		ST > winHeight ? 
		deviceWrapper.addClass('fixed').css('height', '100%') : 
		deviceWrapper.removeClass('fixed').css('height', '25%');
		
		var curIndex = null;
		$(pozArr).each(function(i, e) {
			if (Math.abs(ST - e) <= 50) {
				curIndex = i;
				return
			}
        });
		if (curIndex !== null && curIndex != curPage) {
			curPage = curIndex 
			// 触发翻页
			activeItems(curPage);
		}
	}
	
	$(window).on('scroll', frame)
})