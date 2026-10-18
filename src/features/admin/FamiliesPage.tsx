import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { PageHeader } from "../../components/ui/PageHeader";
import { Table } from "../../components/ui/Table";
import { ICONS } from "../../constants/icons";
import { useI18n } from "../../i18n/I18nContext";
import { childrenOf, usersByRole } from "../../services/academics";
import { useData } from "../../store/DataContext";
import type { User } from "../../types";
import { LinkParentModal } from "./LinkParentModal";

/** Admin links parents to their children. */
export function FamiliesPage() {
  const { t } = useI18n();
  const { data, dispatch } = useData();
  const [linking, setLinking] = useState(false);

  return (
    <>
      <PageHeader
        title={t.nav.families}
        actions={
          <Button icon={ICONS.plus} onClick={() => setLinking(true)}>
            {t.admin.linkStudent}
          </Button>
        }
      />
      <Card>
        <Table<User>
          rows={usersByRole(data, "parent")}
          rowKey={(parent) => parent.id}
          emptyMessage={t.admin.noResults}
          columns={[
            {
              key: "parent",
              header: t.roles.parent,
              render: (p) => (
                <span className="stack-sm">
                  <strong>{p.name}</strong>
                  <span className="muted">{p.email}</span>
                </span>
              ),
            },
            {
              key: "children",
              header: t.admin.children,
              render: (p) => {
                const children = childrenOf(data, p);
                return children.length ? (
                  <span className="row">
                    {children.map((child) => (
                      <Button
                        key={child.id}
                        size="sm"
                        variant="secondary"
                        icon={ICONS.close}
                        aria-label={t.admin.unlink(child.name)}
                        title={t.admin.unlink(child.name)}
                        onClick={() => dispatch({ type: "family/unlink", parentId: p.id, studentId: child.id })}
                      >
                        {child.name}
                      </Button>
                    ))}
                  </span>
                ) : (
                  <span className="muted">{t.admin.noChildren}</span>
                );
              },
            },
          ]}
        />
      </Card>
      {linking && <LinkParentModal onClose={() => setLinking(false)} />}
    </>
  );
}
