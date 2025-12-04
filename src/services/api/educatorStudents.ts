import axios from "axios";
import apiClient from "./apiClient";
import type { TeacherStudentSummary } from "./loginAPI";

export type PlayerDataSnapshot = {
    phaseIndex: number;
    totalErrors: number;
    totalAudioReproductions: number;
};

export type StudentProgress = {
    studentId: string;
    studentName: string | null;
    studentEmail: string | null;
    currentPhaseIndex: number;
    lastCompletedPhaseIndex: number | null;
    snapshots: PlayerDataSnapshot[];
};

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

export async function fetchStudentProgress(studentId: string): Promise<StudentProgress> {
    try {
        const response = await apiClient.get(`/educators/student-progress/${studentId}`);
        const data = response.data;

        const snapshots = Array.isArray(data.snapshots)
            ? data.snapshots.map((snapshot: Record<string, unknown>) => ({
                phaseIndex: typeof snapshot.phaseIndex === "number" ? snapshot.phaseIndex : 0,
                totalErrors: typeof snapshot.totalErrors === "number" ? snapshot.totalErrors : 0,
                totalAudioReproductions:
                    typeof snapshot.totalAudioReproductions === "number"
                        ? snapshot.totalAudioReproductions
                        : 0,
            }))
            : [];

        return {
            studentId: data.studentId,
            studentName: data.studentName ?? null,
            studentEmail: data.studentEmail ?? null,
            currentPhaseIndex: data.currentPhaseIndex ?? 0,
            lastCompletedPhaseIndex: data.lastCompletedPhaseIndex ?? null,
            snapshots,
        };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw error;
        }

        throw new Error("Falha ao carregar progresso do aluno.");
    }
}
