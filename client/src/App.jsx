import { useEffect } from "react";
import "./App.css";
import Layout from "./layout/Layout";

const App = () => {
  useEffect(() => {
    // Apply the scroll class to the body
    document.body.classList.add("scroll");

    // Optional: Clean up the class when the component unmounts
    return () => {
      document.body.classList.remove("scroll");
    };
  }, []);
  return (
    <>
    <Layout />
    </>
  )
}

export default App
