import { NextRequest, NextResponse } from "next/server";

// Define a type for the request body
interface PostRequestBody {
	data: any[]; // Allow any type in the array
}

function areCapitalAlphabetsConsecutive(alphabets: string[]): boolean {
	const capitalAlphabets = alphabets
		.filter((item) => /^[A-Z]$/.test(item))
		.sort();
	for (let i = 0; i < capitalAlphabets.length - 1; i++) {
		if (
			capitalAlphabets[i].charCodeAt(0) + 1 !==
			capitalAlphabets[i + 1].charCodeAt(0)
		) {
			return false;
		}
	}
	return capitalAlphabets.length > 1;
}

export async function POST(request: NextRequest) {
	try {
		const body: PostRequestBody = await request.json();
		const data = Array.isArray(body.data) ? body.data : []; // Ensure `data` is an array

		const numbers = data.filter((item) => !isNaN(Number(item)));
		const alphabets = data.filter((item) => /^[a-zA-Z]$/.test(item));
		const lowercaseAlphabets = alphabets.filter((item) =>
			/^[a-z]+$/.test(item)
		);

		const highestLowercaseAlphabet =
			lowercaseAlphabets.length > 0
				? lowercaseAlphabets.sort().reverse()[0]
				: null;

		if (areCapitalAlphabetsConsecutive(alphabets)) {
			return NextResponse.json(
				{
					is_success: false,
					message: "Capital alphabets are consecutive.",
				},
				{ status: 400 }
			);
		}

		const response = {
			is_success: true,
			user_id: "john_doe_17091999", // Replace with dynamic data as needed
			email: "john@xyz.com", // Replace with dynamic data as needed
			roll_number: "ABCD123", // Replace with dynamic data as needed
			numbers: numbers,
			alphabets: alphabets,
			highest_lowercase_alphabet: highestLowercaseAlphabet
				? [highestLowercaseAlphabet]
				: [],
		};

		return NextResponse.json(response);
	} catch (error) {
		return NextResponse.json(
			{ is_success: false, error: (error as Error).message },
			{ status: 500 }
		);
	}
}

export async function GET() {
	return NextResponse.json({ operation_code: 1 });
}
