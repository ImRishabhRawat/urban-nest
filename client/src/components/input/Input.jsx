import {BiDollar} from 'react-icons/bi'
const Input = ({id, label, type = "text", disabled, formatPrice, register, errors, options, registerOptions}) => {
  return (
      <div className='w-full relative'>
          {formatPrice && (
              <BiDollar
                  size={24}
                  className="text-neutral-700 absolute top-5 left-2" 
              />
          )}
          {type === 'select' ? (
            <select id={id} disabled={disabled} {...register(id)}
              className={`peer w-full p-4 pt-6 font-light bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed
              ${formatPrice ? 'pl-9' : 'pl-4'}
              ${errors[id] ? 'border-rose-500' : 'border-neutral-300'}
              ${errors[id] ? 'focus:border-rose-500' : 'focus:border-black'}
          `}>
              {options.map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
          ) : (
            <input id={id} disabled={disabled} {...register(id, registerOptions)} placeholder='' type={type}
              className={`peer w-full p-4 pt-6 font-light bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed
              ${formatPrice ? 'pl-9' : 'pl-4'}
              ${errors[id] ? 'border-rose-500' : 'border-neutral-300'}
              ${errors[id] ? 'focus:border-rose-500' : 'focus:border-black'}
          `}
          />
          )}
          <label
          className={`absolute text-sm duration-150 transform -translate-y-3 top-5 z-10 origin-[0] ${formatPrice ? 'left-9' : 'left-4'} peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 ${errors[id] ? 'text-rose-500' : 'text-zinc-400'}`}
          >
              {label}
          </label>
          {errors[id] && (
            <p className="text-red-500 text-xs pt-2">{errors[id].message}</p>
          )}
    </div>
  )
}

export default Input;
