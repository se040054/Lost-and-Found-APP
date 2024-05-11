import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../../components/Assists/Header";
import styled from "styled-components";
import {
  Button,
  Card,
  CardGroup,
  Col,
  Container,
  Image,
  Row,
  Spinner,
  Tab,
  Tabs,
} from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import { defaultAvatar, defaultMerchantLogo } from "../../assets";
import { getMerchant } from "../../api/merchants";
import { FaPhone, FaPhoneAlt, FaUserCircle } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";

export default function MerchantInfoPage() {
  const { currentMember } = useAuth();
  const merchantId = useParams().id;
  const [info, setInfo] = useState();
  const [res, setRes] = useState("loading"); // api 有三種狀態，未回傳，回傳成功，回傳失敗 ，避免Effect執行前頁面先渲染錯誤結果
  useEffect(() => {
    const fetchMerchant = async () => {
      try {
        const data = await getMerchant(merchantId);
        if (!data.apiData) {
          setInfo(null);
          setRes("false");
          return;
        }
        setInfo(data.apiData);
        console.log("仔入商家" + JSON.stringify(data.apiData.Items));
        setRes("success"); //加載完商家資料
      } catch (error) {
        console.log(error);
        setRes("false");
        return error;
      }
    };
    fetchMerchant();
  }, [merchantId]);
  return (
    <>
      <Header />
      <MainContainerStyled>
        {res === "success" && (
          <>
            <InformationContainer
              info={info}
              currentMemberId={currentMember?.id}
            />
            <PropertiesContainer items={info.Items} />
          </>
        )}
        {res === "false" && <h1>此商家不存在</h1>}
        {res === "loading " && <Spinner animation="border" variant="success" />}
      </MainContainerStyled>
    </>
  );
}

const InformationContainer = ({ info, currentMemberId }) => {
  return (
    <InformationContainerStyled>
      <Container fluid className="my-2 my-0 p-0 w-100 h-100">
        <Image
          src={info?.logo || defaultMerchantLogo}
          thumbnail
          // 注意這裡如果用react 屬性設置寬高會導致大小不一
          style={{
            border: "1px solid gray",
            objectFit: "contain",
            width: "240px",
            height: "240px",
          }}
        />
      </Container>
      <Container fluid className="my-2 my-0 p-0">
        <InfoRow>
          <h2>{info?.name}</h2>
        </InfoRow>
        <InfoRow>
          <FaUserCircle />
          <Link to={`/users/${info.userId}`}>
            <p className="text-primary fw-bolder p-0 m-0 ms-1">
              {info?.User.name}
            </p>
          </Link>
        </InfoRow>
        <InfoRow>
          <FaPhoneAlt />
          <p className="fst-italic p-0 m-0 ms-1">{info.phone}</p>
        </InfoRow>
        <InfoRow>
          <IoLocationSharp />
          <p className="fst-italic p-0 m-0 ms-1">{info.address}</p>
        </InfoRow>
      </Container>
      {info.userId === currentMemberId && (
        <Button
          className="btn btn-success w-75"
          href={`/merchants/${info.id}/edit`}
        >
          編輯商家資料
        </Button>
      )}
    </InformationContainerStyled>
  );
};

const PropertiesContainer = ({ items }) => {
  return (
    <div className="d-flex  flex-column ms-5 w-75">
      <Tabs id="uncontrolled-tab-example" className="mb-3">
        <Tab eventKey="items" title="刊登物品">
          {/* 注意這個Tab不能抽離出Tabs 除非用其他組件 */}
          <ItemsContainer items={items}></ItemsContainer>
        </Tab>
      </Tabs>
    </div>
  );
};

const ItemsContainer = ({ items }) => {
  return (
    <CardGroup>
      {items?.length > 0 && (
        <Row xs={1} sm={2} md={3} lg={4} xl={4} className="g-2 w-75">
          {items.map((item) => {
            return (
              <Col key={item.id}>
                <ItemWrapper item={item}></ItemWrapper>
              </Col>
            );
          })}
        </Row>
      )}
      {items?.length === 0 && (
        <>
          <h1>這個商家沒有刊登物品</h1>
        </>
      )}
    </CardGroup>
  );
};

const ItemWrapper = ({ item }) => {
  return (
    <Link to={`/items/${item.id}`}>
      <Card className="mb-3" style={{ maxWidth: "540px" }}>
        <Card.Img
          src={item.photo}
          alt="item-photo"
          style={{
            width: "auto",
            height: "200px",
            objectFit: "cover",
          }}
        />
        <Card.Body>
          <Card.Title>{item.name}</Card.Title>
          <Card.Text>
            <small className="text-muted">{item.place}</small>
          </Card.Text>
        </Card.Body>
      </Card>
    </Link>
  );
};

const MainContainerStyled = styled.div`
  display: flex;
  flex-direction: row;
  align-items: start;
  justify-content: center;
  margin: 120px auto;
  width: 80%;
  @media screen and (max-width: 700px) {
    flex-direction: column;
    width: 90%;
  }
`;

const InformationContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  width: 25%;
  align-items: start;
  @media screen and (max-width: 700px) {
    width: 100%;
    margin-bottom: 20px;
  }
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin: 15px 0;
`;
