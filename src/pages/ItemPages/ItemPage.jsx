import {
  Accordion,
  Button,
  Col,
  Container,
  Form,
  Image,
  InputGroup,
  Row,
  Spinner,
} from "react-bootstrap";
import { InfoRow } from "../../components/common/profileStyled";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { deleteItem, getItem } from "../../api/items";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Assists/Header";
import styled from "styled-components";
import {
  defaultAvatar,
  defaultItemPhoto,
  defaultMerchantLogo,
} from "../../assets";

import { MdOutlineInsertComment } from "react-icons/md";
import { getCategory } from "../../api/categories";
import Swal from "sweetalert2";
import FavoriteButton, {
  StaticFavoriteButton,
} from "../../components/Assists/FavoriteButton";
import { deleteComment, postComment } from "../../api/comment";

export default function ItemPage() {
  const [item, setItem] = useState(null);
  const [apiRes, setApiRes] = useState("loading");
  const [category, setCategory] = useState([]);
  const { isLogin, currentMember } = useAuth();
  const [post, setPost] = useState("no"); // 這個狀態本身沒有意義，用來在送出留言後抓取Item.Comments
  const navigate = useNavigate();
  const itemId = useParams().id;
  useEffect(() => {
    // 進入頁面時抓取物品跟分類資料的效果
    const fetchData = async () => {
      try {
        const data = await getItem(itemId);
        if (!data.apiData) {
          setItem(null);
          setApiRes("false");
          return;
        }
        const category = await getCategory(data.apiData.categoryId);
        setItem(data.apiData);
        setCategory(category.apiData);
        setApiRes("success");
      } catch (error) {
        console.log(error);
        setApiRes("false");
        return error;
      }
    };
    fetchData();
  }, [itemId]);
  useEffect(() => {
    //用來更新留言後的物品，重新取得留言
    const fetchData = async () => {
      try {
        const data = await getItem(itemId);
        if (!data.apiData) {
          setItem(null);
          setApiRes("false");
          return;
        } else {
          setApiRes("success");
          setItem(data.apiData);
          setPost("no");
        }
      } catch (error) {
        console.log(error);
        setApiRes("false");
        return error;
      }
    };
    fetchData();
  }, [post, itemId]);
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "確定要刪除物品嗎?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "刪除物品",
      confirmButtonColor: "#dc3545",
      cancelButtonText: `取消`,
    });
    if (result.isConfirmed) {
      try {
        const data = await deleteItem(item.id);
        if (data.status === "success") {
          Swal.fire({
            title: "已刪除!",
            text: "跳轉頁面",
            confirmButtonText: "繼續",
            willClose: () => navigate(`/users/${currentMember.id}`),
          });
        } else {
          Swal.fire({
            title: "刪除失敗!",
            icon: "error",
            text: data.message,
            confirmButtonText: "繼續",
          });
        }
      } catch (error) {
        Swal.fire({
          title: "刪除失敗!",
          icon: "error",
          text: error.message,
          confirmButtonText: "繼續",
        });
      }
    }
    if (result.isDenied) return;

    console.log(result);
  };
  return (
    <>
      <Header />
      <MainContainerStyled>
        {apiRes === "success" && (
          <>
            <InformationContainer
              item={item}
              currentMemberId={currentMember?.id}
              category={category}
              handleDelete={handleDelete}
            />
            <CommentsContainer comments={item.Comments} refetch={setPost} />
            <PostComment
              userAvatar={currentMember?.avatar || defaultAvatar}
              navigate={navigate}
              isLogin={isLogin}
              itemId={itemId}
              refetch={setPost}
            />
          </>
        )}
        {apiRes === "false" && <h1>找不到用戶</h1>}
        {apiRes === "loading " && (
          <Spinner animation="border" variant="success" />
        )}
      </MainContainerStyled>
    </>
  );
}
const MainContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 120px auto;
  width: 80%;
  @media screen and (max-width: 700px) {
    flex-direction: column;
    width: 90%;
  }
`;
const ItemContainerStyled = styled.div`
  width: 80%;
