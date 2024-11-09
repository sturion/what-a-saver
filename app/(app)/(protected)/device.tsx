import React, { useEffect, useState } from "react";
import { View, Text, Button, TextInput } from "react-native";

export default function Device() {
	const [espIp] = useState<string>("192.168.4.1");
	const [ssid, setSsid] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [webSocketOpen, setWebSocketOpen] = useState<boolean>(false);
	const [ws, setWs] = useState<WebSocket | null>(null);

	const connectWebSocket = (credentials : string) => {
		const websocket = new WebSocket(`ws://${espIp}:23`, credentials);
		console.log(websocket)
	};

	const sendWifiCredentials = () => {
		const credentials = `&${ssid}$${password}`;
			connectWebSocket(credentials);
	};


	return (
		<View style={{ padding: 20 }}>
			<Text>Conexão WebSocket com ESP44</Text>

			<TextInput
				placeholder="SSID"
				value={ssid}
				onChangeText={setSsid}
				style={{ borderWidth: 1, marginTop: 10 }}
			/>
			<TextInput
				placeholder="Senha do Wi-Fi"
				value={password}
				onChangeText={setPassword}
				secureTextEntry
				style={{ borderWidth: 1, marginTop: 10 }}
			/>
			<Button
				title="Enviar Credenciais de Wi-Fi"
				onPress={sendWifiCredentials}
			/>
		</View>
	);
}
