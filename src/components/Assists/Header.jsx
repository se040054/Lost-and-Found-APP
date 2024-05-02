import styled from "styled-components";

const StyledHeader = styled.header`
  display: flex;
  background-color: ${(props) => props.theme.backgroundColor};
`;
export default function Header() {
  return <StyledHeader></StyledHeader>;
}
