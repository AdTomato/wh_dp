/* eslint-disable */
export function guid():string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function getOffsetLeft(domObj: any): number {
  let tmp = domObj.offsetLeft;
  let val = domObj.offsetParent;
  while(val != null) {
    tmp += val.offsetLeft;
    val = val.offsetParent;
  }
  return tmp;
}

export function getOffsetTop(domObj: any){
  let tmp = domObj.offsetTop;
  let val = domObj.offsetParent;
  while(val != null){
    tmp += val.offsetTop;
    val = val.offsetParent;
  }
  return tmp;
}

export function mouseBounds(pt: any, compRect: any, containerRect: any, item: object, str: string) {
  let tempObj: object = compRect.toJSON();
  let fourBorders: number = 0;
  let twoBorders: number = 0;
  // @ts-ignore
  if (item.eleType.includes('column')) {
    // @ts-ignore
    fourBorders = 2 * (parseInt(item.rightValue.borderWidthValue,10) + parseInt(item.leftKey.borderWidthValue,10));
    // @ts-ignore
    twoBorders = parseInt(item.rightValue.borderWidthValue,10) > parseInt(item.leftKey.borderWidthValue,10)
        // @ts-ignore
        ? 2 * parseInt(item.rightValue.borderWidthValue,10)
        // @ts-ignore
        : 2 * parseInt(item.leftKey.borderWidthValue,10);
    // @ts-ignore
  } else if (item.eleType.includes('text') || item.eleType.includes('topDrawerRect')) {
    // @ts-ignore
    fourBorders = 4 * parseInt(item.borderWidthValue,10);
    // @ts-ignore
    twoBorders = 2 * parseInt(item.borderWidthValue,10);
  }
  // @ts-ignore
  if (item.eleType.includes('column')) {
    // @ts-ignore
    if (str.includes('left')) tempObj.right += (item.rightValue.widthValue + fourBorders);
    // @ts-ignore
    if (str.includes('right')) tempObj.left -= (item.leftKey.widthValue + fourBorders);
    // @ts-ignore
    tempObj.bottom += twoBorders;
    // @ts-ignore
  } else if (item.eleType.includes('text') || item.eleType.includes('topDrawerRect'))  {
    // @ts-ignore
    tempObj.right += twoBorders;
    // @ts-ignore
    tempObj.bottom += twoBorders;
    // @ts-ignore
  } else if (item.eleType.includes('Pic')) {
    // @ts-ignore
    tempObj.right += 12;
    // @ts-ignore
    tempObj.bottom += 12;
  }
  return {
    // @ts-ignore
    left: containerRect.left + (pt.x - tempObj.left),
    // @ts-ignore
    right: containerRect.right - (tempObj.right - pt.x),
    // @ts-ignore
    top: containerRect.top + (pt.y - tempObj.top),
    // @ts-ignore
    bottom: containerRect.bottom - (tempObj.bottom - pt.y),
    // @ts-ignore
    offsetX: containerRect.left + (pt.x - tempObj.left),
    // @ts-ignore
    offsetY: containerRect.top + (pt.y - tempObj.top)
  }
}

export function calcPositon(pt: any, bounds: any) {
  const left = (pt.x > bounds.left && pt.x < bounds.right
          ? pt.x
          : pt.x >= bounds.right
              ? bounds.right
              : bounds.left) - bounds.offsetX;
  const top = (pt.y > bounds.top && pt.y < bounds.bottom
          ? pt.y
          : pt.y >= bounds.bottom
              ? bounds.bottom
              : bounds.top) - bounds.offsetY;
  return { left, top }
}

