
import { VNode, VNodeDirective } from 'vue';
import { Vue } from 'vue-property-decorator';


export interface H3Draggable {

  onDragstart: (evt: DragEvent) => void;

}


Vue.directive('h3-drag', function (el: HTMLElement, binding: VNodeDirective, vnode: VNode) {

  if ((el as any).disabled || el.classList.contains('disabled')) {
    el.draggable = false;
    return;
  }

  el.draggable = true;

  el.ondragstart = function (evt: DragEvent) {
    setTimeout(() => {
      el.classList.add('dragging');
    }, 0);

    if (!evt.dataTransfer) {
      return;
    }

    const obj = binding.value;

    if (obj) {

      if (obj.effect) {
        evt.dataTransfer.effectAllowed = obj.effect;
      }

      if (obj.value) {
        let type = obj.type ? obj.type : 'text';
        evt.dataTransfer.setData(type, obj.value);
      }

    }

    const component = vnode.componentInstance as any;
    if (component && component.onDragstart) {
      component.onDragstart(evt);
    }

  }


  el.ondragend = function () {
    el.classList.remove('dragging');
    // 移除拖动添加的样式
    el.removeAttribute('style');
  }

});