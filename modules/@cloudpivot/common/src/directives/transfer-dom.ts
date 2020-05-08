// Thanks to: https://github.com/calebroseland/vue-dom-portal

const objectAssign = Object.assign;
/**
 * Get target DOM Node
 * @param {(Node|string|Boolean)} [node=document.body] DOM Node, CSS selector, or Boolean
 * @return {Node} The target that the el will be appended to
 */
function getTarget(node: any) {
  if (!node) {
    return document.body;
  }

  if (typeof node === 'string' && node.indexOf('?') === 0) {
    return document.body;
  } else if (typeof node === 'string' && node.indexOf('?') > 0) {
    node = node.split('?')[0];
  }

  if (node === 'body' || node === true) {
    return document.body;
  }

  return node instanceof (<any>window).Node ? node : document.querySelector(node);
}

function getShouldUpdate(node: any) {
  // do not updated by default
  if (!node) {
    return false;
  }
  if (typeof node === 'string' && node.indexOf('?') > 0) {
    try {
      const config = JSON.parse(node.split('?')[1]);
      return config.autoUpdate || false;
    } catch (e) {
      return false;
    }
  }
  return false;
}

const directive = {
  inserted(el: any, { value }: any) {
    el.className = el.className ? `${el.className} v-transfer-dom` : 'v-transfer-dom';
    const parentNode = el.parentNode;
    const home = document.createComment('');
    let hasMovedOut = false;

    if (value !== false) {
      parentNode.replaceChild(home, el); // moving out, el is no longer in the document
      getTarget(value).appendChild(el); // moving into new place
      hasMovedOut = true;
    }
    if (!el.$transferDomData) {
      el.$transferDomData = {
        parentNode,
        home,
        target: getTarget(value),
        hasMovedOut,
      };
    }
  },
  componentUpdated(el: any, { value }: any) {
    const shouldUpdate = getShouldUpdate(value);
    if (!shouldUpdate) {
      return;
    }
    // need to make sure children are done updating (vs. `update`)
    const ref$1 = el.$transferDomData;
    // homes.get(el)
    const parentNode = ref$1.parentNode;
    const home = ref$1.home;
    const hasMovedOut = ref$1.hasMovedOut; // recall where home is

    if (!hasMovedOut && value) {
      // remove from document and leave placeholder
      parentNode.replaceChild(home, el);
      // append to target
      getTarget(value).appendChild(el);
      el.$transferDomData = objectAssign({}, el.$transferDomData,
        { hasMovedOut: true, target: getTarget(value) });
    } else if (hasMovedOut && value === false) {
      // previously moved, coming back home
      parentNode.replaceChild(el, home);
      el.$transferDomData = objectAssign({}, el.$transferDomData,
        { hasMovedOut: false, target: getTarget(value) });
    } else if (value) {
      // already moved, going somewhere else
      getTarget(value).appendChild(el);
    }
  },
  unbind: function unbind(el: any) {
    el.className = el.className && el.className.replace('v-transfer-dom', '');
    if (el.$transferDomData && el.$transferDomData.hasMovedOut === true) {
      if (el.$transferDomData.parentNode) {
        el.$transferDomData.parentNode.appendChild(el);
      }
    }
    el.$transferDomData = null;
  },
};

export default directive;
