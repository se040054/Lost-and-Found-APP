import styled from "styled-components";
import ToggleTheme from "./ToggleThemeButton";

const StyledHeader = styled.header`
  display: flex;
  background-color: ${(props) => props.theme.backgroundColor};
`;
const Header = () => {
  return (
    <StyledHeader>
      <ToggleTheme></ToggleTheme>
    </StyledHeader>
  );
};

export default Header;
