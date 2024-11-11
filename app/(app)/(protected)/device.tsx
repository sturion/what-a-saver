import { router } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";

import { supabase } from "../../../config/supabase";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";

export default function Device() {
	const [espIp] = useState<string>("192.168.4.1");
	const [ssid, setSsid] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [idDispositivo, setIdDispositivo] = useState<string>("");
	const [devName, setDevName] = useState<string>("");

	// Novo estado para rastrear tentativas e status
	const [attempts, setAttempts] = useState<number>(0);
	const [statusMessage, setStatusMessage] = useState<string>("");
	const [isTrying, setIsTrying] = useState<boolean>(true);

	const sendWifiCredentials = async () => {
		const url = `http://${espIp}/configurar_wifi?ssid=${encodeURIComponent(ssid)}&password=${encodeURIComponent(password)}`;

		try {
			const response = await fetch(url, { method: "POST" });
			if (response.ok) {
				const data = await response.json();
				console.error("Resposta do ESP:", data);
				setIdDispositivo(data.id_dispositivo);

				if (data.id_dispositivo) {
					setIdDispositivo(data.id_dispositivo);
					attemptToAddDevice(data.id_dispositivo);
				} else {
					console.error("ID do dispositivo não encontrado");
				}
			} else {
				console.error("Falha ao conectar:", response.status);
			}
		} catch (error) {
			console.error("Erro ao enviar as credenciais:", error);
		}
	};

	// Função que tentará adicionar o dispositivo várias vezes
	const attemptToAddDevice = async (id_disp:string) => {
		setIsTrying(true);
		setAttempts(0);
		let maxAttempts = 50;
		const retryInterval = 5000; // Intervalo de 5 segundos

		while (attempts < maxAttempts) {
			setStatusMessage(`Tentando adicionar dispositivo... Tentativa ${attempts + 1}`);
			const success = await add(id_disp);

			if (success) {
				setStatusMessage("Dispositivo adicionado com sucesso!");
				router.push("/");
				break;
			}

			setAttempts((prev) => prev + 1);
			setStatusMessage(`Tentativa ${attempts + 1} falhou. Tentando novamente em 5 segundos...`);
			await new Promise((resolve) => setTimeout(resolve, retryInterval));
		}

		if (attempts === maxAttempts) {
			setStatusMessage("Limite de tentativas atingido. Não foi possível adicionar o dispositivo.");
		}
		setIsTrying(false);
	};

	// Função que adiciona o dispositivo usando Supabase
	const add = async (id_disp:string): Promise<boolean> => {
		try {
			const { data, error } = await supabase.rpc("create_dispositivo_for_user", {
				dispositivo_id: id_disp,
				nome: devName,
			});

			if (error) {
				console.error("Erro ao adicionar dispositivo:", error);
				return false;
			}

			console.log("Dispositivo adicionado:", data);
			console.error("Dispositivo adicionado:", data);
			return true;
		} catch (error) {
			console.error("Erro ao tentar adicionar o dispositivo:", error);
			return false;
		}
	};

	return (
		<View style={{ padding: 20 }}>
			<Text>Insira o ID de sua rede e a senha de seu Wi-Fi</Text>
			<Text>Certifique-se de estar conectado na rede Wi-Fi chamada ESP-AP</Text>
			<Text>(Em alguns casos, é necessário desligar os dados móveisss)</Text>
			<Input
				placeholder="Nome do dispositivo"
				value={devName}
				onChangeText={setDevName}
				style={{ borderWidth: 1, marginTop: 10 }}
			/>
			<Input
				placeholder="SSID"
				value={ssid}
				onChangeText={setSsid}
				style={{ borderWidth: 1, marginTop: 10 }}
			/>
			<Input
				placeholder="Senha do Wi-Fi"
				value={password}
				onChangeText={setPassword}
				secureTextEntry
				style={{ borderWidth: 1, marginTop: 10 }}
			/>
			
			<Button
				className="mt-5"
				onPress={async () => {
					await sendWifiCredentials();
				}}
				//disabled={isTrying}
			>
				<Text>{isTrying ? "Tentando adicionar..." : "Adicionar dispositivo"}</Text>
			</Button>

			{/* Elemento de texto para exibir o status */}
			{isTrying && (
				<Text style={{ marginTop: 20, color: "blue" }}>
					{statusMessage}
				</Text>
			)}
		</View>
	);
}
