/* eslint-disable */

/**
  * 功能函数
  * 计算相对document的坐标值
  */
const offset = (ele: any) => {
  let top = ele.offsetTop;
  let left = ele.offsetLeft;
  while (ele.offsetParent) {
    ele = ele.offsetParent;
    if (window.navigator.userAgent.indexOf('MSTE 8') > -1) {
      top += ele.offsetTop;
      left += ele.offsetLeft;
    } else {
      top += ele.offsetTop + ele.clientTop;
      left += ele.offsetLeft + ele.clientLeft;
    }
  }
  return {
    left: left,
    top: top,
  };
};

/**
  * 表格拖拽专用函数
  * tableTitle 整体表头
  * currentCell 向前拖拽列的表头单元格
  * thIndex 当前拖拽的是第几列
  * tableContent 循环遍历找出表体部分DOM
  * targetColumn 所有的列单元格 是按照从行到列顺序排列
  * 改变该列的第一个即可该表格该列的宽度
  */
const resizeTableBody = (el: any, newWidth: any) => {
  const oDiv = el;
  const tableTitle = oDiv.parentNode.parentNode.parentNode;
  const currentCell = oDiv.parentNode.parentNode;
  currentCell.style.width = `${newWidth}px`;
  let thIndex = 0;
  tableTitle.childNodes.forEach((element: any, index: any) => {
    if (element === currentCell) {
      thIndex = index;
    }
  });
  let tableContent = oDiv;
  while (tableContent.className.indexOf('ant-table-content') < 0) {
    tableContent = tableContent.parentNode;
  }
  let targetColumn = tableContent.querySelectorAll('tbody.ant-table-tbody tr td');
  if (targetColumn.length > 0) {
    targetColumn[thIndex].style.transition = 'all 0s';
    targetColumn[thIndex].style.width = `${newWidth}px`;
  }
}

