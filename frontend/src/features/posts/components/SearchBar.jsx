import React from 'react';
import { Search } from 'lucide-react';
import Input from '../../../components/ui/Input';

const SearchBar = ({ value, onChange }) => {
  return (
    <div className="relative w-full">
      <Search 
        className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" 
        size={18} 
      />
      <Input
        type="text"
        placeholder="Rechercher une demande..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 h-11 bg-white border-secondary-200 shadow-sm focus:border-primary-300 transition-all"
      />
    </div>
  );
};

export default SearchBar;
