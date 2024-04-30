import Header from "../components/Header";

const HomePage = ({children}) => {
  return (
    <>
      <Header></Header>
      <h1>HomePage</h1>
      {children}
    </>
  );
};

export default HomePage;
