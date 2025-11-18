import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function SearchBar({ onSearch, placeholder = "Buscar na wiki..." }) {
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        className="pl-12 pr-4 py-6 text-lg border-2 border-slate-200 focus:border-purple-500 rounded-2xl"
      />
    </div>
  );
}
