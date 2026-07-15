export interface MenuOption {
  IdMenuOption: number;
  nameMenuOption: string;
  pathMenuOption: string | null;
  parentMenuOption: number | null;
  orderMenuOption: number;
  statusMenuOption: boolean;
}