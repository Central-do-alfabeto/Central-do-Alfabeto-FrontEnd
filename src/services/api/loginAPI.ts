import apiClient from "./apiClient";

export type TeacherStudentSummary = {
    studentId: number;
    fullName: string;
    currentPhaseIndex: number;
    numberOfErrorsByPhase?: Record<number, number>;
    numberOfSoundRepeatsByPhase?: Record<number, number>;
};

export type LoginResponse = {
    userId: number;
    isStudent: boolean;
    token: string;
    currentPhaseIndex?: number;
    teacherStudents?: TeacherStudentSummary[];
};

export async function loginAPI(email: string, password: string): Promise<LoginResponse> {
    try {
        const response = await apiClient.post(`/auth/login`, { email, password });

        return {
            userId: response.data.userId,
            isStudent: response.data.isStudent,
            token: response.data.token,
            currentPhaseIndex: response.data.currentPhaseIndex ?? undefined,
            teacherStudents: response.data.studentSummaries as TeacherStudentSummary[] | undefined
        };

    } catch (error) {
        if (error instanceof Error) {
            console.error("Erro em loginAPI:", error.message);
        } else {
            console.error("Erro não esperado:", error);
        }
        throw error;
    }
}