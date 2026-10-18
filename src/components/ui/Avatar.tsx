import styles from "./Avatar.module.css";

const INITIALS_COUNT = 2;

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, INITIALS_COUNT)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

export function Avatar({ name }: { name: string }) {
  return (
    <span className={styles.avatar} aria-hidden="true">
      {initialsOf(name)}
    </span>
  );
}
