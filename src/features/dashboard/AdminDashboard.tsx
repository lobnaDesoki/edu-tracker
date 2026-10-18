import { Link } from "react-router";
import { Card } from "../../components/ui/Card";
import { ItemRow } from "../../components/ui/ItemRow";
import { PageHeader } from "../../components/ui/PageHeader";
import { StatCard } from "../../components/ui/StatCard";
import { ICONS } from "../../constants/icons";
import { NAV_BY_ROLE, NAV_PATHS, type NavKey } from "../../constants/navigation";
import { ROLES } from "../../constants/roles";
import { useI18n } from "../../i18n/I18nContext";
import { usersByRole } from "../../services/academics";
import { useCurrentUser } from "../../store/AuthContext";
import { useData } from "../../store/DataContext";
import type { Role } from "../../types";

const ROLE_ICON: Record<Role, string> = {
  admin: ICONS.settings,
  instructor: ICONS.manageCourses,
  student: ICONS.students,
  parent: ICONS.families,
};

const SHORTCUT_EXCLUDED: NavKey[] = ["dashboard", "settings"];

export function AdminDashboard() {
  const { t } = useI18n();
  const { data } = useData();
  const user = useCurrentUser();
  // Shortcuts to the admin pages, described with their tour text.
  const shortcuts = NAV_BY_ROLE.admin.filter((key) => !SHORTCUT_EXCLUDED.includes(key));

  return (
    <>
      <PageHeader title={t.dashboard.greeting(user.name)} subtitle={t.dashboard.adminSubtitle} />
      <div className="grid">
        {ROLES.map((role) => (
          <StatCard key={role} icon={ROLE_ICON[role]} label={t.roles[role]} value={usersByRole(data, role).length} />
        ))}
        <StatCard icon={ICONS.courses} label={t.dashboard.activeCourses} value={data.courses.length} />
      </div>
      <Card>
        <ul className="list-plain">
          {shortcuts.map((key) => (
            <ItemRow key={key} icon={ICONS[key]} title={<Link to={NAV_PATHS[key]}>{t.nav[key]}</Link>} meta={t.tour.steps[key]} />
          ))}
        </ul>
      </Card>
    </>
  );
}
