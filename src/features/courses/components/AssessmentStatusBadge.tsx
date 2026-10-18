import { Badge, type BadgeTone } from "../../../components/ui/Badge";
import { useI18n } from "../../../i18n/I18nContext";
import type { SubmissionStatus } from "../../../services/academics";

const STATUS_TONE: Record<SubmissionStatus, BadgeTone> = {
  graded: "success",
  submitted: "info",
  late: "warning",
  missing: "danger",
  upcoming: "neutral",
};

export function AssessmentStatusBadge({ status }: { status: SubmissionStatus }) {
  const { t } = useI18n();
  return <Badge tone={STATUS_TONE[status]}>{t.assessments.status[status]}</Badge>;
}
