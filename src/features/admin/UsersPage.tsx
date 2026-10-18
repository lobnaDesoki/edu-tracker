import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { TextField } from "../../components/ui/Field";
import { PageHeader } from "../../components/ui/PageHeader";
import { Table } from "../../components/ui/Table";
import { Tabs } from "../../components/ui/Tabs";
import { ICONS } from "../../constants/icons";
import { ROLE_TONE, ROLES } from "../../constants/roles";
import { useI18n } from "../../i18n/I18nContext";
import { childrenOf, parentsOf } from "../../services/academics";
import { useCurrentUser } from "../../store/AuthContext";
import { useData } from "../../store/DataContext";
import type { Role, User } from "../../types";
import { CreateUserModal } from "./CreateUserModal";

type RoleFilter = Role | "all";

export function UsersPage() {
  const { t } = useI18n();
  const { data, dispatch } = useData();
  const currentUser = useCurrentUser();
  const [filter, setFilter] = useState<RoleFilter>("all");
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<User | null>(null);

  const search = query.trim().toLowerCase();
  const users = data.users.filter(
    (user) =>
      (filter === "all" || user.role === filter) &&
      (user.name.toLowerCase().includes(search) || user.email.includes(search)),
  );

  const linkedNames = (user: User) => {
    const linked = user.role === "parent" ? childrenOf(data, user) : user.role === "student" ? parentsOf(data, user.id) : [];
    return linked.map((u) => u.name).join(", ") || t.common.none;
  };

  return (
    <>
      <PageHeader
        title={t.nav.users}
        actions={
          <Button icon={ICONS.plus} onClick={() => setCreating(true)}>
            {t.admin.createAccount}
          </Button>
        }
      />
      <Card>
        <Tabs<RoleFilter>
          label={t.common.role}
          tabs={[{ id: "all", label: t.common.all }, ...ROLES.map((role) => ({ id: role, label: t.roles[role] }))]}
          active={filter}
          onChange={setFilter}
        />
        <TextField label={t.common.search} type="search" placeholder={t.admin.searchPlaceholder} value={query} onChange={(e) => setQuery(e.target.value)} />
        <Table<User>
          rows={users}
          rowKey={(user) => user.id}
          emptyMessage={t.admin.noResults}
          columns={[
            {
              key: "name",
              header: t.common.name,
              render: (user) => (
                <span className="row">
                  <strong>{user.name}</strong>
                  {user.id === currentUser.id && <Badge>{t.admin.you}</Badge>}
                  {user.mustChangePassword && <Badge tone="warning">{t.auth.firstLoginTag}</Badge>}
                </span>
              ),
            },
            { key: "role", header: t.common.role, render: (user) => <Badge tone={ROLE_TONE[user.role]}>{t.roles[user.role]}</Badge> },
            { key: "email", header: t.common.email, render: (user) => user.email },
            {
              key: "phone",
              header: t.common.phone,
              render: (user) => (
                <span className="stack-sm">
                  {user.phone || t.common.none}
                  <Badge tone={user.phoneVerified ? "success" : "neutral"}>
                    {user.phoneVerified ? t.auth.phoneVerified : t.auth.phoneNotVerified}
                  </Badge>
                </span>
              ),
            },
            { key: "linked", header: t.admin.linkedTo, render: linkedNames },
            {
              key: "actions",
              header: t.common.actions,
              render: (user) => (
                <Button
                  size="sm"
                  variant="ghost"
                  icon={ICONS.delete}
                  disabled={user.id === currentUser.id}
                  onClick={() => setDeleting(user)}
                >
                  {t.common.delete}
                </Button>
              ),
            },
          ]}
        />
      </Card>
      {creating && <CreateUserModal onClose={() => setCreating(false)} />}
      {deleting && (
        <ConfirmDialog
          title={t.admin.deleteTitle}
          message={t.admin.deleteConfirm(deleting.name)}
          confirmLabel={t.common.delete}
          onClose={() => setDeleting(null)}
          onConfirm={() => {
            dispatch({ type: "user/delete", userId: deleting.id });
            setDeleting(null);
          }}
        />
      )}
    </>
  );
}
