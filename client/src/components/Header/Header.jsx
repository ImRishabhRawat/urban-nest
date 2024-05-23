
import { Link, useLocation } from "react-router-dom";
import Container from "../Container";
import Logo from "./Logo";
import Search from "./Search";
import UserMenu from "./UserMenu";
import Categories from "./Categories";

const Header = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  return (
    <div className="fixed w-full bg-white z-10 shadow-sm">
      <div className="py-4 border-b-[1px] ">
        <Container>
          <div className="flex flex-grow items-center justify-between gap-3 md:gap-0">
            <Link to="/">
            <Logo />
            </Link>
            <Search />
            <UserMenu />
          </div>
        </Container>
      </div>
       {isHomePage && <Categories />}
    </div>
  )
}

export default Header
