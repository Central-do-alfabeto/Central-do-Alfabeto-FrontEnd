import axios from "axios";
import apiClient from "./apiClient";
import type { TeacherStudentSummary } from "./loginAPI";

export async function fetchEducatorStudents(educatorId: string): Promise<TeacherStudentSummary[]> {
    try {
        const response = await apiClient.get(`/educators/${educatorId}/students`);
        return Array.isArray(response.data) ? response.data as TeacherStudentSummary[] : [];
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw error;
        }

        throw new Error("Falha ao carregar alunos do educador.");
    }
}

export async function addEducatorStudent(
    educatorId: string,
    payload: { email: string; studentName: string }
): Promise<TeacherStudentSummary> {
    try {
        const response = await apiClient.post(`/educators/${educatorId}/students`, payload);
        return response.data as TeacherStudentSummary;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw error;
        }

        throw new Error("Falha ao adicionar aluno ao educador.");
    }
}
