import { Link } from "react-router";
import { ICONS } from "../../constants/icons";
import { ROUTES } from "../../constants/routes";
import { useI18n } from "../../i18n/I18nContext";
import { notificationsEnabledFor } from "../../services/notifications";
import { useActiveStudent } from "../../store/ActiveStudentContext";
import { useAuth, useCurrentUser } from "../../store/AuthContext";
import { useNotifications } from "../../store/NotificationsContext";
import { cx } from "../../utils/cx";
import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";
import { SelectField } from "../ui/Field";
import { LanguageToggle } from "./LanguageToggle";
import styles from "./layout.module.css";

export function Topbar({ onOpenMenu }: { onOpenMenu: () => void }) {
  const { t } = useI18n();
  const user = useCurrentUser();
  const { logout } = useAuth();
  const { unreadCount } = useNotifications();
  const { student, children, selectStudent } = useActiveStudent();

  return (
    <header className={styles.topbar}>
      <button type="button" className={cx(styles.iconButton, styles.menuButton)} onClick={onOpenMenu} aria-label={t.layout.openMenu}>
        {ICONS.menu}
      </button>

      {children.length > 0 && student && (
        <SelectField
          label={t.layout.viewingChild}
          hideLabel
          options={children.map((child) => ({ value: child.id, label: `${ICONS.students} ${child.name}` }))}
          value={student.id}
          onChange={(event) => selectStudent(event.target.value)}
        />
      )}

      <div className={styles.topbarEnd}>
        <LanguageToggle />
        {notificationsEnabledFor(user.role) && (
          <Link to={ROUTES.notifications} className={styles.iconButton} aria-label={t.layout.notificationsLabel(unreadCount)}>
            {ICONS.notifications}
            {unreadCount > 0 && <span className={styles.count}>{unreadCount}</span>}
          </Link>
        )}
        <div className={styles.user}>
          <Avatar name={user.name} />
          <div className={styles.userText}>
            <strong>{user.name}</strong>
            <span className="muted">{t.roles[user.role]}</span>
          </div>
        </div>
        <Button variant="ghost" size="sm" icon={ICONS.logout} onClick={logout}>
          {t.layout.logout}
        </Button>
      </div>
    </header>
  );
}
