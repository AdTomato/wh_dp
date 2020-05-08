
import { VNode, VNodeDirective } from 'vue';
import { Vue } from 'vue-property-decorator';


export interface H3Droppable {

  onDragenter?: (evt: DragEvent) => void;

  onDragleave?: (evt: DragEvent) => void;

  onDragover: (evt: DragEvent) => void;

  onDrop: (evt: DragEvent) => void;

}


Vue.directive('h3-drop', function (el: HTMLElement, binding: VNodeDirective, vnode: VNode) {
  
  const component = vnode.componentInstance as any;

  el.ondragenter = function (evt: DragEvent) {

    const obj = binding.value;

    if (obj && evt.dataTransfer) {

      if (obj.types && Array.isArray(obj.types)) {
        if (!evt.dataTransfer.types.some(t => obj.types.indexOf(t) > -1)) {
          return;
        }
      }

      if (obj.type) {
        if (!evt.dataTransfer.types.some(t => t === obj.type)) {
          return;
        }
      }
    }

    if (component && component.onDragenter) {
      component.onDragenter(evt);
    }
  }

  el.ondragover = function(evt: DragEvent){
    if (component && component.onDragover) {
      component.onDragover(evt);
    }
  }

  el.ondragleave = function (evt: DragEvent) {
    if (component && component.onDragleave) {
      component.onDragleave(evt);
    }
  }

  el.ondrop = function (evt: DragEvent) {
    if (component && component.onDrop) {
      component.onDrop(evt);
    }
  }

});