// 双指缩放流程图事件

export const setGesture = (el:any) => {
  const obj:any = {}; //定义一个对象
  let istouch:boolean = false;
  let start:any = [];

  el.addEventListener("touchstart", (e:any) => {
      if(e.touches.length >= 2){  //判断是否有两个点在屏幕上
          istouch = true;
          start = e.touches;  //得到第一组两个点
          const center = getCenter(start[0], start[1], el);
          e.center = center;
          obj.gesturestart && obj.gesturestart.call(el, e); //执行gesturestart方法
      };
  }, false);

  let timeout:any;
  let timeoutFlag:boolean;
  document.addEventListener("touchmove", (e:any) => {
      e.preventDefault();
      const evt:any = e;
      if (!timeoutFlag) {
        timeoutFlag = true;
        timeout = setTimeout(() => {
          timeoutFlag = false;
          clearTimeout(timeout);
          if(evt.touches.length >= 2 && istouch){
            const now = evt.touches;  //得到第二组两个点
            const scale = getDistance(now[0], now[1]) / getDistance(start[0], start[1]); //得到缩放比例，getDistance是勾股定理的一个方法
            // const rotation = getAngle(now[0], now[1]) - getAngle(start[0], start[1]);  //得到旋转角度，getAngle是得到夹角的一个方法
            obj.gesturemove && obj.gesturemove.call(el, scale);  //执行gesturemove方法
          };
        }, 20);
      }
      
  }, false);

  document.addEventListener("touchend", () => {
      if(istouch){
          istouch = false;
          obj.gestureend && obj.gestureend.call(el);  //执行gestureend方法
      };
  }, false);

  return obj;
};
export const getDistance = (p1:any, p2:any) => {
  const x = p2.pageX - p1.pageX;
  const y = p2.pageY - p1.pageY;
  return Math.sqrt((x * x) + (y * y));
};
export const getAngle = (p1:any, p2:any) => {
  const x = p1.pageX - p2.pageX;
  const y = p1.pageY- p2.pageY;
  return Math.atan2(y, x) * 180 / Math.PI;
};
export const getCenter = (p1:any, p2:any, el:any) => {
  const x = (p2.offsetX + p1.offsetX) / 2;
  const y = (p2.offsetY + p1.offsetY) / 2;
  const result = {
      x: `${x}px`,
      y: `${y}px`
  };
  return result;
};