import { Card, CardGroup, Col, Container, Row, Spinner } from "react-bootstrap";
import Header from "../../components/Assists/Header";
import { useEffect, useState } from "react";
import { getSubmittedClaims } from "../../api/claims";
import styled from "styled-components";
import { defaultItemPhoto } from "../../assets";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const MainContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 80%;
  height: 100%;
  margin: 120px auto;
`;

export default function SubmittedClaimPage() {
  const { isLogin, currentMember } = useAuth();
  const [claims, setClaims] = useState(null);
  const [apiRes, setApiRes] = useState("loading");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const data = await getSubmittedClaims();
        if (data.status === "success") {
          setClaims(data.apiData);
          setApiRes("success");
        } else {
          setClaims(null);
          setApiRes("false");
        }
      } catch (error) {
        setClaims(null);
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
        <h2>送出的認領列表</h2>
        {apiRes === "success" && (
          <ClaimsContainer claims={claims}></ClaimsContainer>
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
    <CardGroup className="w-100">
      {claims?.length > 0 && (
        <Row xs={1} xl={1} className="w-100">
          {claims.map((claim) => {
            return (
              <Col key={claim.id}>
                <ClaimWrapper claim={claim}></ClaimWrapper>
              </Col>
            );
          })}
        </Row>
      )}
      {claims?.length === 0 && (
        <>
          <h4>目前尚未申請過認領</h4>
        </>
      )}
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
      <Row className="gy-5">
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
            <Card.Title>認領時間：</Card.Title>
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
