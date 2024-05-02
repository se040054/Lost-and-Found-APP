import styled from "styled-components";
import AuthInputContainer from "../components/AuthInput";
import { useState } from "react";

import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";

const RegisterPage = () => {
  const defaultForm = {
    account: "",
    password: "",
    confirmPassword: "",
    name: "",
  };
  const [form, setForm] = useState(defaultForm);
  const handleInputOnchange = (attr, inputValue) => {
    setForm({
      ...form,
      [attr]: inputValue,
    });
  };

  const { login, isLogin } = useAuth();
  const handleSubmit = async (e) => {
    const { name, account, password, confirmPassword } = form;
    console.log(name, account);
    if (
      name.length < 2 ||
      account.length < 4 ||
      password.length < 4 ||
      confirmPassword.length < 4
    ) {
      Swal.fire({
        title: "註冊失敗",
        text: "欄位未填寫完整",
        icon: "question",
      });
      return;
    }
    try {
      const status = await login(form);
      if (status === "success") {
        Swal.fire({
          title: "註冊成功!",
          text: "好",
          icon: "success",
        });
      } else {
        Swal.fire({
          title: "註冊失敗!",
          button: "好",
          icon: "success",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <AuthPage>
      <AuthContainer>
        <AuthTextContainer>
          <AuthTitle>建立您的免費帳戶 </AuthTitle>
          <AuthInputContainer
            label="帳號"
            type="text"
            placeholder="請輸入帳號"
            value={form.account}
            onChange={(inputValue) =>
              handleInputOnchange("account", inputValue)
            }
          ></AuthInputContainer>
          <AuthInputContainer
            label="密碼"
            type="password"
            placeholder="請輸入密碼"
            value={form.password}
            onChange={(inputValue) =>
              handleInputOnchange("password", inputValue)
            }
          ></AuthInputContainer>
          <AuthInputContainer
            label="確認密碼"
            type="password"
            placeholder="確認密碼"
            value={form.confirmPassword}
            onChange={(inputValue) =>
              handleInputOnchange("confirmPassword", inputValue)
            }
            isInvalid={() => {
              return form.password !== form.confirmPassword;
            }}
          ></AuthInputContainer>
          <AuthInputContainer
            label="用戶名稱"
            type="text"
            placeholder="請輸入用戶名稱"
            value={form.name}
            onChange={(inputValue) => handleInputOnchange("name", inputValue)}
          ></AuthInputContainer>
          <AuthButton onClick={handleSubmit}>註冊</AuthButton>
          <AuthLink>
            已經有帳號了? <a href="/login">登入</a>
          </AuthLink>
        </AuthTextContainer>
      </AuthContainer>

      <AuthBanner>大圖片</AuthBanner>
    </AuthPage>
  );
};

export default RegisterPage;

const AuthPage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
`;

const AuthContainer = styled.div`
  background-color: ${({ theme }) => theme.containerBackground};
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 50%;
`;

const AuthBanner = styled.div`
  display: flex;
  width: 50%;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const AuthButton = styled.button`
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
  &.hover {
    cursor: pointer;
  }
`;

const AuthTitle = styled.div`
  width: 100%;
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  text-align: start;
`;
const AuthLink = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  text-align: center;
`;

const AuthTextContainer = styled.div`
  margin-top: 120px;
`;
