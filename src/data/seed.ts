// Fake data for the demo. Dates are relative to today so the demo always looks current.
// Later this is replaced by API calls.
import { buildInstallments } from "../services/payments";
import type {
  AppData,
  Assessment,
  AttendanceRecord,
  AttendanceStatus,
  ContentItem,
  Course,
  Installment,
  Localized,
  Message,
  Submission,
  Thread,
  TimelineEvent,
  User,
} from "../types";
import { daysFromToday, isPast, shiftDays } from "../utils/date";

export const DEMO_PASSWORD = "Demo@1234";

const ID = {
  admin: "u-mona",
  karim: "u-karim",
  salma: "u-salma",
  youssef: "u-youssef",
  laila: "u-laila",
  omar: "u-omar",
  nour: "u-nour",
  mariam: "u-mariam",
  ahmed: "u-ahmed",
  hala: "u-hala",
  math: "c-math",
  physics: "c-physics",
  english: "c-english",
  science: "c-science",
} as const;

/** Accounts listed on the sign-in page, one per role plus a first-login account. */
export const DEMO_ACCOUNT_IDS: string[] = [ID.admin, ID.karim, ID.youssef, ID.ahmed, ID.mariam];

const account = (id: string, role: User["role"], name: string, email: string, phone: string): User => ({
  id,
  role,
  name,
  email,
  password: DEMO_PASSWORD,
  phone,
  phoneVerified: true,
  mustChangePassword: false,
});

const users: User[] = [
  account(ID.admin, "admin", "Mona Adel", "admin@brightpath.edu", "01000000001"),
  account(ID.karim, "instructor", "Karim Mostafa", "karim.mostafa@brightpath.edu", "01011112222"),
  account(ID.salma, "instructor", "Salma Nabil", "salma.nabil@brightpath.edu", "01022223333"),
  account(ID.youssef, "student", "Youssef Ahmed", "youssef.ahmed@brightpath.edu", "01033334444"),
  account(ID.laila, "student", "Laila Ahmed", "laila.ahmed@brightpath.edu", "01044445555"),
  account(ID.omar, "student", "Omar Tarek", "omar.tarek@brightpath.edu", "01055556666"),
  account(ID.nour, "student", "Nour Samir", "nour.samir@brightpath.edu", "01066667777"),
  { ...account(ID.mariam, "student", "Mariam Khaled", "mariam.khaled@brightpath.edu", ""), mustChangePassword: true, phoneVerified: false },
  { ...account(ID.ahmed, "parent", "Ahmed Fathy", "ahmed.fathy@brightpath.edu", "01077778888"), childIds: [ID.youssef, ID.laila] },
  { ...account(ID.hala, "parent", "Hala Tarek", "hala.tarek@brightpath.edu", "01088889999"), childIds: [ID.omar] },
];

const text = (en: string, ar: string): Localized => ({ en, ar });

const courses: Course[] = [
  {
    id: ID.math,
    title: text("Mathematics — Grade 10", "الرياضيات — الصف العاشر"),
    schedule: text("Sun & Wed · 4:00 PM", "الأحد والأربعاء · 4:00 م"),
    instructorId: ID.karim,
    studentIds: [ID.youssef, ID.omar, ID.nour],
    feeEgp: 3000,
    installmentCount: 3,
  },
  {
    id: ID.physics,
    title: text("Physics — Grade 10", "الفيزياء — الصف العاشر"),
    schedule: text("Mon & Thu · 5:30 PM", "الاثنين والخميس · 5:30 م"),
    instructorId: ID.karim,
    studentIds: [ID.youssef, ID.omar],
    feeEgp: 2700,
    installmentCount: 3,
  },
  {
    id: ID.english,
    title: text("English — Upper Intermediate", "اللغة الإنجليزية — فوق المتوسط"),
    schedule: text("Tue · 6:00 PM", "الثلاثاء · 6:00 م"),
    instructorId: ID.salma,
    studentIds: [ID.youssef, ID.laila, ID.nour, ID.mariam],
    feeEgp: 2400,
    installmentCount: 2,
  },
  {
    id: ID.science,
    title: text("Science — Grade 7", "العلوم — الصف السابع"),
    schedule: text("Sat · 11:00 AM", "السبت · 11:00 ص"),
    instructorId: ID.salma,
    studentIds: [ID.laila],
    feeEgp: 1800,
    installmentCount: 2,
  },
];