`;

const CommentsContainerStyled = styled.div`
  margin-top: 50px;
  width: 80%;
`;

const InformationContainer = ({
  item,
  currentMemberId,
  category,
  handleDelete,
}) => {
  function stringToDate(rawData) {
    const splitArray = rawData.split("-");
    return `${splitArray[0]}年${splitArray[1]}月${splitArray[2]}日`;
  }
  return (
    <ItemContainerStyled>
      {/* 上方區塊 */}
      <Container className="d-flex">
        {/* 商品圖片 */}
        <Container className="m-0 p-0  " style={{ width: "55%" }}>
          <Image
            src={item.photo || defaultItemPhoto}
            thumbnail
            style={{
              border: "1px solid gray",
              objectFit: "contain",
              width: "860px",
              height: "430px",
            }}
          />
        </Container>
        {/* 商品文字 */}
        <Container className="m-0 p-0 ms-5" style={{ width: "40%" }}>
          <InfoRow>
            <h2>{item.name}</h2>
          </InfoRow>
          <InfoRow>
            {item.Merchant ? (
              <a href={`/merchants/${item.Merchant.id}`}>
                <Image
                  src={item.Merchant.logo || defaultMerchantLogo}
                  alt="logo"
                  style={{
                    marginRight: "6px",
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                  }}
                />
                <small>{item.Merchant.name} </small>
              </a>
            ) : (
              <a href={`/users/${item.User.id}`}>
                <Image
                  src={item.User.avatar || defaultAvatar}
                  alt="avatar"
                  style={{
                    marginRight: "6px",
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                  }}
                />

                <small>{item.User.name}</small>
              </a>
            )}{" "}
          </InfoRow>
          <Row>
            <InfoRow>
              <Col md={5}>分類：</Col>
              <Col md={7}>{category?.name || "無"}</Col>
            </InfoRow>
          </Row>
          <Row>
            <InfoRow>
              <Col md={5}>拾獲地點:</Col>
              <Col md={7}>{item.place || "無"}</Col>
            </InfoRow>
          </Row>
          <Row>
            <InfoRow>
              <Col md={5}>拾獲日期：</Col>
              <Col md={7}>{stringToDate(item.findDate)}</Col>
            </InfoRow>
          </Row>
          <Row>
            <InfoRow>
              <Col md={5}>認領狀態 :</Col>
              <Col md={7}>
                {item.isClaim ? (
                  <p className="text-success m-0 p-0 ">已認領</p>
                ) : (
                  <p className="text-primary m-0 p-0 ">未認領</p>
                )}
              </Col>
            </InfoRow>
          </Row>
          <Row>
            <InfoRow>
              <Col md={5}>收藏：</Col>
              <Col md={7}>
                <StaticFavoriteButton itemId={item.id} />
              </Col>
            </InfoRow>
          </Row>
        </Container>
      </Container>
      {/* 下方描述 */}
      <Container>
        <InfoRow>
          <p> 物品描述：</p>
        </InfoRow>

        <InfoRow>
          <p>{item.description || "無"}</p>
        </InfoRow>
      </Container>{" "}
      {/*編輯按鈕 */}
      {item.userId === currentMemberId && (
        <Container className="d-flex mt-5 justify-content-between">
          <Button className="btn btn-success" href={`/items/${item.id}/edit`}>
            編輯物品資料
          </Button>
          <Button className="btn btn-danger" onClick={(e) => handleDelete?.()}>
            刪除物品
          </Button>
        </Container>
      )}
    </ItemContainerStyled>
  );
};

const CommentsContainer = ({ comments, refetch }) => {
  return (
    <CommentsContainerStyled>
      <hr />
      {comments.length === 0 && <h1> 目前沒有留言 ~ </h1>}
      {comments.length > 0 && (
        <>
          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <InfoRow>
                  <p className="p-0 m-0 me-2">
                    查看全部 {comments.length} 則留言
                  </p>
                  <MdOutlineInsertComment />
                </InfoRow>
              </Accordion.Header>
              <Accordion.Body>
                {comments.map((comment) => {
                  return (
                    <CommentWrapper
                      refetch={refetch}
                      comment={comment}
                    ></CommentWrapper>
                  );
                })}
              </Accordion.Body>{" "}
            </Accordion.Item>
          </Accordion>
        </>
      )}
    </CommentsContainerStyled>
  );
};

const CommentWrapper = ({ comment, refetch }) => {
  // 因為需要多層傳遞 改再子曾直接取用auth
  const { currentMember } = useAuth();
  const Toast = Swal.mixin({
    toast: true,
    position: "bottom",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });
  const handleClick = async (commentId) => {
    const result = await Swal.fire({
      title: "確定刪除留言?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "刪除",
      cancelButtonText: "取消",
    });
    if (result.isConfirmed) deletePost(commentId);
    else return;
  };
  const deletePost = async (commentId) => {
    try {
      const data = await deleteComment(commentId);
      if (data.status === "success") {
        Toast.fire({
          icon: "success",
          title: "已刪除留言",
        });
        refetch("yes");
      } else {
        Toast.fire({
          icon: "error",
          title: "刪除失敗",
        });
      }
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: `刪除失敗: ${error.message}`,
      });
    }
  };
  return (
    <Accordion.Body>
      <Container className="d-flex align-center p-0 m-0">
        <a href={`/users/${comment.userId}`}>
          <Image
            src={comment.User.avatar || defaultAvatar}
            alt="avatar"
            style={{
              marginRight: "4px",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              border: "1px solid gray",
            }}
          />{" "}
        </a>
        <a href={`/users/${comment.userId}`}>
          <h5 className="font-weight-bold h5-0 m-0">{comment.User.name}：</h5>
        </a>
      </Container>
      <Container className="d-flex align-items-center justify-content-between p-0 my-2">
        {comment.text}

        {currentMember?.id === comment.userId && (
          <Button
            className="btn-danger m-0 py-1 px-2"
            onClick={() => handleClick?.(comment.id)}
          >
            刪除
          </Button>
        )}
      </Container>

      <hr></hr>
    </Accordion.Body>
  );
};

const PostComment = ({ isLogin, itemId, navigate, userAvatar, refetch }) => {
  const [comment, setComment] = useState("");
  const Toast = Swal.mixin({
    toast: true,
    position: "bottom",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });
  const handleKeyDown = async (e) => {
    console.log(e.key);
    if (e.key === "Enter") {
      await submitComment(e);
    } else {
      return;
    }
  };
  const submitComment = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (e.target.value.length === 0) {
      Toast.fire({
        icon: "warning",
        title: "未填寫留言",
      });
    }
    try {
      const data = await postComment({ itemId, text: comment });
      if (data.status === "success") {
        Toast.fire({
          icon: "success",
          title: "留言成功",
        });
        setComment(""); // 清空留言
        refetch?.("yes"); //這個狀態更新本身沒有意義，用來在送出留言後更新Item.Comments
      } else {
        Toast.fire({
          icon: "error",
          title: "留言失敗",
        });
      }
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: `留言失敗: ${error.message}`,
      });
    }
  };
  const handleClick = async () => {
    if (isLogin !== "success") {
      const result = await Swal.fire({
        title: "尚未登入!",
        text: "登入後可使用留言功能，要馬上登入嗎?",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "登入",
        cancelButtonText: "取消",
      });
      if (result.isConfirmed) navigate("/login");
      if (result.isDenied) return;
    } else {
      return;
    }
  };
  return (
    <>
      <Container className="w-0 p-0 mt-3" style={{ width: "80%" }}>
        <InputGroup>
          <InputGroup.Text id="basic-addon1">
            <Image
              src={userAvatar}
              alt="logo"
              style={{
                marginRight: "6px",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
              }}
            />
          </InputGroup.Text>

          <Form.Control
            type="text"
            placeholder="說點什麼吧"
            value={comment}
            onChange={(e) => setComment?.(e.target.value)}
            onKeyDown={(e) => handleKeyDown?.(e)}
            onClick={() => handleClick?.()}
          />
        </InputGroup>
      </Container>
    </>
  );
};
