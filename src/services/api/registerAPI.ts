import axios from "axios";

export async function registerAPI(email: string, password: string, fullName: string, AccountType: string) {
    console.log("Função ativada");
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/${AccountType}/register`, {
            fullName,
            email,
            password
        });
        
        console.log(response);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Erro em registerAPI:", error.message);
            throw error;
        }
        console.error("Erro não esperado:", error);
        throw error;
    }   
}