import { PageHeader } from "../../components/ui/PageHeader";
import { useStudentScope } from "../../hooks/useStudentScope";
import { useI18n } from "../../i18n/I18nContext";
import { coursesForInstructor } from "../../services/academics";
import { useCurrentUser } from "../../store/AuthContext";
import { useData } from "../../store/DataContext";
import { LearnerGate } from "../auth/LearnerGate";
import { CourseGrid } from "./components/CourseGrid";

export function CoursesPage() {
  const { t } = useI18n();
  const user = useCurrentUser();
  return (
    <>
      <PageHeader title={t.nav.courses} />
      {user.role === "instructor" ? (
        <InstructorCourses instructorId={user.id} />
      ) : (
        <LearnerGate>
          <LearnerCourses />
        </LearnerGate>
      )}
    </>
  );
}

function InstructorCourses({ instructorId }: { instructorId: string }) {
  const { data } = useData();
  return <CourseGrid courses={coursesForInstructor(data, instructorId)} />;
}

function LearnerCourses() {
  const { student, courses } = useStudentScope();
  return <CourseGrid courses={courses} studentId={student.id} />;
}
