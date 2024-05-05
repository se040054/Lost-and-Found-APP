import styled from "styled-components";
import logo from "../../assets/lost-and-found.svg";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ToggleThemeButton from "./ToggleThemeButton";
import Navbar from "react-bootstrap/Navbar";
import Swal from "sweetalert2";
import { Container, Row, Col, Nav } from "react-bootstrap";
export default function HeaderTest() {
  const { isLogin, logout, currentMember } = useAuth();
  console.log(currentMember);

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
    <NavBarStyled fixed="top">
      {/* 左邊資訊個人欄位 */}
      <Container fluid className="justify-content-start">
        {/* fluid 消除container自帶的300margin */}
        {/* 左側 Nav A */}{" "}
        <Nav>
          <Navbar.Brand href="/home">
            <Logo/>
            <Navbar.Brand href="/home">Lost & Found</Navbar.Brand>
            {currentMember && (
              <>
                <Navbar.Brand href="/home">
                  <img
                    src={currentMember.avatar}
                    width="45px"
                    height="45px"
                    alt=""
                    className="ms-3  rounded-circle"
                  />
                </Navbar.Brand>
                <Navbar.Brand href="/home">{currentMember.name}</Navbar.Brand>
              </>
            )}
          </Navbar.Brand>{" "}
        </Nav>
      </Container>
      {/* 中間 連結 */}{" "}
      <Container fluid className="justify-content-center">
        <Nav>
          <LinkStyled to="/login">個人檔案</LinkStyled>
          <LinkStyled to="/login">我的刊登</LinkStyled>
          <LinkStyled to="/login">我的商家</LinkStyled>
        </Nav>
      </Container>
      {/* 右邊 登出 輔助 */}
      <Container fluid className="justify-content-end">
        <Nav>
          <ToggleThemeButton/>
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
        </Nav>
      </Container>
    </NavBarStyled>
  );
}

const NavBarStyled = styled(Navbar)`
  background-color: ${(props) => props.theme.headerBackground};
  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
  height:70px;
`;

const Logo = styled.img`
  width: 50px;
  height: 50px;
  content: url(${logo});
  margin: 0 10px 0 30px;
`;

const LinkStyled = styled(Link)`
  color: ${(props) => props.theme.text};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 10px 20px;
  font-size: 22px;
  border-radius: 25px;
  font-weight: bold;
  &:hover {
    color: ${(props) => props.theme.hoverText};
    background-color: #f2fffaa2;
  }
`;
