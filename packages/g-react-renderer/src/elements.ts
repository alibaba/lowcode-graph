export const Shape = 'SHAPE';
export const Rect = 'RECT';
export const Text = 'TEXT';
export const Image = 'IMAGE';
export const IconFont = 'ICONFONT';
export const TextInstance = 'TEXT_INSTANCE';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'SHAPE': {
        name?: string;
        link?: string;
        style?: any;
        children?: any;
      },
      'RECT': {
        name: string;
        link?: string;
        style?: any;
        children?: any;
      },
      'IMAGE': {
        name: string;
        src: string;
        link?: string;
        style?: any;
        clip?: string;
        alt?: string;
      },
      'TEXT': {
        name: string,
        link?: string;
        style?: any,
        children?: any,
      }
    }
  }
}
