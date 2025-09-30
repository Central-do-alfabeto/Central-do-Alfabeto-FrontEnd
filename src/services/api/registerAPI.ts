import apiClient from "./apiClient";

export async function registerAPI(email: string, password: string, fullName: string, AccountType: string) {
    console.log("Função ativada");
    try {
        const response = await apiClient.post(`/${AccountType}/register`, {
            fullName,
            email,
            senha: password
        });

        console.log(response);
        return response.data;
    } catch (error) {
        if (error instanceof Error) {
            console.error("Erro em registerAPI:", error.message);
        } else {
            console.error("Erro não esperado:", error);
        }
        throw error;
    }   
}