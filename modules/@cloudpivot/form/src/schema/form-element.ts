

export interface ElementAttr {
    name: string
    value: string
}


export interface FormElement {

    tagName: string

    id: string | null

    innerHTML: string | null

    attrs: Array<ElementAttr>

}


export function createHTMLElement(el: FormElement): HTMLElement | null {

    const child = document.createElement(el.tagName);

    if(el.innerHTML){
        child.innerHTML = el.innerHTML;
    }

    if(el.attrs){
        for(const attr of el.attrs){
           const a = document.createAttribute(attr.name);
           a.value = attr.value;
           child.setAttributeNode(a);
        }
    }

    return child;
}