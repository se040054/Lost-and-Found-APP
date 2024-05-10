import styled from "styled-components";
import FormContainer from "../../components/Auth/FormContainer";
import FormInput from "../../components/Auth/FormInput";
import { AuthButton, AuthTitle } from "../../components/Auth/AuthPageStyled";
import Header from "../../components/Assists/Header";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import { defaultAvatar } from "../../assets";
import FileInput from "../../components/Auth/ImageInput";
import { rules } from "../../utils/inputRules";
import { editUser } from "../../api/user";
import Swal from "sweetalert2";
import { Button, Container } from "react-bootstrap";
export default function EditProfilePage() {
  const { currentMember, isLogin } = useAuth();
  const [getMember, setGetMember] = useState("loading"); // 避免Effect先檢測
  const userId = useParams().id;
  const navigate = useNavigate();
  useEffect(() => {
    if (isLogin === "false") setGetMember("false");
    if (isLogin === "success") setGetMember("success");
    if (getMember === "success") {
      if (Number(userId) !== Number(currentMember.id)) {
        // 檢測修改對象是否為登入者，注意型別
        navigate(`/users/${currentMember.id}/edit`);
      }
    }
  }, [currentMember, isLogin, userId, getMember,navigate]);

  const inputRef = {
    // input欄位取值+取用節點故使用useRef，並且需要同步密碼與確認密碼並進行同步渲染feedback
    name: useRef(null),
    avatar: useRef(null),
    email: useRef(null),
    phone: useRef(null),
    county: useRef(null),
  };
  const handleInputOnChange = (attr) => {
    if (attr === "name") checkInput(inputRef.name.current, rules.name.regex);
    if (attr === "email") checkInput(inputRef.email.current, rules.email.regex);
    if (attr === "phone") checkInput(inputRef.phone.current, rules.phone.regex);
    if (attr === "county")
      checkInput(inputRef.county.current, rules.county.regex);
  };

  const checkInput = (node, regex) => {
    if (regex.test(node.value)) {
      isValid(node);
      return true;
    } else {
      isInvalid(node);
      return false;
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
      name: inputRef.name.current.value.trim(),
      avatar: inputRef.avatar.current.files[0],
      email: inputRef.email.current.value.trim(),
      phone: inputRef.phone.current.value.trim(),
      county: inputRef.county.current.value.trim(),
    };

    const checkEdit = (form, member) => {
      //如果值沒變 就不送出
      Object.keys(form).forEach((attr) => {
        console.log(form[attr], member[attr]);
        if (form[attr] === member[attr]) form[attr] = null;
      });
    };
    checkEdit(form, currentMember);
    const checkValid = (form, rules) => {
      // 檢查值是否合法
      let validFalse = false;
      Object.keys(form).forEach((attr) => {
        if (form[attr] && attr !== "avatar") {
          // 圖像不檢測
          if (!rules[attr].regex.test(form[attr])) validFalse = true;
        }
      });
      if (validFalse) return false;
      else return true;
    };
    function hasChange(obj) {
      let change = false;
      Object.keys(obj).forEach((key) => {
        if (obj[key]) change = true;
      });
      return change;
    }
    if (checkValid(form, rules) === false) {
      Swal.fire({
        title: "修改失敗!",
        text: "有資料錯誤",
        icon: "error",
        confirmButtonText: "繼續",
      });
      return;
    } else if (!hasChange(form)) {
      Swal.fire({
        title: "未進行修改!",
        text: "資料未變動",
        icon: "info",
        confirmButtonText: "繼續",
      });
      return;
    } else {
      try {
        const data = await editUser({ id: currentMember.id, form });
        console.log("即將送出表單" + data.status, data.apiData);
        // 送出資料後 會收到新的token 要更新payload，網站的header profile等等才會變化
        localStorage.setItem("apiToken", data.apiData.jwtToken);
        Swal.fire({
          title: "修改成功!",
          text: "即將跳轉頁面",
          timer: 3000,
          confirmButtonText: "繼續",
          willClose: navigate(`/users/${userId}`),
        });
      } catch (error) {
        Swal.fire({
          title: "修改失敗!",
          text: error.message,
          icon: "error",
          confirmButtonText: "繼續",
        });
        return error;
      }
    }
  };
  const handleCancel = (e) => {
    e.stopPropagation();
    e.preventDefault();
    navigate(`/users/${userId}`);
  };
  return (
    <>
      <Header></Header>
      <EditContainer>
        {/* 注意這邊很容易因為還沒拿到currentMember導致defaultValue失效 */}
        {getMember === "success" && (
          <FormContainer>
            <AuthTitle>編輯個人資料</AuthTitle>
            <FileInput
              id="avatar"
              defaultImage={currentMember.avatar || defaultAvatar}
              useRef={inputRef.avatar}
            />
            <FormInput
              id="name"
              label="名稱"
              type="text"
              onChange={() => handleInputOnChange("name")}
              invalidPrompt={rules.name.prompt}
              defaultValue={currentMember.name}
              useRef={inputRef.name}
              minlength={rules.name.min}
              maxlength={rules.name.max}
            />
            <FormInput
              id="email"
              label="信箱"
              type="email"
              onChange={() => handleInputOnChange("email")}
              invalidPrompt={rules.email.prompt}
              defaultValue={currentMember.email}
              useRef={inputRef.email}
              minlength={rules.email.min}
              maxlength={rules.email.max}
            />
            <FormInput
              id="phone"
              label="電話"
              type="phone"
              onChange={() => handleInputOnChange("phone")}
              invalidPrompt={rules.phone.prompt}
              defaultValue={currentMember.phone}
              useRef={inputRef.phone}
              minlength={rules.phone.min}
              maxlength={rules.phone.max}
            />
            <FormInput
              id="county"
              label="居住縣市"
              type="county"
              onChange={() => handleInputOnChange("county")}
              invalidPrompt={rules.county.prompt}
              defaultValue={currentMember.county}
              useRef={inputRef.county}
              minlength={rules.county.min}
              maxlength={rules.county.max}
            />
            <Container className="text-center">
              <Link to={`/users/${userId}/editPassword`}>
                <h5 className="btn btn-warning ">我要修改密碼</h5>
              </Link>
            </Container>
            <Container fluid className="d-flex justify-content-between">
              <StyledAuthButton
                className="btn btn-secondary"
                onClick={(e) => handleCancel(e)}
              >
                取消
              </StyledAuthButton>
              <StyledAuthButton
                className="btn-success"
                onClick={(e) => handleSubmit(e)}
              >
                確認送出
              </StyledAuthButton>
            </Container>
          </FormContainer>
        )}
      </EditContainer>
    </>
  );
}

// id,
// label,
// type,
// value,
// placeholder,
// onChange,
// invalidPrompt,
// minlength,
// maxlength,
// useRef,
// needFeedback = true,

const EditContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const StyledAuthButton = styled(Button)`
  display: block;
  margin: 20px 0;
`;
