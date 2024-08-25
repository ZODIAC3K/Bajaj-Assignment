"use client";

import { useState, FormEvent } from "react";

interface ResponseData {
	is_success?: boolean;
	user_id?: string;
	email?: string;
	roll_number?: string;
	numbers?: string[];
	alphabets?: string[];
	highest_lowercase_alphabet?: string[];
	error?: string;
}

export default function Home() {
	const [data, setData] = useState<string>("");
	const [filter, setFilter] = useState<string>("");
	const [response, setResponse] = useState<ResponseData | null>(null);
	const [error, setError] = useState<string | null>(null);

	const handlePost = async (event: FormEvent) => {
		event.preventDefault();
		try {
			// Parse the JSON data input
			const parsedData = JSON.parse(data);

			const res = await fetch("/bfhl", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ data: parsedData, filter }),
			});

			if (!res.ok) {
				throw new Error("Network response was not ok");
			}

			const result: ResponseData = await res.json();
			setResponse(result);
			setError(null);
		} catch (err) {
			setError((err as Error).message);
			setResponse(null);
		}
	};

	const handleGet = async () => {
		try {
			const res = await fetch("/bfhl");
			if (!res.ok) {
				throw new Error("Network response was not ok");
			}

			const result: ResponseData = await res.json();
			setResponse(result);
			setError(null);
		} catch (err) {
			setError((err as Error).message);
			setResponse(null);
		}
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
			<h1 className="text-3xl font-bold mb-6">
				Connected to bfhl route for get or post
			</h1>

			{/* POST Request Form */}
			<form
				onSubmit={handlePost}
				className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md"
			>
				<h2 className="text-2xl font-semibold mb-4">POST Request</h2>
				<label
					htmlFor="data"
					className="block text-lg font-medium mb-2"
				>
					JSON Data:
				</label>
				<textarea
					id="data"
					value={data}
					onChange={(e) => setData(e.target.value)}
					rows={4}
					className="w-full p-2 border border-gray-300 rounded-md mb-4"
					required
				/>
				<label
					htmlFor="filter"
					className="block text-lg font-medium mb-2"
				>
					Filter Option:
				</label>
				<select
					id="filter"
					value={filter}
					onChange={(e) => setFilter(e.target.value)}
					className="w-full p-2 border border-gray-300 rounded-md mb-4"
				>
					<option value="">Show All</option>
					<option value="numbers">Numbers</option>
					<option value="alphabets">Alphabets</option>
					<option value="highest_lowercase_alphabet">
						Highest Lowercase Alphabet
					</option>
				</select>
				<button
					type="submit"
					className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
				>
					Submit
				</button>
			</form>

			{/* GET Request Button */}
			<button
				onClick={handleGet}
				className="mt-6 py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600"
			>
				Get Data
			</button>

			{/* Display Response */}
			{response && (
				<div className="mt-6 w-full max-w-lg bg-white p-4 rounded-lg shadow-md">
					<h2 className="text-2xl font-semibold mb-4">Response:</h2>
					<pre className="whitespace-pre-wrap">
						{JSON.stringify(response, null, 2)}
					</pre>
				</div>
			)}

			{error && (
				<div className="mt-6 w-full max-w-lg bg-red-100 p-4 rounded-lg">
					<h2 className="text-2xl font-semibold mb-4 text-red-700">
						Error:
					</h2>
					<pre className="whitespace-pre-wrap text-red-700">
						{error}
					</pre>
				</div>
			)}
		</div>
	);
}
