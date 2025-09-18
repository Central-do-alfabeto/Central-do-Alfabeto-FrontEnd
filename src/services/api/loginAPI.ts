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
    
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Erro em loginAPI:", error.message);
            throw error;
        }
        console.error("Erro não esperado:", error);
        throw error;
    }
}