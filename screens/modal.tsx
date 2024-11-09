import { useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
import {
	View,
	ScrollView,
	Dimensions,
	ActivityIndicator,
	Modal as LittleModal,
	TouchableOpacity,
} from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { LineChart } from "react-native-chart-kit";
import { supabase } from "../config/supabase";

interface rawData {
	[key: string]: any;
}

interface Dados {
	corrente: number[];
	potencia: number[];
	tensao: number[];
	created_at: string[];
}

export default function Modal() {
	const { deviceId, name } = useLocalSearchParams();
	const [newName, setNewName] = useState<string>(
		typeof name === "string" ? name : "",
	);
	console.log(deviceId);
	const [rawData, setRawData] = useState<rawData>({});
	const [chart, setChart] = useState<Dados>({
		corrente: [],
		potencia: [],
		tensao: [],
		created_at: [],
	});
	const [isLoading, setIsLoading] = useState(true);

	// Estados para o modal de confirmação
	const [modalVisible, setModalVisible] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false); // Para controlar o processo de deleção

	const fetchData = async () => {
		setIsLoading(true);
		const data = await selectDados();
		if (data?.data) {
			separarDados(data.data);
		}
		setIsLoading(false);
	};

	useEffect(() => {
		fetchData();
	}, [deviceId]);

	const separarDados = (
		data: {
			corrente: number;
			potencia: number;
			tensao: number;
			created_at: string;
		}[],
	) => {
		const corrente = data.map((item) => item.corrente);
		const potencia = data.map((item) => item.potencia);
		const tensao = data.map((item) => item.tensao);
		const created_at = data.map((item) => {
			const date = new Date(item.created_at);
			const day = String(date.getDate()).padStart(2, "0");
			const month = String(date.getMonth() + 1).padStart(2, "0"); // Mês começa de 0
			const hours = String(date.getHours()).padStart(2, "0");
			const minutes = String(date.getMinutes()).padStart(2, "0");
			const seconds = String(date.getSeconds()).padStart(2, "0");
			return `${day}/${month} ${hours}:${minutes}:${seconds}`;
		});
		setChart({ corrente, potencia, tensao, created_at });
	};

	const selectDados = async () => {
		try {
			const { data, error } = await supabase.rpc(
				"select_dados_coletados_for_dispositivo",
				{
					dispositivo_id: deviceId,
				},
			);
			if (error) {
				console.log(error);
				return null;
			}
			return data;
		} catch (error) {
			console.log(error);
			return null;
		}
	};

	const updateName = async () => {
		try {
			const { data, error } = await supabase.rpc(
				"update_nome_for_dispositivo",
				{
					dispositivo_id: deviceId,
					nome: newName,
				},
			);
			if (error) console.log(error);
			else console.log(data);
		} catch (error) {
			console.log(error);
		}
	};
	const deleteDevice = async () => {
		try {
			const { data, error } = await supabase.rpc(
				"delete_dispositivo_for_user",
				{
					dispositivo_id: deviceId,
				},
			);

			if (error) console.log(error);
			else console.log(data);
		} catch (error) {
			console.log(error);
		}
	};

	const screenWidth = Dimensions.get("window").width;

	const chartConfig = {
		backgroundColor: "#1E2923",
		backgroundGradientFrom: "#08130D",
		backgroundGradientTo: "#1E2923",
		decimalPlaces: 2,
		color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
		labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
		style: { borderRadius: 16 },
	};

	return (
		<ScrollView style={{ padding: 20 }}>
			<Input
				placeholder="Nome do dispositivo"
				value={newName}
				onChangeText={setNewName}
				style={{
					marginBottom: 20,
					borderColor: "gray",
					borderWidth: 1,
					padding: 8,
				}}
			/>
			<Button onPress={updateName}><Text>Alterar nome</Text></Button>

			{/* Loading Indicator */}
			{isLoading ? (
				<ActivityIndicator size="large" color="#0000ff" />
			) : chart.corrente.length > 0 ? (
				<>
					{/* Gráfico de Corrente */}
					<Text style={{ marginTop: 20 }}>Gráfico de Corrente</Text>
					<LineChart
						data={{
							labels: chart.created_at,
							datasets: [{ data: chart.corrente, color: () => "red" }],
						}}
						width={screenWidth - 40}
						height={400}
						verticalLabelRotation={270}
						yAxisLabel=""
						yAxisSuffix="A"
						xLabelsOffset={55}
						yLabelsOffset={5}
						chartConfig={chartConfig}
						bezier
						style={{ marginVertical: 0, borderRadius: 8 }}
					/>

					{/* Gráfico de Tensão */}
					<Text style={{ marginTop: 20 }}>Gráfico de Tensão</Text>
					<LineChart
						data={{
							labels: chart.created_at,
							datasets: [{ data: chart.tensao, color: () => "blue" }],
						}}
						width={screenWidth - 40}
						height={400}
						verticalLabelRotation={270}
						yAxisLabel=""
						yAxisSuffix="V"
						xLabelsOffset={55}
						yLabelsOffset={5}
						chartConfig={{
							...chartConfig,
							color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
						}}
						bezier
						style={{ marginVertical: 10, borderRadius: 8 }}
					/>

					{/* Gráfico de Potência */}
					<Text style={{ marginTop: 20 }}>Gráfico de Potência</Text>
					<LineChart
						data={{
							labels: chart.created_at,
							datasets: [{ data: chart.potencia, color: () => "green" }],
						}}
						width={screenWidth - 40}
						height={400}
						verticalLabelRotation={270}
						xLabelsOffset={55}
						yLabelsOffset={5}
						yAxisLabel=""
						yAxisSuffix="W"
						chartConfig={{
							...chartConfig,
							color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`,
						}}
						bezier
						style={{ marginVertical: 10, borderRadius: 8 }}
					/>
				</>
			) : (
				<Text>Nenhum dado disponível para exibir.</Text>
			)}

			{/* Modal de confirmação de deleção */}
			<LittleModal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => setModalVisible(false)}
			>
				<View
					style={{
						flex: 1,
						justifyContent: "center",
						alignItems: "center",
						backgroundColor: "rgba(0, 0, 0, 0.5)",
					}}
				>
					<View
						style={{
							width: 300,
							padding: 20,
							backgroundColor: "white",
							borderRadius: 8,
						}}
					>
						<Text style={{ fontSize: 18, marginBottom: 20 }}>
							Tem certeza que deseja deletar o dispositivo?
						</Text>
						<View
							style={{ flexDirection: "row", justifyContent: "space-between" }}
						>
							<TouchableOpacity onPress={() => setModalVisible(false)}>
								<Text style={{ color: "red" }}>Não</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={deleteDevice}>
								<Text style={{ color: "green" }}>Sim</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</LittleModal>

			<TouchableOpacity
				onPress={() => setModalVisible(true)}
				style={{
					backgroundColor: "#ff6961",
					borderRadius: 4,
					padding: 10,
					alignItems: "center",
				}}
			>
				<Text style={{ color: "white", fontSize: 16 }}>
					Deletar dispositivo
				</Text>
			</TouchableOpacity>
			<View style={{ height: 30 }} />
		</ScrollView>
	);
}
