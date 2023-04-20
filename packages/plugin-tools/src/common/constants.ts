export enum ItemType {
  Node = 'node',
  Edge = 'edge',
}
export enum EditorCommand {
  Undo = 'undo',
  Redo = 'redo',
  Add = 'add',
  Update = 'update',
  Remove = 'remove',
  Copy = 'copy',
  Paste = 'paste',
  PasteHere = 'pasteHere',
  ZoomIn = 'zoomIn',
  ZoomOut = 'zoomOut',
  Topic = 'topic',
  Subtopic = 'subtopic',
  Fold = 'fold',
  Unfold = 'unfold',
  insertChildNode = "insertChildNode",
  insertSiblingNode = "insertSiblingNode",
  removeItem = "removeItem",
  onNodeMenusMouseMove = "onNodeMenusMouseMove",
  onNodeMenusMouseLeave = "onNodeMenusMouseLeave",
  onNodeMenusClickMenuItem = "onNodeMenusClickMenuItem",
}

export enum ItemState {
  Active = 'active',
  Selected = 'selected',
  HighLight = 'highLight',
  Error = 'error',
}

export enum GraphState {
  NodeSelected = 'nodeSelected',
  EdgeSelected = 'edgeSelected',
  MultiSelected = 'multiSelected',
  CanvasSelected = 'canvasSelected',
}

export enum LabelState {
  Hide = 'hide',
  Show = 'show',
}

export enum EditorEvent {
  onBeforeExecuteCommand = 'onBeforeExecuteCommand',
  onAfterExecuteCommand = 'onAfterExecuteCommand',
  onGraphStateChange = 'onGraphStateChange',
  onLabelStateChange = 'onLabelStateChange',
}

export const FLOW_CONTAINER_ID = 'J_FlowContainer';
export const MIND_CONTAINER_ID = 'J_MindContainer';

export const LABEL_DEFAULT_TEXT = '新建节点';

export enum RendererType {
  Canvas = 'canvas',
  Svg = 'svg',
}
export enum GraphType {
  Flow = 'flow',
  Mind = 'mind',
}

export enum GraphMode {
  Default = 'default',
  AddNode = 'addNode',
  Readonly = 'readonly',
}

export enum GraphCommonEvent {
  onClick = 'click',
  onDoubleClick = 'dblclick',
  onMouseEnter = 'mouseenter',
  onMouseMove = 'mousemove',
  onMouseOut = 'mouseout',
  onMouseOver = 'mouseover',
  onMouseLeave = 'mouseleave',
  onMouseDown = 'mousedown',
  onMouseUp = 'mouseup',
  onContextMenu = 'contextmenu',
  onDragStart = 'dragstart',
  onDrag = 'drag',
  onDragEnd = 'dragend',
  onDragEnter = 'dragenter',
  onDragLeave = 'dragleave',
  onDrop = 'drop',
  onKeyDown = 'keydown',
  onKeyUp = 'keyup',
  onTouchStart = 'touchstart',
  onTouchMove = 'touchmove',
  onTouchEnd = 'touchend',
  wheel = 'wheel'
}

export enum GraphNodeEvent {
  onNodeClick = 'node:click',
  onNodeDoubleClick = 'node:dblclick',
  onNodeMouseEnter = 'node:mouseenter',
  onNodeMouseMove = 'node:mousemove',
  onNodeMouseOut = 'node:mouseout',
  onNodeMouseOver = 'node:mouseover',
  onNodeMouseLeave = 'node:mouseleave',
  onNodeMouseDown = 'node:mousedown',
  onNodeMouseUp = 'node:mouseup',
  onNodeContextMenu = 'node:contextmenu',
  onNodeDragStart = 'node:dragstart',
  onNodeDrag = 'node:drag',
  onNodeDragEnd = 'node:dragend',
  onNodeDragEnter = 'node:dragenter',
  onNodeDragLeave = 'node:dragleave',
  onNodeDrop = 'node:drop',
}

export enum GraphEdgeEvent {
  onEdgeClick = 'edge:click',
  onEdgeDoubleClick = 'edge:dblclick',
  onEdgeMouseEnter = 'edge:mouseenter',
  onEdgeMouseMove = 'edge:mousemove',
  onEdgeMouseOut = 'edge:mouseout',
  onEdgeMouseOver = 'edge:mouseover',
  onEdgeMouseLeave = 'edge:mouseleave',
  onEdgeMouseDown = 'edge:mousedown',
  onEdgeMouseUp = 'edge:mouseup',
  onEdgeContextMenu = 'edge:contextmenu',
}

export enum GraphCanvasEvent {
  onCanvasClick = 'canvas:click',
  onCanvasDoubleClick = 'canvas:dblclick',
  onCanvasMouseEnter = 'canvas:mouseenter',
  onCanvasMouseMove = 'canvas:mousemove',
  onCanvasMouseOut = 'canvas:mouseout',
  onCanvasMouseOver = 'canvas:mouseover',
  onCanvasMouseLeave = 'canvas:mouseleave',
  onCanvasMouseDown = 'canvas:mousedown',
  onCanvasMouseUp = 'canvas:mouseup',
  onCanvasContextMenu = 'canvas:contextmenu',
  onCanvasDragStart = 'canvas:dragstart',
  onCanvasDrag = 'canvas:drag',
  onCanvasDragEnd = 'canvas:dragend',
  onCanvasDragEnter = 'canvas:dragenter',
  onCanvasDragLeave = 'canvas:dragleave',
}

export enum GraphCustomEvent {
  onBeforeAddItem = 'beforeadditem',
  onAfterAddItem = 'afteradditem',
  onBeforeRemoveItem = 'beforeremoveitem',
  onAfterRemoveItem = 'afterremoveitem',
  onBeforeUpdateItem = 'beforeupdateitem',
  onAfterUpdateItem = 'afterupdateitem',
  onBeforeItemVisibilityChange = 'beforeitemvisibilitychange',
  onAfterItemVisibilityChange = 'afteritemvisibilitychange',
  onBeforeItemStateChange = 'beforeitemstatechange',
  onAfterItemStateChange = 'afteritemstatechange',
  onBeforeRefreshItem = 'beforerefreshitem',
  onAfterRefreshItem = 'afterrefreshitem',
  onBeforeItemStatesClear = 'beforeitemstatesclear',
  onAfterItemStatesClear = 'afteritemstatesclear',
  onBeforeLayout = 'beforelayout',
  onAfterLayout = 'afterlayout',
  onBeforeConnect = 'beforeconnect',
  onAfterConnect = 'afterconnect',
}

export enum customEvent {
  onImportTeam = 'importTeam',
  onCollapseChange = 'collapseChange',
}
