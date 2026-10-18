import { createSearchParams, useNavigate } from "react-router";
import { QUERY, ROUTES } from "../constants/routes";
import { findThread, type Contact } from "../services/messaging";
import { useCurrentUser } from "../store/AuthContext";
import { useData } from "../store/DataContext";
import { createId } from "../utils/id";

/** Opens the conversation with a contact, creating it the first time. */
export function useOpenConversation() {
  const { data, dispatch } = useData();
  const user = useCurrentUser();
  const navigate = useNavigate();

  return (contact: Contact) => {
    let thread = findThread(data, user.id, contact);
    if (!thread) {
      thread = {
        id: createId("th"),
        participantIds: [user.id, contact.userId],
        courseId: contact.courseId,
        studentId: contact.studentId,
      };
      dispatch({ type: "thread/create", thread });
    }
    navigate({ pathname: ROUTES.messages, search: createSearchParams({ [QUERY.thread]: thread.id }).toString() });
  };
}
