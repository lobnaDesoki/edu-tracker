import styles from "./Tabs.module.css";

export interface TabItem<T extends string> {
  id: T;
  label: string;
}

interface TabsProps<T extends string> {
  tabs: TabItem<T>[];
  active: T;
  onChange: (id: T) => void;
  /** Accessible name of the tab list. */
  label: string;
}

export function Tabs<T extends string>({ tabs, active, onChange, label }: TabsProps<T>) {
  return (
    <div role="tablist" aria-label={label} className={styles.tabs}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={tab.id === active}
          className={styles.tab}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
