import { Badge } from "../../../components/ui/Badge";
import { ROLE_TONE } from "../../../constants/roles";
import { DEMO_ACCOUNT_IDS, DEMO_PASSWORD } from "../../../data/seed";
import { useI18n } from "../../../i18n/I18nContext";
import { findUser } from "../../../services/academics";
import { useData } from "../../../store/DataContext";
import type { User } from "../../../types";
import styles from "./DemoAccounts.module.css";

/** Demo helper: one-click accounts for each role. */
export function DemoAccounts({ onPick }: { onPick: (account: User) => void }) {
  const { t } = useI18n();
  const { data } = useData();
  const accounts = DEMO_ACCOUNT_IDS.map((id) => findUser(data, id)).filter((user): user is User => !!user);

  return (
    <section className="stack-sm">
      <h2 className={styles.title}>{t.auth.demoAccounts}</h2>
      <p className="muted">{t.auth.demoAccountsHint(DEMO_PASSWORD)}</p>
      <ul className={`list-plain ${styles.list}`}>
        {accounts.map((account) => (
          <li key={account.id}>
            <button type="button" className={styles.account} onClick={() => onPick(account)}>
              <span className="stack-sm">
                <strong>{account.name}</strong>
                <span className="muted">{account.email}</span>
              </span>
              <span className="row">
                {account.mustChangePassword && <Badge tone="warning">{t.auth.firstLoginTag}</Badge>}
                <Badge tone={ROLE_TONE[account.role]}>{t.roles[account.role]}</Badge>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
