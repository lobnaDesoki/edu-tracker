import { I18nProvider } from "../i18n/I18nContext";
import { ActiveStudentProvider } from "../store/ActiveStudentContext";
import { AuthProvider } from "../store/AuthContext";
import { DataProvider } from "../store/DataContext";
import { NotificationsProvider } from "../store/NotificationsContext";
import { AppRouter } from "./AppRouter";

export function App() {
  return (
    <I18nProvider>
      <DataProvider>
        <AuthProvider>
          <ActiveStudentProvider>
            <NotificationsProvider>
              <AppRouter />
            </NotificationsProvider>
          </ActiveStudentProvider>
        </AuthProvider>
      </DataProvider>
    </I18nProvider>
  );
}
