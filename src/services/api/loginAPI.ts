import axios from 'axios';

export async function loginAPI(email: string, password: string) {
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, { email, password });

    return {
        name: response.data.user.name,
        isStudent: response.data.user.isStudent,
        currentPhaseIndex: response.data.user.currentPhaseIndex || undefined,
        teacherStudents: response.data.usar.teacherStudents || undefined
    };
    
    } catch (error: any) {
        throw new Error(error.response?.data || "Erro no login");
    }
}