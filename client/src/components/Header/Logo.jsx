import logo from '../../assets/logo/urban.png'
import short from '../../assets/logo/short-logo.png'

const Logo = () => {
    return (
      <>
      <img src={logo} alt="" className='hidden xl:block cursor-pointer h-8' />
      <img src={short} alt="" className='hidden sm:block xl:hidden cursor-pointer h-8' />
      </>

  )
}

export default Logo