const resize = {
  // 绑定时调用
  bind(el: any, binding: any) {
    const oDiv = el;
    oDiv._isMouseDown = false;
    oDiv._dircetion = {
      east: false, // right
      south: false, // bottom
      west: false, // left
      north: false, // top
    };
    oDiv._sizeStandard = {
      maxWidth: 700, // 默认缩放最大的宽度为700px
      minWidth: 0, // 默认的最小缩放宽度 ，默认是224px
      maxHeight: 100,
      minHeight: 0,
    };
    oDiv._targetChangeDom = {
      parentNodePlies: 0, // 如果设置为复数则设置为childNode
    };
    oDiv._transform = {
      translateX: 0,
      translateY: 0,
    };
    oDiv._initData = {
      width: 0,
      height: 0,
      offsetWidth: 0,
      offsetHeight: 0,
      x: 0,
      y: 0,
    };
    oDiv._setInitData = (doc: any) => {
      oDiv._initData.width = doc.clientWidth;
      oDiv._initData.height = doc.clientHeight;
      oDiv._initData.offsetWidth = doc.offsetWidth;
      oDiv._initData.offsetHeight = doc.offsetHeight;
      oDiv._initData.x = offset(doc).left - oDiv._transform.translateX;
      oDiv._initData.y = offset(doc).top - oDiv._transform.translateY;
    };
    const dircetion = oDiv._dircetion;
    const sizeStandard = oDiv._sizeStandard;
    const transform = oDiv._transform;
    const targetDom = oDiv._targetChangeDom;
    // todo 解析binging 并綁定可縮放方向
    // todo 应该考虑什么参数都没有加的时候默认全边或者单边可缩放
    // v-resize:north
    if (binding.arg && dircetion.hasOwnProperty(binding.arg)) {
      dircetion[binding.arg] = true;
    }
    // v-resize.north.south
    if (binding.modifiers && Object.keys(binding.modifiers).length > 0) {
      for (const arg in binding.modifiers) {
        if (dircetion.hasOwnProperty(arg)) {
          dircetion[arg] = true;
        }
      }
    }
    // v-resize="{north: true, south: true, maxwidth: 222}"
    if (binding.value && Object.keys(binding.value).length > 0) {
      for (const arg in binding.value) {
        // 方向传值
        if (dircetion.hasOwnProperty(arg) && binding.value[arg]) {
          dircetion[arg] = true;
        }
        // 大小传值
        if (sizeStandard.hasOwnProperty(arg)) {
          sizeStandard[arg] = parseInt(binding.value[arg]);
        }
        // 偏移值
        if (transform.hasOwnProperty(arg)) {
          transform[arg] = parseInt(binding.value[arg]);
        }
        // 改变大小的目标元素
        if (targetDom.hasOwnProperty(arg)) {
          targetDom[arg] = parseInt(binding.value[arg]);
        }
      }
    }
    // 给el绑定鼠标滑动事件 主要是 onMouseUp 和 onMouseDown
    const onMouseDown = () => {
      oDiv._allowToMove = false;
      oDiv._isMouseDown = true;
      (document as any).onselectstart = () => false;
    };
    const onMouseUp = (event: any) => {
      oDiv.style.cursor = 'default';
      oDiv._isMouseDown = false;
      oDiv._setInitData(el);
      (document as any).onselectstart = () => true;
    };
    oDiv.$mousedown = onMouseDown;
    oDiv.$mouseup = onMouseUp;
    oDiv.addEventListener('mousedown', onMouseDown, false);
    oDiv.addEventListener('mouseup', onMouseUp, false);
  },
  inserted(el: any) {
    const oDiv = el;
    oDiv._sizeStandard.minWidth = oDiv.offsetWidth;
    const onMouseUp = () => {
      (document as any).querySelector('body').style.cursor = 'default';
      oDiv._allowToMove = false;
      oDiv._isMouseDown = false;
      oDiv._setInitData(oDiv);
    };
    const onBodyMouseMove = (event: any) => {
      oDiv._setInitData(oDiv);
      if (oDiv._dircetion.west) {
        if (event.pageX < oDiv._initData.x + 5 && event.pageX > oDiv._initData.x - 5) {
          oDiv.style.cursor = 'col-resize';
          oDiv._allowToMove = true;
        } else {
          oDiv.style.cursor = 'default';
        }
        if (oDiv._isMouseDown && oDiv._allowToMove) {
          event.preventDefault();
          const cutWidth = event.pageX - oDiv._initData.x;
          let newWidthWest = oDiv._initData.width - cutWidth;
          console.log('newWidthWest');
          console.log(newWidthWest);
          if (oDiv._sizeStandard.maxWidth && newWidthWest > oDiv._sizeStandard.maxWidth) {
            newWidthWest = oDiv._sizeStandard.maxWidth;
          } else if (oDiv._sizeStandard.minWidth && newWidthWest < oDiv._sizeStandard.minWidth) {
            newWidthWest = oDiv._sizeStandard.minWidth;
          }
          oDiv.style.width = `${newWidthWest}px`;
          oDiv.style.transition = 'all 0s';
        }
      }
      if (oDiv._dircetion.north) {
        if (event.pageY < oDiv._initData.y + 5 && event.pageY > oDiv._initData.y - 5) {
          oDiv.style.cursor = 'row-resize';
        } else {
          oDiv.style.cursor = 'default';
        }
        // todo 向上移动
      }
      if (oDiv._dircetion.east) {
        if (event.pageX < oDiv._initData.offsetWidth + oDiv._initData.x + 10 && event.pageX > oDiv._initData.offsetWidth + oDiv._initData.x - 5) {
          oDiv.style.cursor = 'col-resize';
          oDiv._allowToMove = true;
        } else {
          oDiv.style.cursor = 'default';
        }
        if (oDiv._isMouseDown && oDiv._allowToMove) {
          event.preventDefault();
          (document as any).querySelector('body').style.cursor = 'col-resize';
          let newWidthEast = event.pageX - oDiv._initData.x;
          if (newWidthEast === 0) return;
          if (oDiv._sizeStandard.maxWidth && newWidthEast > oDiv._sizeStandard.maxWidth) {
            newWidthEast = oDiv._sizeStandard.maxWidth;
          } else if (oDiv._sizeStandard.minWidth && newWidthEast < oDiv._sizeStandard.minWidth) {
            newWidthEast = oDiv._sizeStandard.minWidth;
          }
          // todo 优化目标dom
          if (oDiv.className === 'resize') {
            resizeTableBody(oDiv, newWidthEast);
          } else {
            oDiv.style.width = `${newWidthEast}px`;
            oDiv.style.transition = 'all 0s';
          }
          oDiv._setInitData(oDiv);
        }
      }
      if (oDiv._dircetion.south) {
        if (event.pageY < oDiv._initData.y + oDiv._initData.offsetHeight + 5 && event.pageY > oDiv._initData.y + oDiv._initData.height - 5) {
          oDiv.style.cursor = 'row-resize';
        } else {
          oDiv.style.cursor = 'default';
        }
        // todo 向上移动
      }
    };
    document.addEventListener('mousemove', onBodyMouseMove, false);
    document.addEventListener('mouseup', onMouseUp, false);
  },
  unbind(el: any) {
  },
}

export default resize;
