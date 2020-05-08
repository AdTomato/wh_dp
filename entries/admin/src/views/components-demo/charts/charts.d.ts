declare namespace Charts {
  interface BarOptions {
    chartTitle: string,
    barTitle: string,
    x: Array<string|number>,
    y: Array<number|string>,
    barColor?: string,
    color?: Array<string>,
  }

  interface PieBlock {
    value: string | number,
    name: string
  }
  interface PieOptions {
    chartTitle: string,
    list: Array<PieBlock>,
    radius?: Array<string>,
    color?: Array<string>,
  }
}
