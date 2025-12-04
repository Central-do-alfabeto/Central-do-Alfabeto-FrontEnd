import apiClient from "./apiClient";

export type TeacherStudentSummary = {
    id: string;
    fullName: string;
    currentPhaseIndex: number;
    errorsDataJson?: number | null;
    soundRepeatsDataJson?: number | null;
};

export type LoginResponse = {
    userId: string;
    isStudent: boolean;
    token: string;
    role?: string;
    currentPhaseIndex?: number;
    teacherStudents?: TeacherStudentSummary[];
    userName?: string;
    email?: string;
};

export async function loginAPI(email: string, password: string): Promise<LoginResponse> {
    try {
        const response = await apiClient.post(`/auth/login`, { email, password });

        return {
            userId: response.data.userId,
            isStudent: response.data.isStudent,
            token: response.data.token,
            currentPhaseIndex: response.data.currentPhaseIndex ?? undefined,
            role: response.data.role ?? undefined,
            teacherStudents: response.data.studentSummaries as TeacherStudentSummary[] | undefined,
            userName: response.data.userName ?? undefined,
            email: response.data.email ?? undefined,
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