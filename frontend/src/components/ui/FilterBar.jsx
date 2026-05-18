import React, { useState } from 'react';

const FilterBar = ({ filieres, technologies, onFilterChange }) => {

const  [filters , setFilters] = useState({
    filiere: '',
    technologie: ''
})

const handleChange = (key, value) => {
  const newFilters = { ...filters, [key]: value };
  setFilters(newFilters);
  onFilterChange(newFilters);  // onFilterChange = function li kayn f FeedPage.jsx li katb3at l filters l backend bash yjib l posts li kayn fiha had filters
};


  return (
    <div className='hover:shadow-soft-lg  gap-5 rounded-lg px-3 py-2 text-sm font-medium text-secondary-500 hover:bg-secondary-50 hover:text-secondary-900 transition-default flex items-center'>
      <select className='shadow-soft-lg px-3 py-2 max-w-[220px] w-full text-ellipsis overflow-hidden whitespace-nowrap rounded-lg border border-secondary-100 outline-none cursor-pointer' onChange={(e)=>handleChange('filiere' , e.target.value)} >
            <option value="">Toutes les filières</option>
            {
                filieres?.map((elem)=>( 
                   <option key={elem} value={elem} >{elem}</option>
                ))
            }
      </select>
    <select className='shadow-soft-lg px-3 py-2 max-w-[180px] w-full text-ellipsis overflow-hidden whitespace-nowrap rounded-lg border border-secondary-100 outline-none cursor-pointer' onChange={(e)=>handleChange('technologie' , e.target.value)}>
        <option value="">Tout les technologie</option>
        {
            technologies?.map((elem)=>(
                <option value={elem} key={elem}>{elem}</option>
            ))
        }
    </select>


        {/* // f7alat user bra y7yed kol les filtres b click wa7ed — bla ma ymshi ybdel kol select lih rasou */}
        <button className='shadow-soft-lg px-3 py-2 ' onClick={() => {setFilters({ filiere: '', technologie: '' }); onFilterChange({ filiere: '', technologie: '' })}}>Reset</button> 
    </div>
  );
};

export default FilterBar;