import { NavLink } from "react-router";
import { ICONS } from "../../constants/icons";
import { NAV_BY_ROLE, NAV_PATHS } from "../../constants/navigation";
import { ROUTES } from "../../constants/routes";
import { useI18n } from "../../i18n/I18nContext";
import { useCurrentUser } from "../../store/AuthContext";
import { cx } from "../../utils/cx";
import styles from "./layout.module.css";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { t } = useI18n();
  const user = useCurrentUser();

  return (
    <aside className={cx(styles.sidebar, open && styles.sidebarOpen)}>
      <div className={styles.brand}>
        <span>{t.appName}</span>
        <button type="button" className={cx(styles.iconButton, styles.closeButton)} onClick={onClose} aria-label={t.layout.closeMenu}>
          {ICONS.close}
        </button>
      </div>
      <nav className={styles.nav}>
        {NAV_BY_ROLE[user.role].map((key) => (
          <NavLink
            key={key}
            to={NAV_PATHS[key]}
            end={NAV_PATHS[key] === ROUTES.dashboard}
            className={styles.navLink}
            data-tour={key}
            onClick={onClose}
          >
            <span aria-hidden="true">{ICONS[key]}</span>
            {t.nav[key]}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