const content: ContentItem[] = [
  { id: "ct-1", courseId: ID.math, type: "lesson", title: text("Functions and their graphs", "الدوال ورسومها البيانية"), body: text("Domain, range and how to sketch linear and quadratic functions.", "المجال والمدى وطريقة رسم الدوال الخطية والتربيعية."), publishedAt: daysFromToday(-20) },
  { id: "ct-2", courseId: ID.math, type: "video", title: text("Solving quadratics — recorded class", "حل المعادلات التربيعية — حصة مسجلة"), body: text("Factoring, completing the square and the quadratic formula.", "التحليل وإكمال المربع والقانون العام."), publishedAt: daysFromToday(-12) },
  { id: "ct-3", courseId: ID.math, type: "file", title: text("Trigonometry formula sheet", "ورقة قوانين حساب المثلثات"), body: text("One-page PDF to keep next to you while solving.", "ملف PDF من صفحة واحدة للمراجعة أثناء الحل."), publishedAt: daysFromToday(-3) },
  { id: "ct-4", courseId: ID.physics, type: "lesson", title: text("Motion in a straight line", "الحركة في خط مستقيم"), body: text("Speed, velocity and acceleration with worked examples.", "السرعة والسرعة المتجهة والعجلة مع أمثلة محلولة."), publishedAt: daysFromToday(-15) },
  { id: "ct-5", courseId: ID.physics, type: "video", title: text("Newton's laws explained", "شرح قوانين نيوتن"), body: text("A 20-minute walkthrough of the three laws.", "شرح للقوانين الثلاثة في 20 دقيقة."), publishedAt: daysFromToday(-5) },
  { id: "ct-6", courseId: ID.english, type: "lesson", title: text("Writing a strong paragraph", "كتابة فقرة قوية"), body: text("Topic sentence, supporting ideas and a closing line.", "الجملة الرئيسية والأفكار الداعمة والخاتمة."), publishedAt: daysFromToday(-14) },
  { id: "ct-7", courseId: ID.english, type: "file", title: text("Vocabulary list — Unit 3", "قائمة المفردات — الوحدة 3"), body: text("40 words with examples for this week's quiz.", "40 كلمة مع أمثلة لاختبار هذا الأسبوع."), publishedAt: daysFromToday(-6) },
  { id: "ct-8", courseId: ID.science, type: "lesson", title: text("The living cell", "الخلية الحية"), body: text("Plant and animal cells and what each part does.", "الخلية النباتية والحيوانية ووظيفة كل جزء."), publishedAt: daysFromToday(-9) },
];

const assessment = (
  id: string,
  courseId: string,
  kind: Assessment["kind"],
  title: Localized,
  description: Localized,
  dueInDays: number,
  maxScore: number,
): Assessment => ({ id, courseId, kind, title, description, dueAt: daysFromToday(dueInDays, 23), maxScore });

const assessments: Assessment[] = [
  assessment("a-m1", ID.math, "assignment", text("Quadratic equations worksheet", "ورقة عمل المعادلات التربيعية"), text("Solve questions 1–15 and show your steps.", "حل الأسئلة من 1 إلى 15 مع توضيح الخطوات."), -10, 20),
  assessment("a-m2", ID.math, "quiz", text("Quiz 1: Functions", "اختبار 1: الدوال"), text("15-minute quiz at the start of class.", "اختبار 15 دقيقة في بداية الحصة."), -5, 10),
  assessment("a-m3", ID.math, "assignment", text("Trigonometry problem set", "مسائل حساب المثلثات"), text("Ten problems from the formula sheet.", "عشر مسائل على ورقة القوانين."), 2, 20),
  assessment("a-m4", ID.math, "quiz", text("Quiz 2: Trigonometry", "اختبار 2: حساب المثلثات"), text("Covers sine, cosine and tangent.", "يشمل الجيب وجيب التمام والظل."), 6, 10),
  assessment("a-p1", ID.physics, "assignment", text("Lab report: Motion", "تقرير المعمل: الحركة"), text("Write up the trolley experiment.", "اكتب تقرير تجربة العربة."), -8, 25),
  assessment("a-p2", ID.physics, "quiz", text("Quiz: Newton's laws", "اختبار: قوانين نيوتن"), text("Short quiz on the three laws.", "اختبار قصير على القوانين الثلاثة."), 1, 10),
  assessment("a-p3", ID.physics, "assignment", text("Forces problem set", "مسائل القوى"), text("Free-body diagrams for 8 situations.", "رسم مخطط القوى لثماني حالات."), 9, 20),
  assessment("a-e1", ID.english, "assignment", text("Essay: My city", "مقال: مدينتي"), text("250 words describing your city.", "250 كلمة تصف فيها مدينتك."), -6, 20),
  assessment("a-e2", ID.english, "quiz", text("Vocabulary quiz — Unit 3", "اختبار المفردات — الوحدة 3"), text("Matching and fill in the blanks.", "توصيل وإكمال الفراغات."), -2, 10),
  assessment("a-e3", ID.english, "assignment", text("Reading summary", "ملخص القراءة"), text("Summarise chapter 4 in your own words.", "لخص الفصل الرابع بأسلوبك."), 3, 15),
  assessment("a-s1", ID.science, "assignment", text("Plant cell diagram", "رسم الخلية النباتية"), text("Label every part of the cell.", "اكتب اسم كل جزء في الخلية."), -4, 10),
  assessment("a-s2", ID.science, "quiz", text("Quiz: Living things", "اختبار: الكائنات الحية"), text("10 multiple-choice questions.", "10 أسئلة اختيار من متعدد."), 2, 10),
];

