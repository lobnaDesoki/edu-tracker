import type { ReactNode } from "react";
import { EmptyState } from "./EmptyState";
import styles from "./Table.module.css";

export interface Column<T> {
  key: string;
  header: ReactNode;
  render: (row: T) => ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  emptyMessage: string;
}

export function Table<T>({ columns, rows, rowKey, emptyMessage }: TableProps<T>) {
  if (!rows.length) return <EmptyState message={emptyMessage} />;
  return (
    <div className={styles.scroll}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} scope="col">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)}>
              {columns.map((column) => (
                <td key={column.key}>{column.render(row)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
