import { useState } from "react";
import { APP_CONFIG } from "../../constants/config";
import { ICONS } from "../../constants/icons";
import { useI18n } from "../../i18n/I18nContext";
import { Button } from "./Button";

export function CopyButton({ value }: { value: string }) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), APP_CONFIG.copiedFeedbackMs);
  };

  return (
    <Button variant="secondary" size="sm" icon={ICONS.copy} onClick={copy}>
      {copied ? t.common.copied : t.common.copy}
    </Button>
  );
}
