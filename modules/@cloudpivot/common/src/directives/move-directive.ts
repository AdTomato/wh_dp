import { DirectiveOptions, VNode, VNodeDirective } from 'vue';

function buildEvents(el: HTMLElement, arg: string, bind?:VNodeDirective) {
  let sX:number = 0;// 初始X坐标
  let sY:number = 0;// 初始Y坐标
  let tX:number = 0;// 临时X坐标
  let tY:number = 0;// 临时Y坐标
  let mX:number = 0;// 元素的最后X坐标
  let mY:number = 0;// 元素的最后Y坐标

  const onmousemove:any = (e:MouseEvent) => {
    if(arg === 'scroll'){
      // console.log('scroll------1:', e.pageY, sY, mY, el.scrollTop);
      // console.log('scroll------3:', e.pageX, sX, mX, el.scrollLeft);
      tX =  Math.max(0,-(e.pageX - sX + mX));
      tY =  Math.max(0,-(e.pageY - sY + mY));
      el.scrollLeft = tX;
      el.scrollTop = tY;
    }else{
      tX = e.pageX - sX + mX;
      tY = e.pageY - sY + mY;
      el.style.transform = `translate3d(${tX}px,${tY}px,0px)`;
    }
  };
  const onmouseup = () => {

    if(arg === 'scroll'){
      mX = -el.scrollLeft;
      mY = -el.scrollTop;
    }else{
      mX = tX;
      mY = tY;
    }
    document.removeEventListener('mousemove', onmousemove);
    document.removeEventListener('mouseup', onmouseup);
  };
  const onmousedown:any = (e:MouseEvent) => {
    e.preventDefault();
    sX = e.pageX;
    sY = e.pageY;
    document.addEventListener('mousemove', onmousemove, false);
    document.addEventListener('mouseup', onmouseup, false);
  };
  el.addEventListener('mousedown', onmousedown, false);
  const onscroll:any = (e:any) => {
    if(arg === 'scroll' && bind && bind.modifiers && bind.modifiers.full){ 
      setTimeout(() => {
        // 滚动极限值处理
        if (el.scrollLeft > el.scrollWidth - el.clientWidth) {
          mX = -(el.scrollWidth - el.clientWidth);
        } else if (el.scrollLeft < 0) {
          mX = 0;
        } else {
          mX = -el.scrollLeft; 
        }
        if (el.scrollTop > el.scrollHeight - el.clientHeight) {
          mY = -(el.scrollHeight - el.clientHeight);
        } else if (el.scrollTop < 0) {
          mY = 0;
        } else {
          mY = -el.scrollTop;
        }
      }, 300);
    }
  };
  el.addEventListener('mousewheel', onscroll, false);
  // 兼容火狐
  el.addEventListener('DOMMouseScroll', onscroll, false);
}

const directive: DirectiveOptions = {
  bind(el: HTMLElement, bind: VNodeDirective, vnode: VNode) {
    buildEvents(el, bind.arg || '', bind);
  }
};

export default directive;
