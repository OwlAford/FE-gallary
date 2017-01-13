/*
 * ======================= DragSortable V1.0 =======================
 * 
 * @ col >>>>>>>>>>>>>>>>单行中cell个数
 * @ container >>>>>>>>>>容器样式或ID名
 * @ cellHeight >>>>>>>>>设定自定cell高度，默认和宽度相等
 * @ excludeClassName >>>排除不参与排序的元素
 * @ necessaryClassName >必须有该样式名才能参与拖拽	
 * @ delater >>>点击触发删除的元素
 * (#注： 该插件依赖jQuery、JQuery.finger)	
 *
 */
function sortable(elemsName, options){
	this.elemsName = elemsName;
    this.options = options;
    this.init();
}

sortable.prototype = {

	//根据行列数和宽度，设定坐标数组
	coord : function(){
		var container = this.container = document.querySelector(this.options.container);
		var allBox = this.allBox = $(container).find('li');
		var number = this.number = allBox.size();
		var col = this.options.col;
		var coordArr = [];
		var areaWidth = this.areaWidth = container.offsetWidth;
		var cellWidth = this.cellWidth = this.areaWidth/col;
		var cellHeight = this.cellHeight = this.options.cellHeight || this.cellWidth;
		for (var i = 0; i < number; i++) {
			coordArr.push({
				x : i%col*cellWidth,
				y : Math.floor(i/col)*cellHeight
			});
		}
		this.coordArr = coordArr;
		//console.log(this.coordArr);
	},

	//初始化元素（宽高、位置）
	init : function(){
		this.elems = $(this.elemsName);
		this.coord();
		var self = this;
		this.container.style.height = this.cellHeight*(Math.ceil(this.number/this.options.col)) + 'px';
		this.containerOffsetLeft = this.container.offsetLeft;
		this.containerOffsetTop = this.container.offsetTop;
		function setStyle(e,i){
			$(e).css({
				position : "absolute",
				left : self.coordArr[i].x + 'px',
				top : self.coordArr[i].y + 'px',
				width : self.cellWidth + 'px',
				height : self.cellHeight + 'px'
			});	
		}
		this.elems.each(function(i){
			this.box = $(this).parent();
			this.box.poz = self.coordArr[i];
			setStyle(this.box, i);
			setStyle(this, i);	
			$(this).attr("index", i).appendTo(self.container);
			!$(this).hasClass(self.options.excludeClassName) && self.bindDrag(this);
		})	
		self.initPressDelate();
	},

	//获取当前触摸位置（相对）
	getPos : function(ev){
		var pos = {
			x : ev.originalEvent.changedTouches[0].clientX - this.containerOffsetLeft,
			y : ev.originalEvent.changedTouches[0].clientY - this.containerOffsetTop
		};
		return pos;	
	},

	move : function(elem){
		$(elem).css({
			left : elem.box.poz.x + 'px',
			top : elem.box.poz.y + 'px'
		})
	},

	//排序判断和交换
	sortCheck : function(elem){
		var sib = $(elem).siblings(this.elemsName);
		var self = this;	
		sib.each(function(){
			if(elem.pointer.x > this.box.poz.x && elem.pointer.y > this.box.poz.y &&
				(elem.pointer.x < this.box.poz.x + self.cellWidth) && (elem.pointer.y < this.box.poz.y + self.cellHeight) && 
				!$(this).hasClass(self.options.excludeClassName)){
				if(elem.box.poz.y < this.box.poz.y){
					// 移到上方
					var box = this.box;
					var node = this;
					var startIndex = elem.box.index();
					var endIndex = node.box.index();
					for(var i = endIndex; i > startIndex; i--) {
						var prevNode = $(self.elemsName + '[index="'+(i-1)+'"]')[0];
						node.box = prevNode.box;
						$(node).attr("index", node.box.index()) ;
						self.move(node);
						node = prevNode;
					}
					elem.box = box;
					$(elem).attr("index", box.index()) ;

				} else if(elem.box.poz.y > this.box.poz.y){
					// 移到下方
					var box = this.box ;
					var node = this;
					var startIndex = node.box.index() ;
					var endIndex = elem.box.index(); ;
					for(var i = startIndex; i < endIndex; i++) {
						var nextNode = $(self.elemsName + '[index="'+(i+1)+'"]')[0];
						node.box = nextNode.box;
						$(node).attr("index", node.box.index()) ;
						self.move(node);
						node = nextNode;
					}
					elem.box = box;
					$(elem).attr("index", box.index()) ;
				} else {
					var saveBox = this.box;
					this.box = elem.box;
					elem.box = saveBox;
					self.move(this);
					$(elem).attr("index", elem.box.index());
					$(this).attr("index", this.box.index());
				}
			} 
		})
	},

	//绑定拖拽
	bindDrag : function(elem){

		function Pointer(x, y){
			this.x = x;
			this.y = y;
		}
		
		function Position(left, top){
			this.left = left;
			this.top = top;
		}
		
		//保存坐标和位置
		var oldPosition = new Position();
		var oldPointer = new Pointer();
		var isDrag = false;
		var self = this;

		$(elem).on('touchstart', function(e){
			var pos = self.getPos(e);
			oldPosition.left = $(elem).position().left;
			oldPosition.top = $(elem).position().top;
			oldPointer.x = pos.x;
			oldPointer.y = pos.y;
			isDrag = true;
		});

		$(elem).on('touchmove', function(e){
			var necessaryClassName = self.options.necessaryClassName;
			if(necessaryClassName && !$(this).hasClass(necessaryClassName)){
				isDrag = false;
				return;
			}
			e.preventDefault();
			var pos = self.getPos(e);
			var curPointer = new Pointer(pos.x, pos.y);
			if(!isDrag) return;
			$(elem).addClass('active').css({
				'opacity' : '0.8',
				'z-index' : 999,
				'border-width' : '1px 1px 0'
			});
			var left = curPointer.x - oldPointer.x + oldPosition.left;
			var top = curPointer.y - oldPointer.y + oldPosition.top;
			$(elem).css({
				left : left,
				top : top
			});
			elem.pointer = curPointer;
			// 开始交换位置
			self.sortCheck(elem);
		});

		$(elem).on('touchend', function(){
			if(!isDrag) return;
			isDrag = false;
			self.move(elem);
			$(elem).removeClass('active').css({
				'opacity' : '',
				'z-index' : '',
				'border-width' : ''
			})
		});
	},
	
	//初始化长按删除
	initPressDelate : function(){
		var self = this;
		var allItem = this.elems;
		var allDel = allItem.find(self.options.delater);
		var necessaryClassName = self.options.necessaryClassName;
		var excludeClassName = self.options.excludeClassName;

		//为每个删除小点绑定删除功能
		allDel.off('tap').on('tap',function(e){
			self.destroy();
			$(this).parents('li').remove();
			self.init();
			e.stopPropagation();
		})

		//点击其他地方跳出删除状态
		$(document).on('tap', function(){
			allItem.removeClass(necessaryClassName);
		})

		//为每个cell绑定长按事件
	    allItem.on("press", function(){
	    	var	cur = $(this);
			!cur.hasClass(excludeClassName) && cur.addClass(necessaryClassName);
		});
	},

	destroy : function(){
		var self = this;
		this.elems.each(function(i){
			//解除绑定事件
			$(this).off('touchstart touchmove touchend').removeAttr('style');
			//将元素置入对应box内
			curIndex = $(this).attr('index');
			$(self.allBox.eq(curIndex)).append(this);
		})	
	}
	
}

