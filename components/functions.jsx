import React, { useState } from "react";

import { supabase } from "../client";

const Homepage = ({ token }) => {
	const [newName, setNewName] = useState(""); // Estado para o novo nome do dispositivo

	const handleInputChange = (event) => {
		setNewName(event.target.value); // Atualiza o estado newName com o valor do input
	};

	const add = async () => {
		try {
			const { data, error } = await supabase.rpc(
				"create_dispositivo_for_user",
				{
					dispositivo_id: "b167d782-03c1-496e-aeed-41d926fdc665",
					nome: "testelrv",
				},
			);

			if (error) console.log(error);
			else console.log(data);
		} catch (error) {
			console.log(error);
		}
	};

	const deletar = async () => {
		try {
			const { data, error } = await supabase.rpc(
				"delete_dispositivo_for_user",
				{
					dispositivo_id: "b167d782-03c1-496e-aeed-41d926fdc665",
				},
			);

			if (error) console.log(error);
			else console.log(data);
		} catch (error) {
			console.log(error);
		}
	};

	const selectDispositivos = async () => {
		try {
			const { data, error } = await supabase.rpc(
				"select_dispositivos_for_user",
			);

			if (error) console.log(error);
			console.log(data);
		} catch (error) {
			console.log(error);
		}
	};

	const selectDados = async () => {
		try {
			const { data, error } = await supabase.rpc(
				"select_dados_coletados_for_dispositivo",
				{
					dispositivo_id: "b167d782-03c1-496e-aeed-41d926fdc665",
				},
			);

			if (error) console.log(error);
			console.log(data);
		} catch (error) {
			console.log(error);
		}
	};

	const updateName = async () => {
		try {
			const { data, error } = await supabase.rpc(
				"update_nome_for_dispositivo",
				{
					dispositivo_id: "b167d782-03c1-496e-aeed-41d926fdc665",
					nome: newName, // Passa o novo nome do dispositivo
				},
			);

			if (error) console.log(error);
			else console.log(data);
		} catch (error) {
			console.log(error);
		}
	};

	const updateStatus = async () => {
		try {
			const { data, error } = await supabase.rpc(
				"update_status_for_dispositivo",
				{
					dispositivo_id: "b167d782-03c1-496e-aeed-41d926fdc665",
				},
			);

			if (error) console.log(error);
			else console.log(data);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div>
			<h3>Welcome back, {token.user.user_metadata.full_name}</h3>
			<button onClick={add}>Adicionar dispositivo</button>
			<button onClick={deletar}>Deletar dispositivo</button>
			<button onClick={selectDispositivos}>Selecionar dispositivos</button>
			<button onClick={selectDados}>Selecionar dados do dispositivo</button>
			<input
				type="text"
				placeholder="Novo Nome"
				value={newName}
				onChange={handleInputChange}
			/>
			<button onClick={updateName}>Atualizar Nome</button>
			<button onClick={updateStatus}>ON/OFF</button>
		</div>
	);
};

export default Homepage;
