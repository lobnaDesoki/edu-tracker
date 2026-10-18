import { coursesForStudent } from "../services/academics";
import { useActiveStudent } from "../store/ActiveStudentContext";
import { useData } from "../store/DataContext";

/** The active student and their courses. Use behind LearnerGate. */
export function useStudentScope() {
  const { data } = useData();
  const { student } = useActiveStudent();
  if (!student) throw new Error("useStudentScope must be used behind LearnerGate");
  const courses = coursesForStudent(data, student.id);
  return { data, student, courses, courseIds: courses.map((course) => course.id) };
}
