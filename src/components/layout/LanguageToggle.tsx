import { ICONS } from "../../constants/icons";
import { useI18n } from "../../i18n/I18nContext";
import { Button } from "../ui/Button";

export function LanguageToggle() {
  const { t, toggleLanguage } = useI18n();
  return (
    <Button variant="secondary" size="sm" icon={ICONS.language} onClick={toggleLanguage}>
      {t.layout.language}
    </Button>
  );
}
