import Select from 'react-select';
import useStates from '../../hooks/useStates';

const StateSelect = ({value, onChange}) => {
  const { getAll } = useStates();

  return (
    <div>
      <Select
        placeholder="Select a state"
        isClearable
        options={getAll()}
        value={value}
        onChange={(value) => onChange(value)}
        formatOptionLabel={(option) => (
          <div className='flex flex-row items-center gap-3'>
            <div>
              {option.label}
              <span className="text-neutral-500 ml-1">
                {option.countryCode}
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

export default StateSelect;
