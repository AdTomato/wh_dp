
export enum ControlPropertyType {

    FontSize = 'fontSize',
    
    FontStyle = 'fontStyle',

    Color = 'color',

    LineSize = 'lineSize',

    LineStyle = 'lineStyle',

    // VerticalAlign = 'verticalAlign',

    // HorizontalAlign = 'horizontalAlign',

    Border = 'border',

    TextAlign = 'textAlign',
}


export interface ControlProperty {

    key: string

    name?: string

    value: any

    type: ControlPropertyType

    tags?: string[]

}