const dueOf = (assessmentId: string) => assessments.find((a) => a.id === assessmentId)?.dueAt ?? daysFromToday(0);
const GRADED_DAYS_AFTER_DUE = 2;

/** `daysFromDue`: negative = before the due date, positive = late, null = in-class quiz. */
const submission = (
  assessmentId: string,
  studentId: string,
  daysFromDue: number | null,
  answer?: string,
  score?: number,
  feedback?: string,
): Submission => {
  const due = dueOf(assessmentId);
  return {
    id: `s-${assessmentId}-${studentId}`,
    assessmentId,
    studentId,
    text: answer,
    submittedAt: daysFromDue === null ? undefined : shiftDays(due, daysFromDue),
    score,
    feedback,
    gradedAt: score === undefined ? undefined : shiftDays(due, GRADED_DAYS_AFTER_DUE),
  };
};

const submissions: Submission[] = [
  submission("a-m1", ID.youssef, -1, "Answers attached: 1) x = 3 or x = -2 …", 17, "Great work, check question 12."),
  submission("a-m2", ID.youssef, null, undefined, 8),
  submission("a-m3", ID.youssef, -3, "Problems 1–10 solved, see link: drive.example/trig-youssef"),
  submission("a-p1", ID.youssef, 1, "Lab report on the trolley experiment with graphs."),
  submission("a-e1", ID.youssef, -2, "My city is Alexandria, a city by the sea…", 15, "Nice ideas, watch the tenses."),
  submission("a-e2", ID.youssef, null, undefined, 9),
  submission("a-m1", ID.omar, -0.5, "Solved 1–12.", 12, "Finish the last three next time."),
  submission("a-m2", ID.omar, null, undefined, 6),
  submission("a-m1", ID.nour, -2, "All 15 questions solved.", 19, "Excellent!"),
  submission("a-m2", ID.nour, null, undefined, 9),
  submission("a-e1", ID.nour, -1, "Cairo never sleeps…"),
  submission("a-e2", ID.nour, null, undefined, 7),
  submission("a-e1", ID.laila, 1, "My city is Giza, home of the pyramids…", 13, "Good, but submitted late."),
  submission("a-e2", ID.laila, null, undefined, 8),
  submission("a-s1", ID.laila, -1, "Diagram uploaded: drive.example/cell-laila", 9, "Very neat."),
];

const TIMELINE_OFFSETS = [-28, -18, -8, 3, 12, 24];
const TIMELINE_TITLES: Record<string, Localized[]> = {
  [ID.math]: [text("Kick-off & diagnostic test", "البداية واختبار تحديد المستوى"), text("Unit 1: Functions", "الوحدة 1: الدوال"), text("Unit 2: Quadratics", "الوحدة 2: المعادلات التربيعية"), text("Unit 3: Trigonometry", "الوحدة 3: حساب المثلثات"), text("Midterm exam", "امتحان منتصف الفصل"), text("Final revision", "المراجعة النهائية")],
  [ID.physics]: [text("Kick-off & lab safety", "البداية وقواعد الأمان في المعمل"), text("Unit 1: Motion", "الوحدة 1: الحركة"), text("Lab: Trolley experiment", "معمل: تجربة العربة"), text("Unit 2: Forces", "الوحدة 2: القوى"), text("Midterm exam", "امتحان منتصف الفصل"), text("Unit 3: Energy", "الوحدة 3: الطاقة")],
  [ID.english]: [text("Placement & goals", "تحديد المستوى والأهداف"), text("Unit 1: Writing paragraphs", "الوحدة 1: كتابة الفقرات"), text("Unit 2: Essays", "الوحدة 2: المقالات"), text("Unit 3: Reading skills", "الوحدة 3: مهارات القراءة"), text("Speaking test", "اختبار المحادثة"), text("Final exam", "الامتحان النهائي")],
  [ID.science]: [text("Introduction to science", "مقدمة في العلوم"), text("Unit 1: Living things", "الوحدة 1: الكائنات الحية"), text("Unit 2: The cell", "الوحدة 2: الخلية"), text("Field trip: Botanical garden", "رحلة: الحديقة النباتية"), text("Unit 3: Matter", "الوحدة 3: المادة"), text("Final exam", "الامتحان النهائي")],
};

