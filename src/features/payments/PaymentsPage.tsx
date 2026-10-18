import { useState } from "react";
import { Badge, type BadgeTone } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { PageHeader } from "../../components/ui/PageHeader";
import { StatCard } from "../../components/ui/StatCard";
import { Table } from "../../components/ui/Table";
import { ICONS } from "../../constants/icons";
import { useLookups } from "../../hooks/useLookups";
import { useStudentScope } from "../../hooks/useStudentScope";
import { useI18n } from "../../i18n/I18nContext";
import { installmentsFor, installmentStatus, sumAmounts, unpaid, type InstallmentStatus } from "../../services/payments";
import type { Installment } from "../../types";
import { PayModal } from "./PayModal";

const STATUS_TONE: Record<InstallmentStatus, BadgeTone> = {
  paid: "success",
  due: "info",
  overdue: "danger",
  awaitingCash: "warning",
};

const PAYABLE: InstallmentStatus[] = ["due", "overdue"];

export function PaymentsPage() {
  const { t, formatDate, formatMoney } = useI18n();
  const { data, student } = useStudentScope();
  const { courseTitle } = useLookups();
  const [paying, setPaying] = useState<Installment | null>(null);
  const installments = installmentsFor(data, student.id);
  const remaining = sumAmounts(unpaid(installments));

  return (
    <>
      <PageHeader title={t.nav.payments} subtitle={student.name} />
      <div className="grid">
        <StatCard icon={ICONS.check} label={t.payments.paid} value={formatMoney(sumAmounts(installments) - remaining)} />
        <StatCard icon={ICONS.payments} label={t.payments.remaining} value={formatMoney(remaining)} />
      </div>
      <Card>
        <Table<Installment>
          rows={installments}
          rowKey={(i) => i.id}
          emptyMessage={t.payments.empty}
          columns={[
            { key: "course", header: t.common.course, render: (i) => courseTitle(i.courseId) },
            { key: "number", header: t.common.title, render: (i) => t.payments.installment(i.number) },
            { key: "amount", header: t.payments.amount, render: (i) => formatMoney(i.amountEgp) },
            { key: "due", header: t.payments.dueDate, render: (i) => formatDate(i.dueDate) },
            {
              key: "status",
              header: t.common.status,
              render: (i) => {
                const status = installmentStatus(i);
                return (
                  <div className="stack-sm">
                    <Badge tone={STATUS_TONE[status]}>{t.payments.status[status]}</Badge>
                    {i.method && <span className="muted">{`${t.payments.methods[i.method]} · ${i.reference}`}</span>}
                  </div>
                );
              },
            },
            {
              key: "action",
              header: t.common.actions,
              render: (i) =>
                PAYABLE.includes(installmentStatus(i)) && (
                  <Button size="sm" onClick={() => setPaying(i)}>
                    {t.payments.pay}
                  </Button>
                ),
            },
          ]}
        />
      </Card>
      {paying && <PayModal installment={paying} onClose={() => setPaying(null)} />}
    </>
  );
}
