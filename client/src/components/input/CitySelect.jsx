import React from 'react';
import Select from 'react-select';
import useCities from '../../hooks/useCities';

const CitySelect = ({ stateValue, cityValue, onCityChange }) => {
     const { getAll: getAllCities} = useCities(stateValue?.value);
  return (
    <div>
      <Select
        placeholder="Select a city"
        isClearable
        options={getAllCities()}
        value={cityValue}
        onChange={(value) => onCityChange(value)}
        formatOptionLabel={(option) => (
          <div className='flex flex-row items-center gap-3'>
            <div>
              {option.label}
              <span className="text-neutral-500 ml-1">
                {option.stateCode}
              </span>
            </div>
          </div>
        )}
        className={{
          control: () => 'p-3 border-2',
          input: () => 'text-lg',
          option: () => 'text-lg',
        }}
        theme={(theme) => ({
          ...theme,
          borderRadius: 6,
          colors: {
            ...theme.colors,
            primary: 'black',
            primary25: '#ffe4e6'
          }
        })}
      />
    </div>
  )
}

export default CitySelect;
