import axios from "axios";


export async function registerAPI(email: string, password: string, nomeCompleto: string, AccountType: string) {
    try {
        const response = await axios.post(`${import.meta.env.API_URL}/${AccountType}/register`, {
            email,
            password,
            nomeCompleto,
        });

        return response.data;
    } catch (err: any) {
        console.error("Erro em registerAPI:", err.message);
        throw err;
    }   
}