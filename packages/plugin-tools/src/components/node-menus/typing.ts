export interface IMenuItem {
  id: string;
  label: string;
  value: string;
  hidden: boolean;
  [key: string]: any;
}

export interface IPosition {
  top: number;
  left: number;
}

export interface IUpdateProps {
  menus?: IMenuItem[];
  position?: IPosition;
}

