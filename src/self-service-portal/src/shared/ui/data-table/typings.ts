export type Column<T> = { key: keyof T; label: string; customRender?: (row: T) => React.ReactNode };
