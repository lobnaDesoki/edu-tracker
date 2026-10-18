import { useCurrentUser } from "../../store/AuthContext";
import { LearnerGate } from "../auth/LearnerGate";
import { AdminDashboard } from "./AdminDashboard";
import { InstructorDashboard } from "./InstructorDashboard";
import { LearnerDashboard } from "./LearnerDashboard";

export function DashboardPage() {
  const user = useCurrentUser();
  switch (user.role) {
    case "admin":
      return <AdminDashboard />;
    case "instructor":
      return <InstructorDashboard />;
    default:
      return (
        <LearnerGate>
          <LearnerDashboard />
        </LearnerGate>
      );
  }
}
