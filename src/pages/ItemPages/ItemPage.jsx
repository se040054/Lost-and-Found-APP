import {
  Accordion,
  Button,
  Col,
  Container,
  Image,
  Row,
  Spinner,
} from "react-bootstrap";
import { InfoRow } from "../../components/common/profileStyled";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getItem } from "../../api/items";
import { useParams } from "react-router-dom";
import Header from "../../components/Assists/Header";
import styled from "styled-components";
import {
  defaultAvatar,
  defaultItemPhoto,
  defaultMerchantLogo,
} from "../../assets";

import { FaMapMarkedAlt } from "react-icons/fa";
import { MdOutlineInsertComment } from "react-icons/md";

export default function ItemPage() {
  const [item, setItem] = useState(null);
  const [apiRes, setApiRes] = useState("loading");
  const { isLogin, currentMember } = useAuth();
  const itemId = useParams().id;
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const data = await getItem(itemId);
        if (!data.apiData) {
          setItem(null);
          setApiRes("false");
          return;
        }
        setItem(data.apiData);

        setApiRes("success");
      } catch (error) {
        console.log(error);
        setApiRes("false");
        return error;
      }
    };
    fetchItem();
  }, [itemId]);
  return (
    <>
      <Header />
      <MainContainerStyled>
        {apiRes === "success" && (
          <>
            <InformationContainer
              item={item}
              currentMemberId={currentMember?.id}
            />
            <CommentsContainer comments={item.Comments}></CommentsContainer>
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
  width: 80%;
`;

const InformationContainer = ({ item, currentMemberId }) => {
  function stringToDate(rawData) {
    const splitArray = rawData.split("-");
    return `${splitArray[0]}年${splitArray[1]}月${splitArray[2]}日`;
  }
  return (
    <ItemContainerStyled>
      {/* 商品圖片 */}
      <Container className="m-0 p-0 float-start " style={{ width: "65%" }}>
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
      <Container className="m-0 mb-5 p-5 float-end" style={{ width: "35%" }}>
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
        <InfoRow>
          <h2>{item.category}</h2>
        </InfoRow>
        <InfoRow>
          <FaMapMarkedAlt />
          <p className="p-0 m-0 ms-1">{item.place || "無"}</p>
        </InfoRow>
        <InfoRow>
          <p>拾獲日期：{stringToDate(item.findDate)}</p>
        </InfoRow>
        <InfoRow>
          認領狀態 :
          {item.isClaim ? (
            <p className="p-0 m-0 ms-1 text-success">已認領</p>
          ) : (
            <p className="p-0 m-0 ms-1 text-primary">未認領</p>
          )}
        </InfoRow>
      </Container>
      <Container>
        <InfoRow className="mt-5">
          <p> 物品描述：</p>
        </InfoRow>

        <InfoRow>
          <p>{item.description || "無"}</p>
        </InfoRow>
      </Container>
      {item.userId === currentMemberId && (
        <Container className=" p-5">
          <InfoRow className="d-flex justify-content-center">
            <Button
              className="btn btn-success w-25"
              href={`/items/${item.id}/edit`}
            >
              編輯物品資料
            </Button>
          </InfoRow>
        </Container>
      )}
    </ItemContainerStyled>
  );
};

const CommentsContainer = ({ comments }) => {
  return (
    <CommentsContainerStyled>
      {comments.length === 0 && <h1> 目前沒有留言 ~ </h1>}
      {comments.length > 0 && (
        <>
          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <InfoRow>
                  <p className="p-0 m-0 me-2">查看全部 {comments.length} 則留言</p>
                  <MdOutlineInsertComment />
                </InfoRow>
              </Accordion.Header>
              <Accordion.Body>
                {comments.map((comment) => {
                  return <CommentWrapper comment={comment}></CommentWrapper>;
                })}
              </Accordion.Body>{" "}
            </Accordion.Item>
          </Accordion>
        </>
      )}
    </CommentsContainerStyled>
  );
};

const CommentWrapper = ({ comment }) => {
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
      <Container className="d-flex align-center p-0 my-2">
        {" "}
        {comment.text}
      </Container>
      <hr></hr>
    </Accordion.Body>
  );
};
