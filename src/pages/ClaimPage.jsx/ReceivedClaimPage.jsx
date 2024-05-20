import {
  Button,
  Card,
  CardGroup,
  Col,
  Container,
  Image,
  Row,
  Spinner,
} from "react-bootstrap";
import Header from "../../components/Assists/Header";
import { useEffect, useState } from "react";
import { getReceivedClaims, getSubmittedClaims } from "../../api/claims";
import styled from "styled-components";
import { defaultAvatar, defaultItemPhoto } from "../../assets";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import {
  MainContainer,
  TitleContainer,
} from "../../components/common/claimStyled";

export default function ReceivedClaimsPage() {
  const { isLogin, currentMember } = useAuth();
  const [pendingClaims, setPendingClaims] = useState([]);
  const [resolvedClaims, setResolvedClaims] = useState([]);
  const [apiRes, setApiRes] = useState("loading");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const data = await getReceivedClaims();
        if (data.status === "success") {
          const tempPendingClaims = [];
          const tempResolvedClaims = [];
          data.apiData.forEach((claim) => {
            console.log(claim.isApproved === null);
            if (claim.isApproved === null) tempPendingClaims.push(claim);
            else tempResolvedClaims.push(claim);
          });
          setPendingClaims(tempPendingClaims);
          setResolvedClaims(tempResolvedClaims);
          setApiRes("success");
        } else {
          setPendingClaims(null);
          setResolvedClaims(null);
          setApiRes("false");
        }
      } catch (error) {
        setPendingClaims(null);
        setResolvedClaims(null);
        setApiRes("false");
        console.log(error);
      }
    };
    if (isLogin === "false") navigate("/login");
    if (isLogin === "success") fetchClaims();
  }, [isLogin, navigate]);
  return (
    <>
      <Header />

      <MainContainer>
        <TitleContainer>
          <h2>我收到的認領</h2>
          <Link className="position-absolute end-0" to="/claims/submitted">
            <Button>查看我送出的認領申請</Button>{" "}
          </Link>
        </TitleContainer>
        <hr className="w-100" />
        {apiRes === "success" && (
          <>
            <>
              <h5> 待處理的申請 </h5>
              {pendingClaims.length > 0 ? (
                <ClaimsContainer claims={pendingClaims}></ClaimsContainer>
              ) : (
                <p>目前沒有申請~</p>
              )}
            </>
            <hr className="w-100" />
            <>
              <h5> 已處理完成的申請 </h5>
              {resolvedClaims.length > 0 ? (
                <ClaimsContainer claims={resolvedClaims}></ClaimsContainer>
              ) : (
                <p>目前沒有申請~</p>
              )}
            </>
          </>
        )}
        {apiRes === "false" && <h1>請稍後再試</h1>}
        {apiRes === "loading " && (
          <Spinner animation="border" variant="success" />
        )}
      </MainContainer>
    </>
  );
}

const ClaimsContainer = ({ claims }) => {
  return (
    <CardGroup>
      <Row xs={1} xl={1}>
        {claims.map((claim) => {
          return (
            <Col key={claim.id}>
              <ClaimWrapper claim={claim}></ClaimWrapper>
            </Col>
          );
        })}
      </Row>
    </CardGroup>
  );
};

const ClaimWrapper = ({ claim }) => {
  const approveText = (state) => {
    if (state === true) return <small className="text-success">認領成功</small>;
    else if (state === false)
      return <small className="text-danger">認領失敗</small>;
    else if (state === null)
      return <small className="text-muted">尚未回應</small>;
  };
  function formatDate(rawDate) {
    // node 時間已經為UTC+8
    const date = new Date(rawDate);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1; // 月份從0開始 要+1
    const day = date.getUTCDate();
    return `${year}年${month}月${day}日`;
  }
  return (
    <Card className="mb-3">
      <Row className="d-flex align-items-center m-0 ps-3 py-2">
        <Card.Title className="p-0 m-0">
          <a href={`/users/${claim.User.id}`}>
            <Image
              src={claim.User.avatar || defaultAvatar}
              alt="avatar"
              style={{
                marginRight: "6px",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
              }}
            />

            <small>{claim.User.name}</small>
          </a>
        </Card.Title>
      </Row>
      <hr className="w-100 m-0 p-0"></hr>
      <Row>
        <Col md={3}>
          <Link to={`/items/${claim.itemId}`}>
            <Card.Img
              variant="none" // 取消圖像的邊角radius
              src={claim.Item.photo || defaultItemPhoto}
              style={{
                width: "100%",
                height: "200px",
                display: "block",
                objectFit: "contain",
                overflow: "hidden",
              }}
            />
          </Link>
        </Col>
        <Col md={3} className="d-flex align-items-center">
          <Link to={`/items/${claim.itemId}`}>
            <Card.Body>
              <Card.Title>{claim?.Item.name}</Card.Title>
            </Card.Body>
          </Link>
        </Col>

        <Col md={3} className="d-flex align-items-center">
          <Card.Body>
            <Card.Title>申請時間：</Card.Title>
            <Card.Text>
              <small className="text-muted">
                {formatDate?.(claim?.createdAt)}
              </small>
            </Card.Text>
          </Card.Body>
        </Col>
        <Col md={3} className="d-flex align-items-center">
          <Card.Body>
            <Card.Title>申請狀態：</Card.Title>
            <Card.Text>{approveText(claim.isApproved)}</Card.Text>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
};
