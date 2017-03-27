var config = {
    prizes: [],              // 大转盘奖品名称
    colors: [],              // 大转盘奖品区块对应背景颜色
    outsideRadius: 192,      // 大转盘外圆的半径
    textRadius: 155,         // 大转盘奖品位置距离圆心的距离
    insideRadius: 68,        // 大转盘内圆的半径
    startAngle: 0,           // 开始角度
    bRotate: false           // false: 停止; ture: 旋转
};

$(function () {
  // 动态添加大转盘的奖品与奖品区域背景颜色
  config.prizes = [
    '50M免费流量包', 
    '10闪币', 
    '谢谢参与', 
    '5闪币', 
    '20M免费流量包', 
    '20闪币 ', 
    '100M免费流量包', 
    '2闪币'
  ];

  config.colors = [
    '#FFF4D6', 
    '#FFFFFF', 
    '#FFF4D6', 
    '#FFFFFF',
    '#FFF4D6', 
    '#FFFFFF', 
    '#FFF4D6', 
    '#FFFFFF'
  ];

  // 旋转转盘 item: 奖品位置; txt：提示语;
  var rotateFn = function (item, txt) {
    var $wheelcanvas = $('#wheelcanvas');
    var prizeSize = config.prizes.length;
    var angles = item * (360 / prizeSize) - (360 / (prizeSize * 2));

    if (angles < 270) {
      angles = 270 - angles; 
    } else {
      angles = 360 - angles + 270;
    }

    $wheelcanvas.stopRotate();
    $wheelcanvas.rotate({
      angle: 0,
      animateTo: angles + 1800,
      duration: 5000,
      callback: function () {
        // 设置弹框
        alert(txt);
        config.bRotate = !config.bRotate;
      }
    })
  }

  $('.pointer').click(function () {
    if(config.bRotate) {
      return
    }
    config.bRotate = !config.bRotate;
    // 获取随机数 (奖品个数范围内)，此处替换为服务器生成数字
    var item = Math.floor(Math.random() * config.prizes.length + 1);
    rotateFn(item, config.prizes[item - 1]);
    console.log(item);
  })
})

// 页面所有元素加载完毕后对转盘进行渲染
window.onload = function () {    
  var canvas = document.getElementById('wheelcanvas');    
  if (canvas.getContext) {
    // 根据奖品个数计算圆周角度
    var arc = Math.PI / (config.prizes.length / 2);
    var ctx = canvas.getContext('2d');

    // 在给定矩形内清空一个矩形
    ctx.clearRect(0, 0, 422, 422);

    // strokeStyle 属性设置或返回用于笔触的颜色、渐变或模式  
    ctx.strokeStyle = '#FFBE04';

    // font 属性设置或返回画布上文本内容的当前字体属性
    ctx.font = '16px Helvetica Neue';  

    for(var i = 0; i < config.prizes.length; i++) {       
      var angle = config.startAngle + i * arc;
      ctx.fillStyle = config.colors[i];
      ctx.beginPath();

      // arc(x,y,r,起始角,结束角,绘制方向) 方法创建弧/曲线（用于创建圆或部分圆）    
      ctx.arc(211, 211, config.outsideRadius, angle, angle + arc, false);    
      ctx.arc(211, 211, config.insideRadius, angle + arc, angle, true);
      ctx.stroke();  
      ctx.fill();

      // 锁画布(为了保存之前的画布状态)
      ctx.save();   
      
      // 开始绘制奖品
      ctx.fillStyle = '#E5302F';
      var text = config.prizes[i];
      var lineHeight = 17;

      // translate 方法重新映射画布上的 (0, 0) 位置
      ctx.translate(211 + Math.cos(angle + arc / 2) * config.textRadius, 211 + Math.sin(angle + arc / 2) * config.textRadius);
      
      // rotate 方法旋转当前的绘图
      ctx.rotate(angle + arc / 2 + Math.PI / 2);
      
      // 下面代码根据奖品类型、奖品名称长度渲染不同效果
      if (text.indexOf('M') > 0) {
        // 流量包
        var texts = text.split('M');
        for (var j = 0; j < texts.length; j++) {
          ctx.font = j == 0 ? 'bold 20px Helvetica Neue' : '16px Helvetica Neue';
          if (j == 0) {
            ctx.fillText(texts[j] + 'M', - ctx.measureText(texts[j] + 'M').width / 2, j * lineHeight);
          } else {
            ctx.fillText(texts[j], - ctx.measureText(texts[j]).width / 2, j * lineHeight);
          }
        }
      } else if (text.indexOf('M') == -1 && text.length > 6) {
        // 奖品名称长度超过一定范围
        text = text.substring(0,6) + '||' + text.substring(6);
        var texts = text.split('||');
        for (var j = 0; j<texts.length; j++) {
          ctx.fillText(texts[j], - ctx.measureText(texts[j]).width / 2, j * lineHeight);
        }
      } else {
        // 在画布上绘制填色的文本。文本的默认颜色是黑色
        // measureText()方法返回包含一个对象，该对象包含以像素计的指定字体宽度
        ctx.fillText(text, - ctx.measureText(text).width / 2, 0);
      }
      
      //添加对应图标
      if (text.indexOf('闪币') > 0) {
        var img = document.getElementById('shan-img');
        img.onload = function () {  
          ctx.drawImage(img, -15, 10)     
        }
        ctx.drawImage(img, -15, 10)
      } else if (text.indexOf('谢谢参与') >= 0) {
        var img = document.getElementById('sorry-img');
        img.onload = function () {  
          ctx.drawImage(img, -15, 10)     
        }
        ctx.drawImage(img,-15,10) 
      }
      //把当前画布返回（调整）到上一个save()状态之前 
      ctx.restore()
    }     
  } 
}
