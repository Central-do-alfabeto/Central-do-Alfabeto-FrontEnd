import type { TeacherStudentSummary } from "../services/api/loginAPI";

let students: TeacherStudentSummary[] = [];

export function setStudents(teacherStudents: TeacherStudentSummary[] = []) {
    students = [...teacherStudents];
}

export function getStudents(): TeacherStudentSummary[] {
    return [...students];
}