import Graph from './graph';
export default class AF {
  graph: Graph;
  start: number;
  end: number;
  n: number = 0;
  isAF = true;
  theStack: Array<number> =[];
  counterexample: string = '';
  tempList: Array<number> =[] ;
  result: Array<string> = [];
  constructor(graph: Graph, start: number, end: number) {
    this.graph = graph;
    this.start = start;
    this.end = end;
  }
  getResult() {
    this.graph.printGraph();
    this.n = this.graph.getN();
    this.theStack = [];
    
    if (!this.isConnectable(this.start, this.end)) {
      this.isAF = false;
      this.counterexample = '不能联通';
    } else {
      for (let j = 0; j < this.n; j++){
        this.tempList = [];
        for (let i = 0; i < this.n; i++) {
					this.tempList.push(0);
        }
        this.graph.getVertexList()[j].setAllVisitedList(this.tempList);
      }
      this.isAF = this.af(this.start, this.end);
    }
    return Array.from(new Set(this.result));
  }

  af(start:number, end: number) {
    this.graph.getVertexList()[start].setWasVisited(true);

    this.theStack.push(start);
    const len = this.theStack.length;
    while(this.theStack.length > 0) {
      const v = this.getAdjUnvisitedVertex(this.theStack[this.theStack.length - 1]);
      if (v === -1) {
        this.tempList = [];
        for (let i=0; i < this.n; i++) {
          this.tempList.push(0);
        }
        this.graph.getVertexList()[this.theStack[this.theStack.length - 1]].setAllVisitedList(this.tempList);
        this.theStack.splice(this.theStack.length-1, 1);
      } else {
        this.theStack.push(v);
      }
      if (this.theStack.length > 0 && end ===this.theStack[this.theStack.length -1]){
        this.graph.getVertexList()[end].setWasVisited(false);
        this.printTheStack(this.theStack);
        this.theStack.splice(this.theStack.length-1, 1);
      }
    }
    return this.isAF;
  }

  isConnectable(start:number, end: number){
    const queue : any[] = [];
    const visited = new Set<number>();
    queue.push(start);
    while (queue.length >0 ) {
      for (let j=0; j < this.n; j++) {
        if (this.graph.getAdjMat()[start][j] === 1 && !visited.has(j)) {
          queue.push(j);
        }
      }
      if (this.contanins(queue, end)) {
        return true;
      } else {
        visited.add(queue[0]);
        queue.shift();
        if (queue.length > 0) {
          start = queue[0];
        }
      }
    }
    return false;
  }

  getAdjUnvisitedVertex(v:number) {
    const list = this.graph.getVertexList()[v].getAllVisitedList();
    
		for (let j = 0; j < this.n; j++) {
			if (this.graph.getAdjMat()[v][j] == 1 && list[j] == 0
					&& !this.contanins(this.theStack, j)) {
				this.graph.getVertexList()[v].setVisited(j);
				return j;
			}
		}
		return -1;
	}

	printTheStack(theStack2: Array<number>) {
    for (let i = theStack2.length-1; i >=0 ; i--) {
      const index:number = theStack2[i];
      this.result.push(this.graph.getNode(index));
      console.log(this.graph.displayVertex(theStack2[i]));
      if (i !== 0) {
        console.log('-->');
      }
    }
	}

  contanins(array: Array<any>, val: any) {
    const res = array.find((value) => {
      return val === value;
    });
    return res !== undefined;
  }
}