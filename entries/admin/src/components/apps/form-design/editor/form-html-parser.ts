
import { parseHTML } from './html-parser';

import { schema, renderer } from '@cloudpivot/form';

import { TemplateBPMType } from '@/template/template';

// const control_tag_names = Object.keys(TemplateBPMType);

export class ASTElement {

    readonly tagName: string

    readonly tagIndex: number

    readonly tagLength: number

    readonly attrs: Array<schema.ElementAttr>

    readonly parent: ASTElement | null

    innerHTML: string | null = null

    protected _children: ASTElement[] = []

    get children() {
        return this._children;
    }

    readonly id: string | null = null

    constructor(
        tagName: string,
        tagIndex: number,
        tagLength: number,
        attrs: Array<{
            name: string
            value: string
        }>,
        parent: ASTElement | null
    ) {
        this.tagName = tagName;
        this.tagIndex = tagIndex;
        this.tagLength = tagLength;
        this.attrs = attrs;
        this.parent = parent;

        if (attrs) {
            const attr = attrs.find(a => a.name === 'id');
            if (attr) {
                this.id = attr.value;
            }
        }

        if (parent) {
            parent.children.push(this);
        }
    }

}


export abstract class FormElementParseService {


    static buildControlOf(el: ASTElement) {
        const control = FormElementParseService.buildBaseControlOf(el);
        if (!control) {
            return null;
        }

        const isSheet = control.type === schema.FormControlType.Sheet;

        if (isSheet && el.children.length > 0) {

            const sheet = control as schema.FormSheet;

            const mapFn = function <T extends schema.FormControl>(child: ASTElement): T {
                const col = FormElementParseService.buildBaseControlOf<T>(child, sheet);
                if (!col) {
                    throw new Error('unknown sheet column control:' + child.tagName);
                }
                return col;
            };

            let childEl = el.children.find(c => c.tagName === 'a-columns');
            if (childEl) {
                sheet.columns = childEl.children.map<schema.FormSheetColumn>(mapFn);
            }

            childEl = el.children.find(c => c.tagName === 'a-totals');
            if (childEl) {
                sheet.statistics = childEl.children.map<schema.FormSheetStatistic>(mapFn);
            }
        }

        return control;
    }


    static convertAttrName(attrName: string) {
        const name = attrName.replace(/-([a-z]{1})/g, ($0: string, $1: string) => $1.toUpperCase());
        return name;
    }

    static convertAttrValue(value: string) {
        let val: any;
        try {
            val = JSON.parse(JSON.stringify(value).replace(/^["]|\\|("$)/g, ''));
        } catch{
            val = value;
        }
        return val;
    }

    static buildBaseControlOf<T extends schema.FormControl>(
        el: ASTElement,
        parent?: schema.FormControl
    ): T | null {

        if (el.tagName.indexOf('a-') === 0) {
            const controlType = TemplateBPMType[el.tagName];
            if (controlType === undefined) {
                return null;
            }

            const inSheet = parent && parent.type === schema.FormControlType.Sheet;

            const opts: any = {};
            const control: any = {
                type: controlType
            };

            if (controlType === schema.FormControlType.Sheet) {
                control.columns = [];
            }

            const prefix = 'data-';

            for (const attr of el.attrs) {

                const idx = attr.name.indexOf(prefix);

                if (idx > -1) {

                    const key = FormElementParseService.convertAttrName(attr.name.substr(prefix.length));
                    let value = FormElementParseService.convertAttrValue(attr.value);
                    if(value && typeof value === 'object' && key !== 'name_i18n'){
                        value = JSON.stringify(value);
                    }
                    opts[key] = value;

                } else {

                    if (attr.name === 'key' || (inSheet && attr.name === 'width')) {
                        control[attr.name] = attr.value;
                    } else if (controlType === schema.FormControlType.SheetStatistic) {
                        if (attr.name === 'column-key') {
                            const key = FormElementParseService.convertAttrName(attr.name);
                            control[key] = attr.value;
                        }
                    }

                }
            }

            if (!control.key) {
                throw new Error('control key not found: ' + el.tagName);
            }

            control.options = renderer.FormControlOptionsService.buildFor(controlType, opts);

            if (parent) {
                control.parentKey = parent.key;
            }

            return control;
        } else {
            const type = schema.FormControlType.Html;

            const control = {
                type,
                key: '',
                options: {},
                tagName: el.tagName,
                innerHTML: el.innerHTML,
                attrs: el.attrs
            };

            return control as any;
        }

    }

}


export class FormHtmlParser {

    readonly html: string

    private _elements: ASTElement[] = []

    private _layout: string[][] = []

    private _controls: { [key: string]: schema.FormControl } = {}

    private _actions: Array<{
        text: string
        code: string
    }> = []

    private _count = 0

    get elements() {
        return this._elements;
    }

    get layout() {
        return this._layout;
    }

    get controls() {
        return this._controls;
    }

    get actions() {
        return this._actions;
    }

    constructor(html: string) {
        this.html = html;
    }

    reset() {
        this._count = 0;
        this._elements = [];
        this._layout = [];
        this._controls = {};
        this._actions = [];
    }

    validateParent(must: {
        name?: string
        id?: string
        empty?: boolean
    }, el: ASTElement, parent: ASTElement | null) {

        if (must.name) {

            let msg = `<${el.tagName}> must in <${must.name}`;
            if (must.id) {
                msg += ` id="${must.id}"`
            }
            msg += '>';

            if (!parent || parent.tagName !== must.name
                || (must.id && parent.id !== must.id)) {
                throw new Error(msg);
            }

        } else if (must.empty) {
            if (parent) {
                throw new Error(`<${el.tagName}> cannot has parent`);
            }
        }
    }