export function forRightPosition(x: number, y: number, item: object):object {
  // 边界值计算
  const tempObj: object = {};
  // @ts-ignore
  if (item.owner.includes('left')) { // 左侧拖过来的字段，初始化
    // @ts-ignore
    if (item.kind.includes('leftColumn')) { // 左侧的系统、业务字段
      // @ts-ignore
      tempObj.left = x < 0 ? 0 : x > 322 ? 322 : x;
      // @ts-ignore
      tempObj.top = y < 0 ? 0 : y > 665 ? 665 : y;
    }
    // @ts-ignore
    if (item.kind.includes('leftQrcodePic')) { // 左侧的二维码
      // @ts-ignore
      tempObj.left = x < 0 ? 0 : x > 406 ? 406 : x;
      // @ts-ignore
      tempObj.top = y < 0 ? 0 : y > 609 ? 609 : y;
    }
    // @ts-ignore
    if (item.kind.includes('leftBarcodePic')) { // 左侧的条形码
      // @ts-ignore
      tempObj.left = x < 0 ? 0 : x > 392 ? 392 : x;
      // @ts-ignore
      tempObj.top = y < 0 ? 0 : y > 619 ? 619 : y;
    }
  }
  // @ts-ignore
  if (item.owner.includes('top')) { // 上侧拖过来的字段，初始化
    // @ts-ignore
    tempObj.left = x < 0 ? 0 : x > 406 ? 406 : x;
    // @ts-ignore
    tempObj.top = y < 0 ? 0 : y > 665 ? 665 : y;
    // @ts-ignore
    if (item.kind.includes('topPic')) {
      // @ts-ignore
      tempObj.left = x < 0 ? 0 : x > 356 ? 356 : x;
      // @ts-ignore
      tempObj.top = y < 0 ? 0 : y > 619 ? 619 : y;
    }
    // @ts-ignore
    if (item.kind.includes('topDrawerLine')) {
      // @ts-ignore
      tempObj.top = y < 0 ? 0 : y > 695 ? 695 : y + 15;
    }
  }
  return tempObj;
}

export function inputReg(str: string): boolean {
  return /^[0-9a-zA-Z_]{1,}$/.test(str);
}

const warningTxt = {
  overBorder: '值已经超出边界将吸附在边界！',
  overWh: '元素宽高值小于默认值且不能超出画板！'
};

