

import { Component, Vue, Prop, Watch, Inject } from "vue-property-decorator";

import common from "@cloudpivot/common";
import { Sheet, SheetColumn, PrintNodeSettings } from '@/config/print/dataStructure';

import { namespace } from "vuex-class";

const PrintVuex = namespace("Print/Print");

@Component({
    name: 'print-sheet',
    components: {
        H3SizeRectangle: common.components.pc.H3SizeRectangle
    }
})
export default class PrintSheet extends Vue {

    @PrintVuex.Mutation("setAttrs") setAttrs!: any;

    @PrintVuex.Mutation("updateNode") updateNode!: Function;

    @Prop({
        default: () => ({})
    })
    item !: any

    selectedCol = -1;

    selectedIsBody = false;

    cellClick = false;

    get active() {
        return this.item.active;
    }

    @Watch('active', {
        immediate: true
    })
    onItemChange(newVal: any, oldVval: any) {
        if (this.cellClick) {
            this.cellClick = false;
            return;
        }
        this.clearSelected();
    }

    clearSelected() {
        this.selectedCol = -1;
        this.selectedIsBody = false;
    }

    onSelectCol(index: number, isBody: boolean) {
        this.item.active = false;
        this.cellClick = true;

        this.selectedCol = index;
        this.selectedIsBody = isBody;
        this.$emit('selectCell', {
            isTitle: !isBody,
            colIndex: index
        })

        const col = this.item.columns[index];
        const obj = isBody ? col.rowSettings : col;
        this.setAttrs(obj);

        this.$nextTick(() => this.cellClick = false);
    }

    onColResize(col: SheetColumn, data: {
        direction: string;
        point: any;
    }, index: number) {

        let width = col.widthValue;
        let height = this.item.headHeight;

        const { point, direction } = data;
        switch (direction) {
            case "left":
                width += point.x * -1;
                break;
            case "right":
                width += point.x;
                break;
            case "top":
                height += point.y * -1;
                break;
            case "bottom":
                height += point.y;
                break;
            case "leftTop":
                width += point.x * -1;
                height += point.y * -1;
                break;
            case "rightBottom":
                width += point.x;
                height += point.y;
                break;
            case "leftBottom":
                height += point.y;
                width += point.x * -1;
                break;
            case "rightTop":
                height += point.y * -1;
                width += point.x;
                break;
        }

        const minWidth = 20;

        if (width < minWidth) {
            width = minWidth;
        }

        if (height < 10) {
            height = 10;
        }

        if (direction.search(/left/i) > -1) {
            if (index > 0) {
                const leftCol = this.item.columns[index - 1];
                leftCol.widthValue += col.widthValue - width;
                if (leftCol.widthValue < minWidth) {
                    width += leftCol.widthValue - minWidth;
                    leftCol.widthValue = minWidth;
                }
            }
        } else if (direction.search(/right/i) > -1) {
            if (index < this.item.columns.length - 1) {
                const rightCol = this.item.columns[index + 1];
                rightCol.widthValue += col.widthValue - width;
                if (rightCol.widthValue < minWidth) {
                    width += rightCol.widthValue - minWidth;
                    rightCol.widthValue = minWidth;
                }
            }
        }

        col.widthValue = width;
        this.item.headHeight = height;

        // this.setAttrs(Object.assign({},this.item, {
        //     columns: this.item.columns.slice()
        // }));
        this.updateNode({
            id: this.item.id,
            page: 0,
            node: Object.assign({}, this.item)
        });

        this.emitBodyResize(direction, point);
    }

    getColStyle(col: SheetColumn) {
        const style = PrintNodeSettings.buildStyleOf(col);
        style.width = `${col.widthValue}px`;
        style.border = `${this.item.borderWidth}px ${this.item.borderColor} solid`;
        delete style['vertical-align'];
        // this.handleCellStyle(col, style);

        return style;
    }

    getRectStyle(col: SheetColumn, height : number) {
        const style: any = {};
        if (col.fontUnderline) {
            style['text-decoration'] = 'underline';
        }
        
        if(height > 0){
            style.height = `${height}px`;
        }
        return style;
    }

    // getRowStyle(col: SheetColumn) {
    //     const style = PrintNodeSettings.buildStyleOf((col.rowSettings || col));
    //     this.handleCellStyle(col, style);
    //     return style;
    // }

    getRowText(col: SheetColumn) {
        if (col.rowSettings.bindSource) {
            return `{${col.rowSettings.bindSource.name}}`;
        } else if (col.isSequence) {
            return '1';
        }
        return '';
    }

    // handleCellStyle(col: SheetColumn, style: any) {
    //     style.width = `${col.widthValue}px`;
    //     style.border = `${this.item.borderWidth}px ${this.item.borderColor} solid`;
    //     delete style['vertical-align'];
    //     return style;
    // }

    onBodyResize(col: SheetColumn, data: {
        direction: string;
        point: any;
    }, index: number) {
        const { point, direction } = data;

        if (direction.search(/left/i) > -1) {
            const point2 = Object.assign({}, point);
            point2.y = 0;
            this.onColResize(col, {
                direction: 'left',
                point: point2
            }, index);
        } else if (direction.search(/right/i) > -1) {
            const point2 = Object.assign({}, point);
            point2.y = 0;
            this.onColResize(col, {
                direction: 'right',
                point: point2
            }, index);
        }

        this.emitBodyResize(direction, point);
    }

    emitBodyResize(direction: string, point: any) {

        if (direction.search(/bottom/i) > -1) {
            const point2 = Object.assign({}, point);
            point2.x = 0;
            this.$emit('bodyResize', {
                direction: 'bottom',
                point: point2
            });
        } else if (direction.search(/top/i) > -1) {
            const point2 = Object.assign({}, point);
            point2.x = 0;
            // point2.y *= -1;
            this.$emit('bodyResize', {
                direction: 'top',
                point: point2
            });
        }
    }

    onMousedown(event: MouseEvent) {
        event.stopPropagation();
    }
}