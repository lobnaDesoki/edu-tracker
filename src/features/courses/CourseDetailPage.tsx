import { useStudentScope } from "../../hooks/useStudentScope";
import { assessmentsFor } from "../../services/academics";
import { useCurrentUser } from "../../store/AuthContext";
import { useData } from "../../store/DataContext";
import type { Course } from "../../types";
import { AttendanceTable } from "../attendance/AttendanceTable";
import { LearnerGate } from "../auth/LearnerGate";
import { GradesTable } from "../grades/GradesTable";
import { CourseShell, type CourseTab } from "./components/CourseShell";
import { StudentSummaryStats } from "./components/StudentSummaryStats";
import { AttendanceTakingTab } from "./tabs/AttendanceTakingTab";
import { ContentTab } from "./tabs/ContentTab";
import { GradebookTab } from "./tabs/GradebookTab";
import { InstructorAssessmentsTab } from "./tabs/InstructorAssessmentsTab";
import { LearnerAssessmentsTab } from "./tabs/LearnerAssessmentsTab";
import { StudentsTab } from "./tabs/StudentsTab";
import { TimelineTab } from "./tabs/TimelineTab";

const INSTRUCTOR_TABS: CourseTab[] = ["students", "assessments", "gradebook", "attendance", "timeline", "content"];
const LEARNER_TABS: CourseTab[] = ["content", "assessments", "grades", "attendance", "timeline"];

export function CourseDetailPage() {
  const user = useCurrentUser();
  return user.role === "instructor" ? (
    <InstructorCourseDetail instructorId={user.id} />
  ) : (
    <LearnerGate>
      <LearnerCourseDetail />
    </LearnerGate>
  );
}

function InstructorCourseDetail({ instructorId }: { instructorId: string }) {
  return (
    <CourseShell tabs={INSTRUCTOR_TABS} canAccess={(course) => course.instructorId === instructorId}>
      {(tab, course) => <InstructorTab tab={tab} course={course} />}
    </CourseShell>
  );
}

function InstructorTab({ tab, course }: { tab: CourseTab; course: Course }) {
  switch (tab) {
    case "students":
      return <StudentsTab course={course} />;
    case "assessments":
      return <InstructorAssessmentsTab course={course} />;
    case "gradebook":
      return <GradebookTab course={course} />;
    case "attendance":
      return <AttendanceTakingTab course={course} />;
    case "timeline":
      return <TimelineTab course={course} editable />;
    default:
      return <ContentTab course={course} editable />;
  }
}

/** Students and parents see the same course page; only students can hand in work. */
function LearnerCourseDetail() {
  const { data } = useData();
  const user = useCurrentUser();
  const { student } = useStudentScope();

  return (
    <CourseShell
      tabs={LEARNER_TABS}
      canAccess={(course) => course.studentIds.includes(student.id)}
      summary={(course) => <StudentSummaryStats studentId={student.id} courseId={course.id} />}
    >
      {(tab, course) => {
        switch (tab) {
          case "assessments":
            return <LearnerAssessmentsTab course={course} studentId={student.id} canSubmit={user.role === "student"} />;
          case "grades":
            return <GradesTable studentId={student.id} assessments={assessmentsFor(data, [course.id])} />;
          case "attendance":
            return <AttendanceTable studentId={student.id} courseIds={[course.id]} />;
          case "timeline":
            return <TimelineTab course={course} editable={false} />;
          default:
            return <ContentTab course={course} editable={false} />;
        }
      }}
    </CourseShell>
  );
}
