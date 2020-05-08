import Vertex from './vertex';
import * as WorkflowNamespace from '@/typings/workflow';
import Line from '@/common/workflow/Line';

export default class Graph {
  private vertexList: Array<Vertex>;
  private adjMat: Array<Array<number>>;
  private idIndex: Map<string, number> = new Map();
  private nodes: Array<WorkflowNamespace.Activity> = [];

  private nVerts: number;

  private MAX_VERTS: number;
  
  getVertexList() {
    return this.vertexList;
  }

  getAdjMat() {
    return this.adjMat;
  }

  getN() {
    return this.MAX_VERTS; // todo  换成实际的节点数
  }

  initAdjMat() {
    const dArray = new Array(this.MAX_VERTS);
    for (let i = 0, len = this.MAX_VERTS; i < len; i += 1) {
      dArray[i] = Array(this.MAX_VERTS).fill(0);
    }
    return dArray;
  }

  constructor(nodes: Array<WorkflowNamespace.Activity>, lines: Array<Line>) {
    this.nodes = nodes;
    this.MAX_VERTS = nodes.length;
    this.adjMat = this.initAdjMat();
    this.vertexList = new Array<Vertex>(nodes.length);
    this.nVerts = 0;

    this.initVertex(nodes);
    this.initIdIndex(nodes);
    this.initEdges(lines);
  }

  initVertex(nodes: Array<WorkflowNamespace.Activity>) {
    nodes.forEach((node, index) => {
      this.addVertex(node.activityCode);
    });
  }

  initIdIndex(nodes: Array<WorkflowNamespace.Activity>) {
    nodes.forEach((node, index) => {
      this.idIndex.set((node.ID as string), index);
    });
  }

  initEdges(lines: Array<Line>) {
    lines.forEach((line: Line, index: number) => {
      if (line.startActivity && line.endActivity) {
        this.addEdge(this.idIndex.get(line.startActivity.ID as string), this.idIndex.get(line.endActivity.ID as string));
      }
    });
  }

  private addEdge(start:any, end:any) {
    this.adjMat[start][end] = 1;
  }

  addVertex(label: string) {
    this.vertexList[this.nVerts++] = new Vertex(label);
  }

  displayVertex(i:number) {
    return this.vertexList[i].getLabel();
  }

  displayVertexVisited(i: number) {
    return this.vertexList[i].WasVisited();
  }

  getNode(index: number) {
    return this.nodes[index].activityCode;
  }

  printGraph() {
		for (let i = 0; i < this.MAX_VERTS; i++) {
      // console.log(`vertex${this.displayVertex(i)}`);

			for (let j = 0; j < this.MAX_VERTS; j++) {
        // console.log(`${this.displayVertex(i)}-${this.displayVertex(j)} ${this.adjMat[i][j]}`);
			}
		}

	}

}