import styled from "styled-components";
import { useState } from "react";

import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import FormContainer from "../components/AuthForm/FormContainer";
import FormInput from "../components/AuthForm/FormInput";
import { useNavigate } from "react-router-dom";

export default function RegisterPageTest() {
  const navigate = useNavigate();
  const defaultForm = {
    account: "",
    password: "",
    confirmPassword: "",
    name: "",
  };

  const [form, setForm] = useState(defaultForm);
  const { login, isLogin } = useAuth();
  const handleInputOnchange = (attr, e) => {
    // 每個input的邏輯不同，將onChange 放在呼叫層提供客製化
    setForm({
      ...form,
      [attr]: e.target.value,
    });
    if (attr === "account") checkAccount(attr, e);
    if (attr === "password" || attr === "confirmPassword") checkPassword();
    if (attr === "name") checkName(attr, e);
  };
  const isValid = (node) => {
    node.classList.remove("is-invalid");
    node.classList.add("is-valid");
  };
  const isInvalid = (node) => {
    node.classList.add("is-invalid");
    node.classList.remove("is-valid");
  };
  const checkAccount = (attr, e) => {
    if (e.target.value.length > 3) isValid(e.target);
    else isInvalid(e.target);
  };
  const checkName = (attr, e) => {
    if (e.target.value.length > 1) isValid(e.target);
    else isInvalid(e.target);
  };
  const checkPassword = () => {
    // 密碼確認不使用state 是因為無法及時映射 ( setState操作為下次更新渲染造成延遲)
    const password = document.querySelector("#password");
    const confirmPassword = document.querySelector("#confirmPassword");
    if (password.value === confirmPassword.value) {
      isValid(password);
      isValid(confirmPassword);
      return true;
    } else {
      isInvalid(password);
      isInvalid(confirmPassword);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { name, account, password, confirmPassword } = form;
    if (
      name.length < 2 ||
      account.length < 4 ||
      password.length < 4 ||
      confirmPassword.length < 4 ||
      !checkPassword()
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
          text: "馬上登入",
          icon: "success",
          timer: 3000,
          confirmButtonText: "登入",
          willClose: () => navigate("/login"),
        });
      } else {
        Swal.fire({
          title: "註冊失敗",
          text: status.message,
          icon: "error",
          confirmButtonText: "關閉",
        });
      }
    } catch (error) {
      console.log("錯誤" + error);
      Swal.fire({
        title: "註冊失敗!",
        text: error.message,
        icon: "error",
      });
    }
  };

  return (
    <AuthPage>
      <AuthContainer>
        <FormContainer handleSubmitExtend={handleSubmit}>
          <AuthTitle>建立您的免費帳戶 </AuthTitle>
          <FormInput
            id="account"
            label="帳號"
            type="text"
            placeholder="請輸入帳號"
            value={form.account}
            onChange={(e) => handleInputOnchange("account", e)}
            invalidPrompt={"至少包含 4 個以上字元"}
            minlength={4}
            maxlength={16}
          ></FormInput>
          <FormInput
            id="password"
            label="密碼"
            type="password"
            placeholder="請輸入密碼"
            value={form.password}
            onChange={(e) => handleInputOnchange("password", e)}
            invalidPrompt={
              form.confirmPassword !== form.password
                ? "密碼不一致"
                : "至少包含四個以上字元"
            }
            minlength={4}
            maxlength={16}
            // confirmCheck={confirmCheck}
          ></FormInput>
          <FormInput
            id="confirmPassword"
            label="確認密碼"
            type="password"
            placeholder="確認密碼"
            value={form.confirmPassword}
            onChange={(e) => handleInputOnchange("confirmPassword", e)}
            invalidPrompt={
              form.confirmPassword !== form.password
                ? "密碼不一致"
                : "至少包含四個以上字元"
            }
            // confirmCheck={confirmCheck}
            minlength={4}
            maxlength={16}
          ></FormInput>
          <FormInput
            id="name"
            label="用戶名稱"
            type="text"
            placeholder="請輸入用戶名稱"
            value={form.name}
            onChange={(e) => handleInputOnchange("name", e)}
            invalidPrompt={"至少包含 1 個以上字元"}
            minlength={2}
            maxlength={16}
          ></FormInput>
          <AuthButton type="submit" onClick={(e) => handleSubmit(e)}>
            註冊
          </AuthButton>
          <AuthLink>
            已經有帳號了? <a href="/login">登入</a>
          </AuthLink>
        </FormContainer>
      </AuthContainer>

      <AuthBanner>大圖片</AuthBanner>
    </AuthPage>
  );
}

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
  margin-top: 120px;
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
