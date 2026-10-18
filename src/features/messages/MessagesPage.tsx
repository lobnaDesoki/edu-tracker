import { useId, useState, type FormEvent } from "react";
import { useSearchParams } from "react-router";
import { Avatar } from "../../components/ui/Avatar";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { PageHeader } from "../../components/ui/PageHeader";
import { ICONS } from "../../constants/icons";
import { QUERY } from "../../constants/routes";
import { useLookups } from "../../hooks/useLookups";
import { useI18n } from "../../i18n/I18nContext";
import { messagesIn, threadsFor } from "../../services/messaging";
import { useCurrentUser } from "../../store/AuthContext";
import { useData } from "../../store/DataContext";
import type { Thread } from "../../types";
import { cx } from "../../utils/cx";
import { nowIso } from "../../utils/date";
import { createId } from "../../utils/id";
import styles from "./Messages.module.css";
import { NewMessageModal } from "./NewMessageModal";

export function MessagesPage() {
  const { t } = useI18n();
  const { data } = useData();
  const user = useCurrentUser();
  const { courseTitle, userName } = useLookups();
  const [searchParams, setSearchParams] = useSearchParams();
  const [composing, setComposing] = useState(false);
  const threads = threadsFor(data, user.id);
  const selected = threads.find((thread) => thread.id === searchParams.get(QUERY.thread));

  const otherNames = (thread: Thread) =>
    thread.participantIds.filter((id) => id !== user.id).map(userName).join(", ");
  const aboutText = (thread: Thread) => t.messages.about(userName(thread.studentId), courseTitle(thread.courseId));

  return (
    <>
      <PageHeader
        title={t.nav.messages}
        actions={
          <Button icon={ICONS.plus} onClick={() => setComposing(true)}>
            {t.messages.new}
          </Button>
        }
      />
      <div className={styles.layout}>
        <nav className={styles.threads} aria-label={t.nav.messages}>
          {threads.length ? (
            <ul className="list-plain">
              {threads.map((thread) => (
                <li key={thread.id}>
                  <button
                    type="button"
                    className={cx(styles.thread, thread.id === selected?.id && styles.threadActive)}
                    aria-current={thread.id === selected?.id}
                    onClick={() => setSearchParams({ [QUERY.thread]: thread.id })}
                  >
                    <Avatar name={otherNames(thread)} />
                    <span className={styles.threadText}>
                      <strong>{otherNames(thread)}</strong>
                      <span className="muted">{aboutText(thread)}</span>
                      <span className={cx("muted", styles.preview)}>{messagesIn(data, thread.id).at(-1)?.text}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState message={t.messages.empty} />
          )}
        </nav>
        <section className={styles.conversation}>
          {selected ? (
            <Conversation thread={selected} title={otherNames(selected)} subtitle={aboutText(selected)} />
          ) : (
            <EmptyState message={t.messages.select} />
          )}
        </section>
      </div>
      {composing && <NewMessageModal onClose={() => setComposing(false)} />}
    </>
  );
}

function Conversation({ thread, title, subtitle }: { thread: Thread; title: string; subtitle: string }) {
  const { t, formatDateTime } = useI18n();
  const { data, dispatch } = useData();
  const user = useCurrentUser();
  const [text, setText] = useState("");
  const inputId = useId();

  const send = (event: FormEvent) => {
    event.preventDefault();
    if (!text.trim()) return;
    dispatch({
      type: "message/send",
      message: { id: createId("m"), threadId: thread.id, senderId: user.id, text: text.trim(), sentAt: nowIso() },
    });
    setText("");
  };

  return (
    <>
      <header className={styles.conversationHeader}>
        <strong>{title}</strong>
        <span className="muted">{subtitle}</span>
      </header>
      <ol className={cx("list-plain", styles.messages)}>
        {messagesIn(data, thread.id).map((message) => (
          <li key={message.id} className={cx(styles.bubble, message.senderId === user.id && styles.mine)}>
            <p>{message.text}</p>
            <time className={styles.time} dateTime={message.sentAt}>
              {formatDateTime(message.sentAt)}
            </time>
          </li>
        ))}
      </ol>
      <form className={styles.composer} onSubmit={send}>
        <label className="visually-hidden" htmlFor={inputId}>
          {t.messages.placeholder}
        </label>
        <input
          id={inputId}
          className={styles.input}
          placeholder={t.messages.placeholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button type="submit" icon={ICONS.send} disabled={!text.trim()}>
          {t.common.send}
        </Button>
      </form>
    </>
  );
}
