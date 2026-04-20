"use client";

import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface FilterSelectProps {
  label: string;
  paramKey: string;
  options: string[];
  value?: string;
  placeholder: string;
}

export function FilterSelect({ label, paramKey, options, value, placeholder }: FilterSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const filteredOptions = useMemo(
    () => options.filter(option => option.toLowerCase().includes(query.toLowerCase())),
    [options, query],
  );

  const updateQuery = (nextValue?: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (nextValue) {
      params.set(paramKey, nextValue);
    } else {
      params.delete(paramKey);
    }

    params.set('offset', '0');
    const queryString = params.toString();
    router.push(queryString ? `/jobs?${queryString}` : '/jobs');
  };

  const currentLabel = value ? `${label}: ${value}` : `Filtrar por ${label.toLowerCase()}`;

  return (
    <div className="relative rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <button
        type="button"
        onClick={() => setOpen(open => !open)}
        className="w-full text-left text-sm font-medium text-slate-900"
      >
        {currentLabel}
      </button>

      {open ? (
        <div className="mt-3 space-y-3">
          <input
            type="search"
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder={placeholder}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
          />

          <button
            type="button"
            onClick={() => updateQuery(undefined)}
            className="text-sm text-slate-500 underline transition hover:text-slate-700"
          >
            Limpiar selección
          </button>

          <ul className="max-h-48 divide-y divide-slate-200 overflow-auto text-sm">
            {filteredOptions.length === 0 ? (
              <li className="px-2 py-2 text-slate-500">No hay coincidencias</li>
            ) : (
              filteredOptions.map(option => (
                <li key={option}>
                  <button
                    type="button"
                    onClick={() => {
                      updateQuery(option);
                      setOpen(false);
                    }}
                    className="w-full px-2 py-2 text-left text-slate-700 transition hover:bg-slate-100"
                  >
                    {option}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
