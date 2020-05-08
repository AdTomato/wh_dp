declare namespace treeSelector {
  interface treeItem {
    title: string
    value: string
    key: string
    children?: Array<treeItem>
    isLeaf: boolean
    selectable?: boolean
    dataRef?: {
      type?: string
    }
    _loaded ?: boolean
    // scopedSlots?: {
    //   title: string
    // }
  }
}