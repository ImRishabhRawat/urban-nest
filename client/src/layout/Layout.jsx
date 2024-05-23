import Header from '../components/Header/Header'
import Routers from '../routes/Routers'
import Footer from '../components/Footer/Footer'
import RegisterModal from '../components/modals/RegisterModal'
import { Toaster } from 'react-hot-toast'
import LoginModal from '../components/modals/LoginModal'
import RentModal from '../components/modals/RentModal'
import SearchModal from '../components/modals/SearchModal'
// import ToasterProvider from '../providers/ToasterProvider'

const Layout = () => {
    return <>
        <Toaster />
        <SearchModal/>
        <RentModal />
        <RegisterModal />
        <LoginModal />
        <Header />
        <main className='pb-20 pt-28'>
            <Routers />
        </main>
        <Footer />
    </>
}

export default Layout
