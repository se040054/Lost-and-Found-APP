import styled from "styled-components";



export const AuthPage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
`;


export const AuthContainer = styled.div`
  background-color: ${({ theme }) => theme.containerBackground};
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 50%;
  margin-top: 100px;
`;

export const AuthBanner = styled.div`
  display: flex;
  width: 50%;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const AuthButton = styled.button`
  border-radius: 5px;
  background-color: #217c4a;
  border: none;
  cursor: pointer;
  color: white;
  min-width: 300px;
  font-family: "Noto Sans TC", sans-serif;
  font-weight: bold;
  padding: 6px 0;
  margin: 2rem 0;
  &:hover {
    cursor: pointer;
  }
`;

export const AuthTitle = styled.div`
  margin-bottom: 30px;
  width: 100%;
  text-align: center;
  font-size: 24px;
  font-weight: bold;
`;

export const AuthLink = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  text-align: center;
`;
