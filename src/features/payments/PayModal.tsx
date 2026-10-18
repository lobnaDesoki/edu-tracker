import { useState, type FormEvent } from "react";
import { Button } from "../../components/ui/Button";
import { TextField } from "../../components/ui/Field";
import { Modal } from "../../components/ui/Modal";
import { Notice } from "../../components/ui/Notice";
import { Tabs } from "../../components/ui/Tabs";
import { APP_CONFIG } from "../../constants/config";
import { ICONS } from "../../constants/icons";
import { useLookups } from "../../hooks/useLookups";
import { useI18n } from "../../i18n/I18nContext";
import { generateCode } from "../../services/credentials";
import { isValidCard, stripSpaces } from "../../services/validation";
import { useData } from "../../store/DataContext";
import type { Installment, PaymentMethod } from "../../types";

const METHODS: PaymentMethod[] = ["card", "instapay", "cash"];
const CARD_VISIBLE_DIGITS = 4;
const MASK = "••••";

interface PayModalProps {
  installment: Installment;
  onClose: () => void;
}

/** Pay one installment by credit card, InstaPay or cash at the desk (all simulated). */
export function PayModal({ installment, onClose }: PayModalProps) {
  const { t, formatMoney } = useI18n();
  const { dispatch } = useData();
  const { courseTitle } = useLookups();
  const [method, setMethod] = useState<PaymentMethod>("card");
  const [receipt, setReceipt] = useState<string | null>(null);
  const amount = formatMoney(installment.amountEgp);

  const pay = (paidWith: PaymentMethod, reference: string) => {
    dispatch({ type: "installment/pay", installmentId: installment.id, method: paidWith, reference });
    setReceipt(paidWith === "cash" ? t.payments.voucher(reference) : t.payments.success);
  };

  return (
    <Modal
      title={t.payments.payTitle(t.payments.installment(installment.number), courseTitle(installment.courseId))}
      onClose={onClose}
      footer={
        receipt && (
          <Button variant="secondary" onClick={onClose}>
            {t.common.close}
          </Button>
        )
      }
    >
      {receipt ? (
        <Notice tone="success">{receipt}</Notice>
      ) : (
        <>
          <strong>{`${t.payments.amount}: ${amount}`}</strong>
          <Tabs
            label={t.payments.method}
            tabs={METHODS.map((id) => ({ id, label: `${ICONS[id]} ${t.payments.methods[id]}` }))}
            active={method}
            onChange={setMethod}
          />
          {method === "card" && <CardForm amount={amount} onPaid={(last4) => pay("card", `${MASK} ${last4}`)} />}
          {method === "instapay" && <InstapayForm amount={amount} onPaid={(reference) => pay("instapay", reference)} />}
          {method === "cash" && (
            <>
              <p>{t.payments.cashInfo}</p>
              <Button onClick={() => pay("cash", generateCode())}>{t.payments.cashGenerate}</Button>
            </>
          )}
        </>
      )}
    </Modal>
  );
}

function CardForm({ amount, onPaid }: { amount: string; onPaid: (lastDigits: string) => void }) {
  const { t } = useI18n();
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!isValidCard(number, expiry, cvc)) return setError(t.payments.cardInvalid);
    setError(null);
    setProcessing(true);
    setTimeout(() => onPaid(stripSpaces(number).slice(-CARD_VISIBLE_DIGITS)), APP_CONFIG.paymentProcessingMs);
  };

  return (
    <form className="stack" onSubmit={submit}>
      <TextField label={t.payments.cardNumber} inputMode="numeric" autoComplete="cc-number" placeholder="4242 4242 4242 4242" required value={number} onChange={(e) => setNumber(e.target.value)} />
      <TextField label={t.payments.cardName} autoComplete="cc-name" required value={name} onChange={(e) => setName(e.target.value)} />
      <div className="grid">
        <TextField label={t.payments.expiry} autoComplete="cc-exp" placeholder="MM/YY" required value={expiry} onChange={(e) => setExpiry(e.target.value)} />
        <TextField label={t.payments.cvc} inputMode="numeric" autoComplete="cc-csc" required value={cvc} onChange={(e) => setCvc(e.target.value)} error={error} />
      </div>
      <Button type="submit" disabled={processing}>
        {processing ? t.payments.processing : t.payments.payAmount(amount)}
      </Button>
    </form>
  );
}

function InstapayForm({ amount, onPaid }: { amount: string; onPaid: (reference: string) => void }) {
  const { t } = useI18n();
  const [reference, setReference] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    onPaid(reference.trim());
  };

  return (
    <form className="stack" onSubmit={submit}>
      <Notice>{t.payments.instapaySteps(amount, APP_CONFIG.instapayAddress)}</Notice>
      <TextField label={t.payments.instapayRef} required value={reference} onChange={(e) => setReference(e.target.value)} />
      <Button type="submit">{t.payments.instapayConfirm}</Button>
    </form>
  );
}