const timeline: TimelineEvent[] = courses.flatMap((course) =>
  TIMELINE_TITLES[course.id].map((title, index) => ({
    id: `tl-${course.id}-${index}`,
    courseId: course.id,
    date: daysFromToday(TIMELINE_OFFSETS[index]),
    title,
    done: TIMELINE_OFFSETS[index] < 0,
  })),
);

const SESSION_OFFSETS = [-14, -11, -7, -4, -1];
/** Exceptions to "present", keyed by `${courseId}:${studentId}` → session index → status. */
const ATTENDANCE_EXCEPTIONS: Record<string, Record<number, AttendanceStatus>> = {
  [`${ID.math}:${ID.omar}`]: { 1: "absent", 3: "absent" },
  [`${ID.physics}:${ID.youssef}`]: { 4: "absent" },
  [`${ID.math}:${ID.youssef}`]: { 2: "late" },
  [`${ID.science}:${ID.laila}`]: { 2: "late" },
  [`${ID.english}:${ID.nour}`]: { 0: "late" },
  [`${ID.english}:${ID.laila}`]: { 3: "absent" },
};

const attendance: AttendanceRecord[] = courses.flatMap((course) =>
  course.studentIds
    .filter((studentId) => studentId !== ID.mariam)
    .flatMap((studentId) =>
      SESSION_OFFSETS.map((offset, index) => ({
        id: `at-${course.id}-${studentId}-${index}`,
        courseId: course.id,
        studentId,
        date: daysFromToday(offset),
        status: ATTENDANCE_EXCEPTIONS[`${course.id}:${studentId}`]?.[index] ?? "present",
      })),
    ),
);

const FIRST_INSTALLMENT_DAYS_AGO = -40;
/** Installments left unpaid in the seed, to show overdue states. */
const UNPAID_INSTALLMENTS = [`inst-${ID.physics}-${ID.omar}-2`];

const installments: Installment[] = courses.flatMap((course) =>
  course.studentIds.flatMap((studentId) =>
    buildInstallments(course, studentId, FIRST_INSTALLMENT_DAYS_AGO).map((installment, index) => {
      const paid = studentId !== ID.mariam && isPast(installment.dueDate) && !UNPAID_INSTALLMENTS.includes(installment.id);
      return paid
        ? { ...installment, paidAt: installment.dueDate, method: index === 0 ? "card" : "instapay", reference: index === 0 ? "•••• 4242" : "IP-58213" }
        : installment;
    }),
  ),
);

const threads: Thread[] = [
  { id: "th-1", participantIds: [ID.ahmed, ID.karim], courseId: ID.physics, studentId: ID.youssef },
  { id: "th-2", participantIds: [ID.nour, ID.salma], courseId: ID.english, studentId: ID.nour },
];

const messages: Message[] = [
  { id: "m-1", threadId: "th-1", senderId: ID.ahmed, text: "Hello Mr. Karim, Youssef said his lab report was a day late. Will it affect his grade?", sentAt: daysFromToday(-6, 18) },
  { id: "m-2", threadId: "th-1", senderId: ID.karim, text: "Hi Mr. Ahmed, a small deduction only. The report itself is very good.", sentAt: daysFromToday(-6, 20) },
  { id: "m-3", threadId: "th-2", senderId: ID.nour, text: "Miss Salma, can I add a picture to my essay?", sentAt: daysFromToday(-7, 16) },
  { id: "m-4", threadId: "th-2", senderId: ID.salma, text: "Yes, add a link to it at the end.", sentAt: daysFromToday(-7, 17) },
];

export const seedData: AppData = {
  users,
  courses,
  content,
  assessments,
  submissions,
  timeline,
  attendance,
  installments,
  threads,
  messages,
};
