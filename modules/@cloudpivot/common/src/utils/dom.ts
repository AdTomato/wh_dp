/**
 * 通过选择器获取element的父元素节点
 * @param el
 * @param selector
 */
export const closest = (el: HTMLElement, selector: string) => {
  const matchesSelector = el.matches;
  while (el) {
    if (matchesSelector.call(el, selector)) {
      break;
    }
    el = el.parentElement as HTMLElement;
  }
  return el;
};

export default {
  closest
};
