import avatar from '../assets/logo/avatar2.png';

const Avatar = ({userImg}) => {
  return (
    <img src={userImg || avatar} alt="" className='rounded-full h-6 w-6 border-[1px] border-zinc-600 '/>
  )
}

export default Avatar
