import styled from "styled-components";
import logo from "../../assets/lost-and-found.svg";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
export default function Header() {
  const { isLogin, logout, currentMember } = useAuth();
  console.log(currentMember);
  const navigate = useNavigate();
  const handleLogout = () => {
    Swal.fire({
      title: "確定要登出嗎?",
      showCancelButton: true,
      confirmButtonText: "登出",
      confirmButtonColor: "#3B8C66",
      cancelButtonText: `取消`,
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        Swal.fire("已登出!", "", "success");
      }
    });
  };

  return (
    <StyledHeader>
      <ActionContainer>
        <Link to="/home">
          <Logo></Logo>
        </Link>
        <Link to="/home">Lost & Found</Link>
        {currentMember && (
          <>
            <Link className="ms-5 me-1" to="/home">
              <img
                src={currentMember.avatar}
                width="45px"
                height="45px"
                alt=""
                style={{ borderRadius: "50%" }}
              />
            </Link>
            <Link to="/home">{currentMember.name}</Link>
          </>
        )}
      </ActionContainer>

      <ActionContainer>
        <LinkStyled to="/login">個人檔案</LinkStyled>
        <LinkStyled to="/login">我的刊登</LinkStyled>
        <LinkStyled to="/login">我的商家</LinkStyled>
      </ActionContainer>

      <ActionContainer>
        {isLogin ? (
          <button className="btn" onClick={() => handleLogout()}>
            登出
          </button>
        ) : (
          <>
            <LinkStyled to="/register">註冊</LinkStyled>
            <LinkStyled to="/login">登入</LinkStyled>
          </>
        )}
      </ActionContainer>
    </StyledHeader>
  );
}

const StyledHeader = styled.header`
  display: flex;
  padding: 10px 20px;
  background-color: ${(props) => props.theme.headerBackground};
  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
  justify-content: space-between;
`;

const Logo = styled.img`
  width: 50px;
  height: 50px;
  content: url(${logo});
  margin: 0 10px 0 30px;
`;

const ActionContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: center;
  justify-content: center;
`;

const LinkStyled = styled(Link)`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding: 10px 20px;
  font-size: 22px;
  border-radius: 25px;
  font-weight: bold;
  &:hover {
    background-color: #f2fffa7c;
  }
`;
