import { NextRequest, NextResponse } from "next/server";

// Type definition for the request body
interface PostRequestBody {
	data: {
		data: (string | number)[]; // Data can be an array of strings or numbers
	};
}

// Helper functions to generate random values
function generateRandomUserId(): string {
	const timestamp = Date.now();
	const randomNum = Math.floor(Math.random() * 1000);
	return `user_${timestamp}_${randomNum}`;
}

function generateRandomEmail(): string {
	const randomNum = Math.floor(Math.random() * 1000);
	return `user${randomNum}@example.com`;
}

function generateRandomRollNumber(): string {
	const randomNum = Math.floor(100000 + Math.random() * 900000); // 6-digit number
	return `ROLL${randomNum}`;
}

// Handler for GET requests
export async function GET(request: NextRequest) {
	return NextResponse.json(
		{
			operation_code: 1,
		},
		{ status: 200 } // 200 OK
	);
}

// Handler for POST requests
export async function POST(request: NextRequest) {
	try {
		const body: PostRequestBody = await request.json();
		const data = Array.isArray(body.data.data) ? body.data.data : []; // Extract nested data array

		// Check for words that are not purely numeric (invalid if they are longer than 1 character and contain non-numeric characters)
		const invalidWords = data.filter(
			(item) =>
				typeof item === "string" &&
				item.length > 1 &&
				isNaN(Number(item))
		);
		if (invalidWords.length > 0) {
			return NextResponse.json(
				{
					is_success: false,
					message: "Words are not allowed.",
				},
				{ status: 400 }
			);
		}

		const numbers = data.filter((item) => !isNaN(Number(item))).map(String);
		const alphabets = data.filter(
			(item): item is string =>
				typeof item === "string" && /^[a-zA-Z]$/.test(item)
		);
		const lowercaseAlphabets = alphabets.filter((item) =>
			/^[a-z]$/.test(item)
		);

		const highestLowercaseAlphabet =
			lowercaseAlphabets.length > 0
				? lowercaseAlphabets.sort().reverse()[0]
				: null;

		// Check for consecutive capital alphabets
		if (areCapitalAlphabetsConsecutive(alphabets)) {
			return NextResponse.json(
				{
					is_success: false,
					message: "Consecutive capital alphabets are not allowed.",
				},
				{ status: 400 }
			);
		}

		const response = {
			is_success: true,
			user_id: generateRandomUserId(), // Generate dynamic user ID
			email: generateRandomEmail(), // Generate dynamic email
			roll_number: generateRandomRollNumber(), // Generate dynamic roll number
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

// Function to check if capital alphabets are consecutive
function areCapitalAlphabetsConsecutive(alphabets: string[]): boolean {
	const capitalAlphabets = alphabets
		.filter((item) => /^[A-Z]$/.test(item))
		.sort();
	for (let i = 0; i < capitalAlphabets.length - 1; i++) {
		if (
			capitalAlphabets[i].charCodeAt(0) + 1 ===
			capitalAlphabets[i + 1].charCodeAt(0)
		) {
			return true; // Found consecutive capitals
		}
	}
	return false;
}
