export default class Vertex {
  wasVisited: boolean;

  label:string;

  allVisitedList: Array<number> = [];

  setAllVisitedList(allVisitedList:Array<number>):void {
    this.allVisitedList = allVisitedList;
  }

  getAllVisitedList() {
    return this.allVisitedList;
  }

  WasVisited() {
    return this.wasVisited;
  }

  setWasVisited(wasVisited: boolean) {
    this.wasVisited = wasVisited;
  }

  getLabel() {
    return this.label;
  }

  constructor(label:string) {
    this.label = label;
    this.wasVisited = false;
  }

  setVisited(j:number) {
    this.allVisitedList[j] = 1;
  }

}