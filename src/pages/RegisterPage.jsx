import styled from "styled-components";
import {  useRef } from "react";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import FormContainer from "../components/AuthForm/FormContainer";
import FormInput from "../components/AuthForm/FormInput";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();
  const inputRef = {
    account: useRef(""),
    password: useRef(""),
    confirmPassword: useRef(""),
    name: useRef(""),
  };
  const { login } = useAuth();
  const handleInputOnChange = (attr) => {
    if (attr === "account") checkAccount(inputRef.account.current);
    if (attr === "name") checkName(inputRef.name.current);
    if (attr === "password" || attr === "confirmPassword")
      checkPasswords(
        inputRef.password.current,
        inputRef.confirmPassword.current
      );
  };
  const checkAccount = (node) => {
    if (node.value.length >= 4) isValid(node);
    else isInvalid(node);
  };
  const checkName = (node) => {
    if (node.value.length >= 2) isValid(node);
    else isInvalid(node);
  };
  const checkPasswords = (passwordNode, confirmPasswordNode) => {
    if (
      passwordNode.value === confirmPasswordNode.value &&
      passwordNode.value.length >= 4
    ) {
      isValid(passwordNode);
      isValid(confirmPasswordNode);
    } else {
      isInvalid(passwordNode);
      isInvalid(confirmPasswordNode);
    }
  };

  const isValid = (node) => {
    node.classList.remove("is-invalid");
    node.classList.add("is-valid");
  };
  const isInvalid = (node) => {
    node.classList.remove("is-valid");
    node.classList.add("is-invalid");
  };
  const handleSubmit = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    const form = {
      account: inputRef.account.current.value,
      password: inputRef.password.current.value,
      confirmPassword: inputRef.confirmPassword.current.value,
      name: inputRef.name.current.value,
    };
    if (
      form.name.length < 2 ||
      form.account.length < 4 ||
      form.password.length < 4 ||
      form.confirmPassword.length < 4 ||
      form.password !== form.confirmPassword
    ) {
      Swal.fire({
        title: "表單資訊不完整",
        text: "欄位未填寫完整",
        icon: "question",
      });
      return;
    }

    try {
      const data = await login(form);
      console.log(data);
      if (data.status === "success") {
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
          // 這個是API返回的失敗
          title: "註冊失敗",
          text: data.status.message,
          icon: "error",
          confirmButtonText: "關閉",
        });
        // 因為Provider已經捕捉過異常了 這個資料還是會打進來
        document.querySelector("#account-feedback-invalid").innerText =
          "帳號已被註冊";
        isInvalid(inputRef.account.current);
      }
    } catch (error) {
      // 這個是API或AuthProvider異常的失敗 通常不會進來
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
        <FormContainer>
          <AuthTitle>建立您的免費帳戶</AuthTitle>
          <FormInput
            id="account"
            label="帳號"
            type="text"
            placeholder="請輸入帳號"
            onChange={() => handleInputOnChange("account")}
            useRef={inputRef.account}
            invalidPrompt={"至少包含 4 個以上字元"}
            minlength={4}
            maxlength={16}
          />
          <FormInput
            id="password"
            label="密碼"
            type="password"
            placeholder="請輸入密碼"
            onChange={() => handleInputOnChange("password")}
            useRef={inputRef.password}
            invalidPrompt={
              inputRef.confirmPassword.current.value !==
              inputRef.password.current.value
                ? "密碼不一致"
                : "至少包含四個以上字元"
            }
            minlength={4}
            maxlength={16}
          />
          <FormInput
            id="confirmPassword"
            label="確認密碼"
            type="password"
            placeholder="請輸入確認密碼"
            onChange={() => handleInputOnChange("confirmPassword")}
            useRef={inputRef.confirmPassword}
            invalidPrompt={
              inputRef.confirmPassword.current.value !==
              inputRef.password.current.value
                ? "密碼不一致"
                : "至少包含四個以上字元"
            }
            minlength={4}
            maxlength={16}
          />
          <FormInput
            id="name"
            label="用戶名稱"
            type="text"
            placeholder="請輸入用戶名稱"
            onChange={() => handleInputOnChange("name")}
            useRef={inputRef.name}
            invalidPrompt={"至少包含 2 個以上字元"}
            minlength={2}
            maxlength={16}
          />
          <AuthButton
            type="submit"
            onClick={(e) => {
              handleSubmit(e);
            }}
          >
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
  margin-top: 100px;
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
  &:hover {
    cursor: pointer;
  }
`;

const AuthTitle = styled.div`
  margin-bottom:30px;
  width: 100%;
  text-align: center;
  font-size: 24px;
  font-weight: bold;
`;

const AuthLink = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  text-align: center;
`;
