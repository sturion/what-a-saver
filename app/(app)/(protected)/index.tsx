import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, View, Image, TouchableOpacity } from "react-native";

import { supabase } from "../../../config/supabase";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";

export default function Home() {
	const [deviceList, setDeviceList] = useState<
		{ id_dispositivo: string; nome: string; status: boolean }[]
	>([]);
	const [refresh, setRefresh] = useState(false);

	useEffect(() => {
		getDevices();
	}, [refresh]);

	async function changeStatus(id: string) {
		try {
			await supabase.rpc("update_status_for_dispositivo", {
				dispositivo_id: id,
			});
			setRefresh(!refresh);
		} catch (error) {
			console.log(error);
		}
	}

	async function getDevices() {
		try {
			const { data } = await supabase.rpc("select_dispositivos_for_user");

			setDeviceList(data.data);
		} catch (error) {
			console.log(error);
		}
	}

	// Função para verificar o status e definir o ícone de energia
	const getStatusIcon = (status: boolean) => {
		return status
			? require("../../../assets/power-on.png") // Ícone de energia ligada
			: require("../../../assets/power-off.png"); // Ícone de energia desligada
	};

	// Componente de card formatado
	const DeviceCard = ({
		status,
		nome,
		id,
	}: {
		status: boolean;
		nome: string;
		id: string;
	}) => {
		return (
			<View className="bg-white p-4 m-2 rounded-lg shadow w-80 flex-row items-center justify-between">
				<View className="flex-1">
					<Text className="text-lg font-bold">{nome}</Text>
					<Text className="text-sm text-gray-500 mt-2">
						{status ? "Ligado" : "Desligado"}
					</Text>
				</View>
				<TouchableOpacity onPress={() => changeStatus(id)}>
					<Image
						source={getStatusIcon(status)}
						style={{ width: 40, height: 40 }}
						className="ml-4"
					/>
				</TouchableOpacity>
			</View>
		);
	};

	return (
		<View className="flex-1 items-center justify-center bg-background p-4">
			<H1 className="text-center mb-4">Home</H1>
			<FlatList
				data={deviceList}
				keyExtractor={(item) => item.id_dispositivo}
				renderItem={({ item }) => (
					<View className="items-center">
						<DeviceCard
							status={item.status}
							nome={item.nome}
							id={item.id_dispositivo}
						/>
					</View>
				)}
				numColumns={1} // Exibe apenas uma coluna
			/>
			<Muted className="text-center mt-4">
				You are now authenticated and this session will persist even after
				closing the app.
			</Muted>
			<Button
				className="w-full mt-4"
				variant="default"
				size="default"
				onPress={() => router.push("/(app)/modal")}
			>
				<Text>Open Modal</Text>
			</Button>
			<Button
				className="w-full mt-4"
				variant="default"
				size="default"
				onPress={() => router.push("/(app)/modal")}
			>
				<Text>Open Modal</Text>
			</Button>
			<Button
				className="w-full mt-4"
				variant="default"
				size="default"
				onPress={() => router.push("/(app)/modal")}
			>
				<Text>Open Modal</Text>
			</Button>
			<Button
				className="w-full mt-4"
				variant="default"
				size="default"
				onPress={() => router.push("/(app)/modal")}
			>
				<Text>Open Modal</Text>
			</Button>
			<Button
				className="w-full mt-4"
				variant="default"
				size="default"
				onPress={() => router.push("/(app)/modal")}
			>
				<Text>Open Modal</Text>
			</Button>
		</View>
	);
}
