export interface ListItem<T> {
  name?: string | null;
  children?: T[] | null;
  message?: string | null;
  link?: string | null;
}
