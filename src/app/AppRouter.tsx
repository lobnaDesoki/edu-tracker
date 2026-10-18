import { HashRouter, Navigate, Route, Routes } from "react-router";
import { AppLayout } from "../components/layout/AppLayout";
import { LEARNER_ROLES, MEMBER_ROLES } from "../constants/roles";
import { ROUTES } from "../constants/routes";
import { FamiliesPage } from "../features/admin/FamiliesPage";
import { ManageCoursesPage } from "../features/admin/ManageCoursesPage";
import { UsersPage } from "../features/admin/UsersPage";
import { AttendancePage } from "../features/attendance/AttendancePage";
import { AuthLayout } from "../features/auth/AuthLayout";
import { ForgotPasswordPage } from "../features/auth/ForgotPasswordPage";
import { LearnerGate } from "../features/auth/LearnerGate";
import { LoginPage } from "../features/auth/LoginPage";
import { SetPasswordPage } from "../features/auth/SetPasswordPage";
import { VerifyPhonePage } from "../features/auth/VerifyPhonePage";
import { CourseDetailPage } from "../features/courses/CourseDetailPage";
import { CoursesPage } from "../features/courses/CoursesPage";
import { StudentStatusPage } from "../features/courses/StudentStatusPage";
import { DashboardPage } from "../features/dashboard/DashboardPage";
import { GradesPage } from "../features/grades/GradesPage";
import { MessagesPage } from "../features/messages/MessagesPage";
import { NotificationsPage } from "../features/notifications/NotificationsPage";
import { PaymentsPage } from "../features/payments/PaymentsPage";
import { SettingsPage } from "../features/settings/SettingsPage";
import { RedirectIfSignedIn, RequireAuth, RequireRole, RequireSession } from "./guards";

// Hash routing works on GitHub Pages without server rewrites.
export function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route element={<RedirectIfSignedIn />}>
            <Route path={ROUTES.login} element={<LoginPage />} />
            <Route path={ROUTES.forgotPassword} element={<ForgotPasswordPage />} />
          </Route>
          <Route element={<RequireSession />}>
            <Route path={ROUTES.setPassword} element={<SetPasswordPage />} />
            <Route path={ROUTES.verifyPhone} element={<VerifyPhonePage />} />
          </Route>
        </Route>

        <Route element={<RequireAuth />}>
          <Route element={<AppLayout />}>
            <Route path={ROUTES.dashboard} element={<DashboardPage />} />
            <Route path={ROUTES.settings} element={<SettingsPage />} />

            <Route element={<RequireRole roles={MEMBER_ROLES} />}>
              <Route path={ROUTES.courses} element={<CoursesPage />} />
              <Route path={ROUTES.course} element={<CourseDetailPage />} />
              <Route path={ROUTES.messages} element={<MessagesPage />} />
            </Route>

            <Route element={<RequireRole roles={LEARNER_ROLES} />}>
              <Route path={ROUTES.notifications} element={<NotificationsPage />} />
              <Route element={<LearnerGate />}>
                <Route path={ROUTES.grades} element={<GradesPage />} />
                <Route path={ROUTES.attendance} element={<AttendancePage />} />
                <Route path={ROUTES.payments} element={<PaymentsPage />} />
              </Route>
            </Route>

            <Route element={<RequireRole roles={["instructor"]} />}>
              <Route path={ROUTES.studentStatus} element={<StudentStatusPage />} />
            </Route>

            <Route element={<RequireRole roles={["admin"]} />}>
              <Route path={ROUTES.users} element={<UsersPage />} />
              <Route path={ROUTES.manageCourses} element={<ManageCoursesPage />} />
              <Route path={ROUTES.families} element={<FamiliesPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to={ROUTES.dashboard} replace />} />
      </Routes>
    </HashRouter>
  );
}
