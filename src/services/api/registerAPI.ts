import apiClient from "./apiClient";

export async function registerAPI(
    email: string,
    password: string,
    fullName: string,
    AccountType: string
) {
    console.log("Função ativada");

    const sanitizedRole = AccountType === "players" || AccountType === "educators"
        ? AccountType
        : "educators";

    const payload = {
        nome: fullName.trim(),
        email: email.trim(),
        senha: password,
    };

    try {
        const response = await apiClient.post(`/${sanitizedRole}/register`, payload);

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