    validateAttrs(must: {
        requiredKeys: string[]
    }, el: ASTElement) {

        for (const key of must.requiredKeys) {
            const attr = el.attrs.find(a => a.name === key);
            if (!attr) {
                throw new Error(`<${el.tagName}>'s attribute '${key}' is loss`);
            }
        }
    }

    validateChildren(must: {
        optionalNames: string[]
    }, el: ASTElement) {
        if (el.children.length > 0) {
            const children = el.children.filter(e => must.optionalNames.indexOf(e.tagName) === -1);
            if (children.length > 0) {
                const tags = children.map(e => `<${e.tagName}>`).join(',');
                throw new Error(`<${el.tagName}> has unknow children: ${tags}`);
            }
        }
    }

    validateStart(el: ASTElement, parent: ASTElement | null) {

        const name = el.tagName;

        switch (name) {

            case 'a-col':
                this.validateParent({
                    name: 'a-row'
                }, el, parent);
                break;

            case 'a-columns':
            case 'a-totals':
                this.validateParent({
                    name: 'a-sheet'
                }, el, parent);
                break;

            case 'action':
                this.validateParent({
                    name: 'section',
                    id: 'toolbar'
                }, el, parent);

                this.validateAttrs({
                    requiredKeys: ['text', 'code']
                }, el);
                break;

            case 'style':
            case 'script':
            case 'section':
                this.validateParent({
                    empty: true
                }, el, parent);
                break;
        }

    }


    validateEnd(el: ASTElement) {

        const name = el.tagName;

        switch (name) {

            case 'a-row':
                this.validateChildren({
                    optionalNames: ['a-col']
                }, el);
                break;

            case 'a-sheet':
                this.validateChildren({
                    optionalNames: ['a-columns', 'a-totals']
                }, el);
                break;

            case 'section':
                if (el.id === 'toolbar') {
                    this.validateChildren({
                        optionalNames: ['action']
                    }, el);
                } else if (el.id === 'template') {
                    this.validateChildren({
                        optionalNames: ['a-row']
                    }, el);
                }
                break;

        }
    }


    parse() {

        const html = this.html;
        if (!html.trim()) {
            return;
        }

        this.callParseHTML(html);

        this.handleToolbar();

        this.handleTemplate();

        this.handleScript();
    }


    private callParseHTML(html: string) {

        const stack: ASTElement[] = [];

        this.reset();

        const self = this;

        const subHtmlTags = ['style', 'script', 'link'];

        parseHTML(html, {

            start(tagName: string, attrs: any[], unary: any, start: number, end: number) {

                let parent = stack.length > 0 ? stack[stack.length - 1] : null;

                let el = new ASTElement(tagName, start, end - start, attrs, parent);

                self.validateStart(el, parent);
                
                if(!unary){
                    stack.push(el);
                }
            },

            end(tagName: string, start: number, end: number) {

                let el = stack.pop();

                if (el) {

                    self.validateEnd(el);

                    let parent = stack.length > 0 ? stack[stack.length - 1] : null;

                    if (subHtmlTags.indexOf(tagName) > -1
                        || (parent && parent.tagName === 'a-col' && tagName.indexOf('a-') !== 0)) {
                        el.innerHTML = html.substring(el.tagIndex + el.tagLength, start);
                    }

                    if (stack.length === 0) {
                        self.elements.push(el);
                    }
                }
            }
        });
    }

    findElementById(id: string) {
        const el = this._elements.find(e => e.id === id);
        return el;
    }

    findElementsByClass(name: string) {
        return this._elements.filter(e =>
            e.attrs.some(a => a.name === 'class' && a.value === name)
        );
    }

    private handleToolbar() {
        const el = this.findElementById('toolbar');

        if (!el || el.children.length === 0) {
            return;
        }

        this._actions = el.children.map(e => {
            const action: any = {};
            e.attrs.forEach(attr => {
                const name = FormElementParseService.convertAttrName(attr.name);
                const value = FormElementParseService.convertAttrValue(attr.value);
                action[name] = value;
            });
            return action;
        });

    }


    private handleTemplate() {

        const root = this.findElementById('template');

        if (!root || root.children.length === 0) {
            return;
        }

        for (const el of root.children) {
            if (el.tagName === 'a-row') {
                this.handleRow(el);
            }
        }

    }


    private handleRow(el: ASTElement) {
        let row: string[] = [];

        this._layout.push(row);

        for (const col of el.children) {
            if (col.children.length !== 1) {
                continue;
            }

            const child = col.children[0];

            const control = FormElementParseService.buildControlOf(child);
            if (!control) {
                continue;
            }

            const type = control.type;
            let key = control.key;

            if (type === schema.FormControlType.Html) {
                this._count++;
                key = control.key = `${type}${this._count}`;
            } else {

                if (this._controls[key]) {
                    throw new Error(`control key repeat: ${key}`);
                }

                if (type === schema.FormControlType.Sheet) {
                    const sheet = control as schema.FormSheet;
                    const keys: string[] = [];
                    for (const scol of sheet.columns) {
                        if (keys.indexOf(scol.key) > -1) {
                            throw new Error(`<a-sheet key="${key}"> column key repeat: ${scol.key}`);
                        }
                        keys.push(scol.key);
                    }
                }
            }

            row.push(key);
            this.controls[key] = control;
        }
    }


    private handleScript() {

        const el = this.findElementById('customScript');
        if (el && el.innerHTML) {
            el.innerHTML = el.innerHTML.replace(/\bwindow.parent.document\b/g, 'document');
        }

        const els = this.findElementsByClass('templateScript');
        if (els.length > 0) {
            for (const sel of els) {
                const idx = this._elements.indexOf(sel);
                if (idx > -1) {
                    this._elements.splice(idx, 1);
                }
            }
        }
    }


}