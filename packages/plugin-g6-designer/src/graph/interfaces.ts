import { Node, Edge, Shape, Graph, Item, IGroup } from '@antv/g6';
import {
  ItemType,
  ItemState,
  GraphType,
  GraphState,
  LabelState,
  EditorCommand,
  GraphCommonEvent,
  GraphNodeEvent,
  GraphEdgeEvent,
  GraphCanvasEvent,
  GraphCustomEvent,
} from '@alilc/lce-graph-tools';

interface LabelStyle {
  fill?: string;
  stroke?: string;
  lineWidth?: number;
  opacity?: number;
  font?: string;
  fontSize?: number;

  [propName: string]: any;
}

interface NodeLabelCfg {
  position?: 'center' | 'top' | 'right' | 'bottom' | 'left';
  offset?: number;
  style?: LabelStyle;
}

interface EdgeLabelCfg {
  position?: 'start' | 'end' | 'center';
  refX?: number;
  refY?: number;
  style?: LabelStyle;
  autoRotate?: boolean;
}

/**
 * G6 内置节点
 * @see https://www.yuque.com/antv/g6/internal-node
 */
export interface NodeModel {
  id?: string;
  x?: number;
  y?: number;
  size?: number | number[];
  anchorPoints?: number[][];
  shape?: string;
  style?: {
    fill?: string;
    stroke?: string;
    lineWidth?: number;
    shadowColor?: string;
    shadowBlur?: number;
    shadowOffsetX?: number;
    shadowOffsetY?: number;

    [propName: string]: any;
  };
  label?: string;
  labelCfg?: NodeLabelCfg;

  // 节点中心位置
  center?: 'center' | 'topLeft';

  [propName: string]: any;
}

/**
 * G6 内置边线
 * @see https://www.yuque.com/antv/g6/internal-edge
 */
export interface EdgeModel {
  source: string;
  target: string;
  sourceAnchor?: number;
  targetAnchor?: number;
  startPoint?: {
    x: number;
    y: number;
  };
  endPoint?: {
    x: number;
    y: number;
  };
  shape?: string;
  style?: {
    stroke?: string;
    lineWidth?: number;
    lineAppendWidth?: number;
    endArrow: boolean;
    strokeOpacity: number;
    shadowColor?: string;
    shadowBlur?: number;
    shadowOffsetX?: number;
    shadowOffsetY?: number;
  };
  label?: string;
  labelCfg?: EdgeLabelCfg;

  [propName: string]: any;
}

/**
 * FlowData
 */
export interface FlowData {
  nodes: NodeModel[];
  edges: EdgeModel[];
}

/**
 * MindData
 */
export interface MindData extends NodeModel {
  side?: 'left' | 'right';
  children?: MindData[];
  collapsed?: boolean;
}

/**
 * G6 自定义形状
 * @see https://www.yuque.com/antv/g6/shape-api
 */
export interface CustomShape<T, M> {
  // 配置
  options?: any;

  // 属性
  itemType?: ItemType;

  // 绘制
  draw?(model: M, group: IGroup): Shape;
  drawShape?(model: M, group: IGroup): void;
  drawLabel?(model: M, group: IGroup): Shape;
  afterDraw?(model: M, group: IGroup): void;

  // 更新
  update?(model: M, item: T): void;
  afterUpdate?(model: M, item: T): void;
  shouldUpdate?(type: ItemType): boolean;
  setState?(name: ItemState, value: boolean, item: T): void;

  // 通用
  getShape?(type: ItemType): CustomNode | CustomEdge;
  getLabelStyle?(model: M, labelConfig: NodeLabelCfg | EdgeLabelCfg, group: IGroup): React.CSSProperties;
  getLabelStyleByPosition?(model: M, labelConfig: NodeLabelCfg | EdgeLabelCfg, group: IGroup): React.CSSProperties;
  getShapeStyle?(model: M): React.CSSProperties;

  [propName: string]: any;
}

/**
 * G6 自定义节点
 */
export interface CustomNode<M = NodeModel> extends CustomShape<Node, M> {
  // 属性
  labelPosition?: 'center' | 'top' | 'right' | 'bottom' | 'left';

  // 通用
  getAnchorPoints?(model: M): number[][];
  getSize?(model: M): number[];
}

/**
 * G6 自定义边线
 */
export interface CustomEdge<M = EdgeModel> extends CustomShape<Edge, M> {
  // 属性
  labelPosition?: 'start' | 'end' | 'center';
  labelAutoRotate?: boolean;

  // 通用
  getControlPoints?: number[][];
  getPath?(points: Array<{ x: number; y: number }>): [];
  getPathPoints?(model: M): any;
}

/**
 * G6 自定义行为
 * @see https://www.yuque.com/antv/g6/behavior-api
 */
export interface Behavior {
  graph?: Graph;
  graphType?: GraphType;
  graphMode?: string;
  getEvents(): {
    [propName in GraphNativeEvent]?: string;
  };
  getDefaultCfg?(): object;
  shouldBegin?(e?: GraphEvent): boolean;
  shouldUpdate?(e?: GraphEvent): boolean;
  shouldEnd?(e?: GraphEvent): boolean;
}

export interface GraphEvent {
  x: number;
  y: number;
  canvasX: number;
  canvasY: number;
  clientX: number;
  clientY: number;
  event: MouseEvent;
  target: Shape;
  type: string;
  currentTarget: object;
  item: Item;
  removed: boolean;
  timeStamp: number;
  bubbles: boolean;
  defaultPrevented: boolean;
  cancelable: boolean;
}

export interface Command<P = object, G = Graph> {
  /** 命令名称 */
  name: string;
  /** 命令参数 */
  params: P;
  /** 是否可以执行 */
  canExecute(graph: G): boolean;
  /** 是否应该执行 */
  shouldExecute(graph: G): boolean;
  /** 是否可以撤销 */
  canUndo(graph: G): boolean;
  /** 初始命令 */
  init(graph: G): void;
  /** 执行命令 */
  execute(graph: G): void;
  /** 撤销命令 */
  undo(graph: G): void;
  /** 命令快捷键 */
  shortcuts: string[] | string[][];
}

export interface CommandEvent {
  name: EditorCommand;
  params: object;
}

export interface GraphStateEvent {
  graphState: GraphState;
}

export interface LabelStateEvent {
  labelState: LabelState;
}

export type GraphNativeEvent = GraphCommonEvent | GraphNodeEvent | GraphEdgeEvent | GraphCanvasEvent | GraphCustomEvent;

export type GraphReactEvent =
  | keyof typeof GraphCommonEvent
  | keyof typeof GraphNodeEvent
  | keyof typeof GraphEdgeEvent
  | keyof typeof GraphCanvasEvent
  | keyof typeof GraphCustomEvent;

export type GraphReactEventProps = Record<GraphReactEvent, (e: any) => void>;
