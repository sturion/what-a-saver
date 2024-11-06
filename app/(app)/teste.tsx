import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";

const App: React.FC = () => {
	const [espIp] = useState<string>("192.168.4.1");
	const [ssid, setSsid] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [webSocketOpen, setWebSocketOpen] = useState<boolean>(false);
	const [ws, setWs] = useState<WebSocket | null>(null);

	const connectWebSocket = () => {
		const websocket = new WebSocket(`ws://${espIp}:80`);

		websocket.onopen = () => {
			console.log("Conectado ao ESP32 via WebSocket");
			setWebSocketOpen(true);
			setWs(websocket);
		};

		websocket.onmessage = (event) => {
			console.log("Mensagem recebida do ESP32:", event.data);
		};

		websocket.onerror = (error) => {
			console.error("Erro WebSocket:", error);
		};

		websocket.onclose = () => {
			console.log("Conexão WebSocket fechada");
			setWebSocketOpen(false);
			setWs(null);
		};
	};

	const sendWifiCredentials = () => {
		if (webSocketOpen && ws) {
			const credentials = `${ssid}$${password}`;
			ws.send(credentials);
			console.log("Credenciais enviadas:", credentials);
		} else {
			console.log("WebSocket não está conectado.");
		}
	};

	useEffect(() => {
		connectWebSocket();
	}, [ws]);

	return (
		<View style={{ padding: 20 }}>
			<Text>Conexão WebSocket com ESP302</Text>

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
				onPress={sendWifiCredentials}
			>
				<Text>Open Modal</Text>
				</Button>
		</View>
	);
};

export default App;
