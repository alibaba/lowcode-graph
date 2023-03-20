import { FunctionExt, EdgeView, CellView, Edge, Point, Registry, Line } from '@antv/x6';

/**
 * 合并 points
 * 三个点在一条直线上的，删掉中间点
 * @param edgeView 
 * @param routerPoints 
 * @returns 
 */
export function getVertices(edgeView: EdgeView, routerPoints: Array<any>) {
  const source = edgeView.sourceAnchor;
  const target = edgeView.targetAnchor;

  const points = [source, ...routerPoints, target]
  let indexArr: any[] = [];
  if (points.length > 2) {
    for (let i = 0; i <= points.length - 3; i++) {
      const isXEqual = Math.abs(points[i].x - points[i+1].x) < 1 && Math.abs(points[i+1].x - points[i+2].x) < 1;
      const isYEqual = Math.abs(points[i].y - points[i+1].y) < 1 && Math.abs(points[i+1].y - points[i+2].y) < 1;
      if (isXEqual || isYEqual) {
        indexArr.push(i+1);
      }
    }
  }

  const newPoints = points.filter((v, index) => !(indexArr as any).includes(index));
  return newPoints;
}

/**
 * 节点 ports 显示隐藏
 * @param ports 
 * @param show 
 */
export function showPorts(ports: NodeListOf<SVGAElement>, show: boolean) {
  for (let i = 0, len = ports.length; i < len; i = i + 1) {
    ports[i].style.visibility = show ? 'visible' : 'hidden';
  }
}
