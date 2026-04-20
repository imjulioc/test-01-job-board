"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { SyntheticEvent } from "react";
import { useState } from "react";

interface TitleSearchProps {
	currentTitle?: string;
}

export function TitleSearch({ currentTitle = "" }: TitleSearchProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [value, setValue] = useState(currentTitle);

	const updateQuery = (title?: string) => {
		const params = new URLSearchParams(searchParams.toString());

		if (title?.trim()) {
			params.set("title", title.trim());
		} else {
			params.delete("title");
		}

		params.set("offset", "0");
		const query = params.toString();
		router.push(query ? `/jobs?${query}` : "/jobs");
	};

	const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
		event.preventDefault();
		updateQuery(value);
	};

	const handleClear = () => {
		setValue("");
		updateQuery("");
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
		>
			<label
				htmlFor="title-search"
				className="block text-sm font-medium text-slate-700"
			>
				Buscar título
			</label>
			<div className="flex gap-2">
				<input
					id="title-search"
					value={value}
					onChange={event => setValue(event.target.value)}
					type="search"
					placeholder="Escribe un título"
					className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
				/>
				<button
					type="submit"
					className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
				>
					Buscar
				</button>
			</div>
			{currentTitle ? (
				<button
					type="button"
					onClick={handleClear}
					className="text-sm text-slate-500 underline transition hover:text-slate-700"
				>
					Borrar filtro
				</button>
			) : null}
		</form>
	);
}