export function onChange(inputValue: number, str: string, that: any) { // 先具体，后续抽象
  if (inputValue < 0) { that.$message.warning('请输入大于0的数值！'); return }
  const kind: string = that.itemAttrs.eleType;
  let columnAllWidth: number = 0;
  let columnHeight: number = 0;
  let oneColumnWidth: number = 0;
  // 动态计算元素的距离左侧的距离和宽度，画板宽高为492  695。
  // @ts-ignore
  if (kind.includes('column')) {
    if (that.leftOrRight.includes('left')) {
      oneColumnWidth = that.itemAttrs.leftKey.widthValue + 2 * parseInt(that.itemAttrs.leftKey.borderWidthValue,10);
    }
    if (that.leftOrRight.includes('right')) {
      oneColumnWidth = that.itemAttrs.rightValue.widthValue + 2 * parseInt(that.itemAttrs.rightValue.borderWidthValue,10);
    }
    // 字段column的总宽
    columnAllWidth = that.itemAttrs.leftKey.widthValue + that.itemAttrs.rightValue.widthValue + 2 * (parseInt(that.itemAttrs.leftKey.borderWidthValue,10) + parseInt(that.itemAttrs.rightValue.borderWidthValue,10)); // column的总宽
    // 字段column的总高
    columnHeight = 2 * parseInt(that.itemAttrs.leftKey.borderWidthValue > that.itemAttrs.rightValue.borderWidthValue ? that.itemAttrs.leftKey.borderWidthValue : that.itemAttrs.rightValue.borderWidthValue,10) + that.itemAttrs.heightValue; // column的总高
  }
  // @ts-ignore
  const textAllWidth: number = 2 * parseInt(that.itemAttrs.borderWidthValue,10) + that.itemAttrs.widthValue; // text的总宽
  // @ts-ignore
  const itemAllHeight: number = 2 * parseInt(that.itemAttrs.borderWidthValue,10) + that.itemAttrs.heightValue; // text、rect的总高
   // @ts-ignore
  const lineAndAllPicWidth: number = that.itemAttrs.widthValue; // 直线、图片、二维码、条形码的总宽
  // @ts-ignore
  const lineAndAllPicHeight: number = that.itemAttrs.heightValue; // 直线、图片、二维码、条形码的总高
  if (str.includes('x')) {
    if (inputValue > 492)  inputValue = 492;
    // @ts-ignore
    that.itemAttrs.left = inputValue;
    // @ts-ignore
    if (kind.includes('column') && inputValue > 492 - columnAllWidth) {
      // @ts-ignore
      that.itemAttrs.left = 492 - columnAllWidth;
      that.$message.warning(warningTxt.overBorder);
    }
    // @ts-ignore
    if ((kind.includes('text') || kind.includes('topDrawerRect')) && inputValue > 492 - textAllWidth) {
      // @ts-ignore
      that.itemAttrs.left = 492 - textAllWidth;
      that.$message.warning(warningTxt.overBorder);
    }
    // @ts-ignore
    if ((kind.includes('topDrawerLine') || kind.includes('Pic')) && inputValue > 492 - lineAndAllPicWidth) {
      // @ts-ignore
      that.itemAttrs.left = 492 - lineAndAllPicWidth;
      that.$message.warning(warningTxt.overBorder);
    }
  }
  if (str.includes('y')) {
    if (inputValue > 695)  inputValue = 695;
    // @ts-ignore
    that.itemAttrs.top = inputValue;
    // @ts-ignore
    if (( kind.includes('text') || kind.includes('topDrawerRect')) && inputValue > 695 - itemAllHeight) {
      // @ts-ignore
      that.itemAttrs.top = 695 - itemAllHeight;
      // @ts-ignore
      that.$message.warning(warningTxt.overBorder);
    }
    if (kind.includes('column') && inputValue > 695 - columnHeight) {
      // @ts-ignore
      that.itemAttrs.top = 695 - columnHeight;
      // @ts-ignore
      that.$message.warning(warningTxt.overBorder);
    }
    if ((kind.includes('topDrawerLine') || kind.includes('Pic')) && inputValue > 695 - lineAndAllPicHeight) {
      // @ts-ignore
      that.itemAttrs.top = 695 - lineAndAllPicHeight;
      // @ts-ignore
      that.$message.warning(warningTxt.overBorder);
    }
  }
  if (str.includes('w')) {
    if (inputValue > 492) inputValue = 492;
    const allowWidth: number = 492 - that.itemAttrs.left;
    // @ts-ignore
    that.itemAttrs.widthValue = inputValue;
    // @ts-ignore
    if (inputValue > allowWidth) {
      // @ts-ignore
      that.itemAttrs.widthValue = allowWidth;
      // @ts-ignore
      that.$message.warning(warningTxt.overWh);
    }
    // @ts-ignore
    if ((kind.includes('text') || kind.includes('topDrawer')) && inputValue < 85) {
      // @ts-ignore
      that.itemAttrs.widthValue = 85;
      // @ts-ignore
      that.$message.warning(warningTxt.overWh);
    }
    // @ts-ignore
    if (kind.includes('column')) {
      if (that.leftOrRight.includes('left')) {
        that.itemAttrs.leftKey.widthValue = inputValue;
        if (inputValue > allowWidth - that.itemAttrs.rightValue.widthValue) {
          that.itemAttrs.leftKey.widthValue = allowWidth - that.itemAttrs.rightValue.widthValue;
          that.$message.warning(warningTxt.overWh);
        }
      }
      if (that.leftOrRight.includes('right')) {
        that.itemAttrs.rightValue.widthValue = inputValue;
        if (inputValue > allowWidth - that.itemAttrs.leftKey.widthValue) {
          that.itemAttrs.rightValue.widthValue = allowWidth - that.itemAttrs.leftKey.widthValue;
          that.$message.warning(warningTxt.overWh);
        }
      }
    }
  }
  if (str.includes('h')) {
    if (inputValue > 695) inputValue = 695;
    const allowHeight: number = 695 - that.itemAttrs.top;
    // @ts-ignore
    that.itemAttrs.heightValue = inputValue;
    // @ts-ignore
    if (inputValue > allowHeight) {
      // @ts-ignore
      that.itemAttrs.heightValue = allowHeight;
      // @ts-ignore
      that.$message.warning(warningTxt.overWh);
    }
    // @ts-ignore
    if ((kind.includes('column') || kind.includes('text') || kind.includes('topDrawerRect')) && inputValue < 30) {
      // @ts-ignore
      that.itemAttrs.heightValue = 30;
      // @ts-ignore
      that.$message.warning(warningTxt.overWh);
    }
  }
  let widthValue = that.itemAttrs.widthValue;
  if (kind.includes('column')) {
    widthValue = that.itemAttrs.rightValue.widthValue;
    if (that.leftOrRight.includes('left')) {
      widthValue = that.itemAttrs.leftKey.widthValue;
    }
  }
  that.changeXYWH({
    // @ts-ignore
    left: that.itemAttrs.left,
    // @ts-ignore
    top: that.itemAttrs.top,
    // @ts-ignore
    widthValue,
    // @ts-ignore
    heightValue: that.itemAttrs.heightValue
  });
}
