import styled from "styled-components";
import { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import FormContainer from "../components/AuthForm/FormContainer";
import FormInput from "../components/AuthForm/FormInput";
import { useNavigate } from "react-router-dom";

export default function RegisterPageTest() {
  const navigate = useNavigate();
  // const defaultForm = {
  //   account: "",
  //   password: "",
  //   confirmPassword: "",
  //   name: "",
  // };

  // const [form, setForm] = useState(defaultForm);
  const inputRef = {
    // 注意inputRef.attr.current 不能在渲染期間訪問
    account: useRef(""),
    password: useRef(""),
    confirmPassword: useRef(""),
    name: useRef(""),
  };
  // Create useRef for each input field

  const { login } = useAuth();

  const handleInputOnChange = (attr) => {
    // setForm({
    //   ...form,
    //   [attr]: e.target.value,
    // });

    // Use refs to handle validation
    console.log(inputRef);
    console.log(inputRef.account);
    console.log(inputRef.account.current);
    console.log(inputRef.account.current.value);
    if (attr === "account") checkAccount(inputRef.account.current);
    if (attr === "name") checkName(inputRef.name.current);
    if (attr === "password" || attr === "confirmPassword")
      checkPasswords(
        inputRef.password.current,
        inputRef.confirmPassword.current
      );
  };

  const checkAccount = (node) => {
    if (node.value.length >= 4) {
      node.classList.remove("is-invalid");
      node.classList.add("is-valid");
    } else {
      node.classList.add("is-invalid");
      node.classList.remove("is-valid");
    }
  };

  const checkName = (node) => {
    if (node.value.length >= 2) {
      node.classList.remove("is-invalid");
      node.classList.add("is-valid");
    } else {
      node.classList.add("is-invalid");
      node.classList.remove("is-valid");
    }
  };

  const checkPasswords = (passwordNode, confirmPasswordNode) => {
    if (
      passwordNode.value === confirmPasswordNode.value &&
      passwordNode.value.length >= 4
    ) {
      passwordNode.classList.remove("is-invalid");
      passwordNode.classList.add("is-valid");
      confirmPasswordNode.classList.remove("is-invalid");
      confirmPasswordNode.classList.add("is-valid");
    } else {
      passwordNode.classList.add("is-invalid");
      passwordNode.classList.remove("is-valid");
      confirmPasswordNode.classList.add("is-invalid");
      confirmPasswordNode.classList.remove("is-valid");
    }
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
    console.log(form);
    // Basic form validation
    if (
      form.name.length < 2 ||
      form.account.length < 4 ||
      form.password.length < 4 ||
      form.confirmPassword.length < 4 ||
      form.password !== form.confirmPassword
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
      console.error("錯誤: ", error);
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
  &:hover {
    cursor: pointer;
  }
`;

const AuthTitle = styled.div`
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
