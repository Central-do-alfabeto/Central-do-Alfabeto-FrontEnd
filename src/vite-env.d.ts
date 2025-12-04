/// <reference types="vite/client" />

interface CentralDoAlfabetoDebugApi {
	enableAutoSpeechAutoPass(): boolean; // Força vitória automática em atividades de fala
	disableAutoSpeechAutoPass(): boolean; // Desativa vitória automática em atividades de fala
	toggleAutoSpeechAutoPass(force?: boolean): boolean; // Alterna o estado da vitória automática em atividades de fala
	isAutoSpeechAutoPassEnabled(): boolean; // Verifica se a vitória automática em atividades de fala está ativada
}

declare global {
	interface Window {
		centralDoAlfabetoDebug?: CentralDoAlfabetoDebugApi;
	}
}

export {};
