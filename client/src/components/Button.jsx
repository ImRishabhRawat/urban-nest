
const Button = ({label, onClick, disabled, outline, small, icon}) => {
  return (
      <button
          onClick={onClick}
          disabled={disabled}
          className={`relative disabled:opacity-70 disabled:cursor-not-allowed rounded-lg hover:opacity-80 transition w-full ${outline ? 'bg-white' : 'bg-rose-500'} ${outline ? 'border-black' : 'bg-rose-500'} ${outline ? 'text-black' : 'text-white'} ${small ? 'py-1' : 'py-3'} ${small ? 'text-sm' : 'text-md'} ${small ? 'font-light' : 'font-semibold'} ${small ? 'border-[1px]' : 'border-[2px]'} ${icon && 'flex items-center justify-center'}`}>
      <div className="flex items-center justify-center gap-5">
        {icon}
        {label}
          </div>
      </button>
  )
}

export default Button
