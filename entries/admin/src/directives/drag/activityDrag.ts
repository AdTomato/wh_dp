
import { VNode, VNodeDirective } from 'vue';
import { Vue } from 'vue-property-decorator';

export interface H3AvtivityDraggable {

  onDragstart: (evt: DragEvent) => void;
  onDragover?: (evt: DragEvent) => void;
  onDragend?: () => void;

}


Vue.directive('h3-activity-drag', function (el: HTMLElement, binding: VNodeDirective, vnode: VNode) {

  el.draggable = true;

  const img = new Image();
  img.src = '';

  el.ondragstart = function (evt: DragEvent) {
    if (!evt || !evt.target) {
      return;
    }
    
    const elment:any = this;
    const maxWidth = parseInt(elment.style.width) - 5;
    const maxHeight = parseInt(elment.style.height) - 5;
    if (evt.offsetX < 5 || evt.offsetX > maxWidth) {
      evt.preventDefault();
      return;
    }
    if (evt.offsetY < 5 || evt.offsetY > maxHeight) {
      evt.preventDefault();
      return;
    }
    setTimeout(() => {
      el.classList.add('dragging');
    }, 0);

    if (!evt.dataTransfer) {
      return;
    }

    evt.dataTransfer.setDragImage(img, 0, 0);

    const obj = binding.value;

    if (obj) {
      if (obj.effect) {
        evt.dataTransfer.effectAllowed = obj.effect;
      }
      if (obj.value) {
        const type = obj.type ? obj.type : 'text';
        evt.dataTransfer.setData(type, obj.value);
      }

    }
    const component = vnode.componentInstance as any;
    if (component && component.onDragstart) {
      component.onDragstart(evt);
    }

  }

  el.ondragover = function (evt: DragEvent) {
    const component = vnode.componentInstance as any;
    if (component && component.onDragover) {
      component.onDragover(evt);
    }
  }


  el.ondragend = function () {
    el.classList.remove('dragging');
    const component = vnode.componentInstance as any;
    if (component && component.onDragend) {
      component.onDragend();
    }
  }
})
