import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { EmptyState } from "../../components/ui/EmptyState";
import { ItemRow } from "../../components/ui/ItemRow";
import { PageHeader } from "../../components/ui/PageHeader";
import { ICONS } from "../../constants/icons";
import { useLookups } from "../../hooks/useLookups";
import { useI18n } from "../../i18n/I18nContext";
import { useNotifications } from "../../store/NotificationsContext";

export function NotificationsPage() {
  const { t, l, formatDate } = useI18n();
  const { userName } = useLookups();
  const { notifications, unreadCount, isRead, markAllRead } = useNotifications();

  return (
    <>
      <PageHeader
        title={t.nav.notifications}
        actions={
          <Button variant="secondary" icon={ICONS.check} onClick={markAllRead} disabled={!unreadCount}>
            {t.notifications.markAllRead}
          </Button>
        }
      />
      <Card>
        {notifications.length ? (
          <ul className="list-plain">
            {notifications.map((notification) => (
              <ItemRow
                key={notification.id}
                icon={ICONS[notification.kind]}
                highlighted={!isRead(notification.id)}
                title={t.notifications.kinds[notification.kind]}
                meta={formatDate(notification.date)}
              >
                <p>
                  {t.notifications.body[notification.kind]({
                    subject: l(notification.subject),
                    course: l(notification.courseTitle),
                    student: userName(notification.studentId),
                    date: formatDate(notification.date),
                  })}
                </p>
              </ItemRow>
            ))}
          </ul>
        ) : (
          <EmptyState message={t.notifications.empty} />
        )}
      </Card>
    </>
  );
}
