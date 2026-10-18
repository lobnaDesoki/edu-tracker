import { useState } from "react";
import { LanguageToggle } from "../../components/layout/LanguageToggle";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { TextField } from "../../components/ui/Field";
import { ItemRow } from "../../components/ui/ItemRow";
import { Notice } from "../../components/ui/Notice";
import { PageHeader } from "../../components/ui/PageHeader";
import { ICONS } from "../../constants/icons";
import { useI18n } from "../../i18n/I18nContext";
import { useAuth, useCurrentUser } from "../../store/AuthContext";
import { useData } from "../../store/DataContext";
import { NewPasswordForm } from "../auth/components/NewPasswordForm";
import { PhoneVerificationForm } from "../auth/components/PhoneVerificationForm";

export function SettingsPage() {
  const { t } = useI18n();
  const { dispatch } = useData();
  const { startTour } = useAuth();
  const user = useCurrentUser();
  const [currentPassword, setCurrentPassword] = useState("");
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [editingPhone, setEditingPhone] = useState(false);

  const changePassword = (password: string) => {
    if (currentPassword !== user.password) return t.auth.wrongCurrentPassword;
    dispatch({ type: "user/setPassword", userId: user.id, password });
    setCurrentPassword("");
    setPasswordSaved(true);
    return null;
  };

  return (
    <>
      <PageHeader title={t.nav.settings} />
      <div className="grid">
        <Card title={t.settings.profile}>
          <ul className="list-plain">
            <ItemRow title={user.name} meta={t.common.name} />
            <ItemRow title={user.email} meta={t.common.email} />
            <ItemRow title={t.roles[user.role]} meta={t.common.role} />
          </ul>
        </Card>
        <Card title={t.settings.security}>
          {passwordSaved && <Notice tone="success">{t.auth.passwordUpdated}</Notice>}
          <NewPasswordForm submitLabel={t.common.save} onSubmit={changePassword}>
            <TextField
              label={t.auth.currentPassword}
              type="password"
              autoComplete="current-password"
              required
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value);
                setPasswordSaved(false);
              }}
            />
          </NewPasswordForm>
        </Card>
        <Card title={t.settings.phone}>
          {editingPhone ? (
            <PhoneVerificationForm
              initialPhone={user.phone}
              onVerified={(phone) => {
                dispatch({ type: "user/verifyPhone", userId: user.id, phone });
                setEditingPhone(false);
              }}
            />
          ) : (
            <ul className="list-plain">
              <ItemRow
                title={user.phone || t.common.none}
                trailing={
                  <>
                    <Badge tone={user.phoneVerified ? "success" : "neutral"}>
                      {user.phoneVerified ? t.auth.phoneVerified : t.auth.phoneNotVerified}
                    </Badge>
                    <Button size="sm" variant="secondary" onClick={() => setEditingPhone(true)}>
                      {t.settings.changePhone}
                    </Button>
                  </>
                }
              />
            </ul>
          )}
        </Card>
        <Card title={t.settings.language}>
          <div>
            <LanguageToggle />
          </div>
        </Card>
        <Card title={t.settings.tour}>
          <div>
            <Button variant="secondary" icon={ICONS.info} onClick={startTour}>
              {t.settings.replayTour}
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}
