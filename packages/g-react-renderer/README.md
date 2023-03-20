### node 的样式的编写规则

#### 是否可拖拽

> 鼠标 mousedown 一个 node 节点并且移动的时候，是否可以移动画布上的内容

```tsx
// 节点的属性
export interface INodeProps {
  itemName: string;
  itemColor: string;
  img: string;
  itemDesc?: string;
  selected: boolean;
  hovered: boolean;
  error: boolean;
  // 是否可拖拽，默认可拖拽
  draggable?: boolean;
}

// 如果想要在某个shape上覆盖 nodeProps: INodeProps 上的 draggable 属性，可以按照如下设置
const DemoNode = (props: INodeProps) => {
  return (
    <Shape>
      <Rect name="border-wrapper" draggable={false} style={{ 
        borderRadius: 4, 
      }}>
        <Text name="border-wrapper-text">内容</Text>
      </Rect>
    </Shape>
  )
}

export default DemoNode;
```

#### 透明度相关

> - 透明度相关属性包括：opacity，fillOpacity，strokeOpacity， 适用的元素：Rect, Image;
> - fillOpacity 和 strokeOpacity 的优先级高于 opacity;
> - 透明度还需要考虑元素的父子嵌套关系，子元素的透明度 = 父元素的透明度 * 自身透明度，透明度默认值为：globalAlpha，未设置则为 1;

- opacity: Number 范围 [0, 1]
- fillOpacity: Number 范围 [0, 1]
- strokeOpacity: Number 范围 [0, 1]

```tsx
export interface IOpacityStyle {
  opacity?: number;
  fillOpacity?: number;
  strokeOpacity?: number;
}

const DemoNode = (props: INodeProps) => {
  return (
    <Shape>
      <Rect name="border-wrapper" draggable={false} style={{ 
        borderRadius: 4, 
        opacity: 0.5,
        fillOpacity: 0.5,
        strokeOpacity: 0.5,
      }}>
        <Text name="border-wrapper-text">内容</Text>
      </Rect>
    </Shape>
  )
}
```

