import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getUser } from "../../api/user";
import Header from "../../components/Assists/Header";
import styled from "styled-components";
import {
  Button,
  Card,
  CardGroup,
  Col,
  Image,
  Row,
  Spinner,
  Tab,
  Tabs,
} from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import { defaultAvatar } from "../../assets";
import { getMyFavorites } from "../../api/favorites";
export default function ProfilePage() {
  const { currentMember } = useAuth();
  const userId = useParams().id;
  const [profile, setProfile] = useState();
  const [res, setRes] = useState("loading"); // api 有三種狀態，未回傳，回傳成功，回傳失敗 ，避免Effect執行前頁面先渲染錯誤結果
  const [favorites, setFavorites] = useState([]);
  useEffect(() => {
    const FetchUserData = async () => {
      try {
        const data = await getUser(userId);
        if (!data.apiData) {
          setProfile(null);
          setRes("false");
          return;
        }
        setProfile(data.apiData);
        setRes("step1"); //加載完個人資料
        console.log(res, "加載完1階段");
      } catch (error) {
        console.log(error);
        setRes("false");
        return error;
      }
    };
    FetchUserData();
  }, [userId]);
  useEffect(() => {
    // 效果要分開使用，因為setRes 在一次渲染只會改變一次 放在一起寫會導致res錯亂
    if (res === "step1") {
      //加載完個人資料後加載收藏
      if (profile?.id === currentMember?.id) {
        try {
          const fetchFavorites = async () => {
            const data = await getMyFavorites();
            setFavorites(data.apiData);
            setRes("success");
            console.log(res, "加載完2階段");
          };

          fetchFavorites();
        } catch (error) {
          console.log(error);
          setFavorites(null);
          setRes("false");
          return error;
        }
      } else {
        setRes("success");
      }
    }
    if (res === "false") {
      console.log(profile, favorites || null);
    }
    console.log(res);
  }, [profile]);
  return (
    <>
      <Header />
      <MainContainerStyled>
        {res === "success" && (
          <>
            <InformationContainer
              profile={profile}
              currentMemberId={currentMember?.id}
            />
            <PropertiesContainer
              profile={profile}
              showFavorite={currentMember?.id === profile?.id}
              favorites={favorites || null}
            />
          </>
        )}
        {res === "false" && <h1>找不到用戶</h1>}
        {res === "loading " && <Spinner animation="border" variant="success" />}
      </MainContainerStyled>
    </>
  );
}

const InformationContainer = ({ profile, currentMemberId }) => {
  return (
    <InformationContainerStyled>
      <Image
        src={profile?.avatar || defaultAvatar}
        roundedCircle
        width="200px"
      />
      <h2 className="mt-5">{profile?.name} </h2>
      <p className="fst-italic ">信箱:{profile?.email || "無"}</p>
      <p className="fst-italic ">電話:{profile?.phone || "無"}</p>
      <p className="fst-italic ">居住地:{profile?.county || "無"}</p>
      {profile?.id === currentMemberId && (
        <Button
          className="btn btn-success w-75"
          href={`/users/${currentMemberId}/edit`}
        >
          編輯資料
        </Button>
      )}
    </InformationContainerStyled>
  );
};

const PropertiesContainer = ({ profile, showFavorite, favorites }) => {
  return (
    <div className="d-flex  flex-column ms-5 w-75">
      <Tabs id="uncontrolled-tab-example" className="mb-3">
        <Tab eventKey="items" title="刊登物品">
          {/* 注意這個Tab不能抽離出Tabs 除非用其他組件 */}
          <ItemsContainer items={profile?.Items}></ItemsContainer>
        </Tab>
        <Tab eventKey="merchants" title="商家列表">
          <MerchantsContainer
            merchants={profile?.Merchants}
          ></MerchantsContainer>
        </Tab>
        {showFavorite && (
          <Tab eventKey="favorites" title="收藏列表">
            {favorites.length < 1 ? (
              <h1>空空如也~ </h1>
            ) : (
              <ItemsContainer items={favorites}></ItemsContainer>
            )}
          </Tab>
        )}
      </Tabs>
    </div>
  );
};

const ItemsContainer = ({ items }) => {
  return (
    <CardGroup>
      {items?.length > 0 && (
        <Row xs={1} sm={2} md={3} lg={4} xl={5}  className="g-2 w-100">
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
          <h1>這個人沒有刊登物品</h1>
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
            height: "160px",
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

const MerchantsContainer = ({ merchants }) => {
  return (
    <CardGroup>
      {merchants?.length > 0 && (
        <Row xs={1} sm={2} md={2} lg={2} xl={2} className="g-4 w-100">
          {merchants.map((merchant) => {
            return (
              <Col key={merchant.id}>
                <MerchantWrapper merchant={merchant}></MerchantWrapper>
              </Col>
            );
          })}
        </Row>
      )}
      {merchants?.length === 0 && (
        <>
          <h1>這個人沒有商家</h1>
        </>
      )}
    </CardGroup>
  );
};

const MerchantWrapper = ({ merchant }) => {
  return (
    <Link to={`/merchants/${merchant.id}`}>
      <Card className="mb-3" style={{ maxWidth: "540px" }}>
        <Row>
          <Col md={6}>
            <Card.Img
              src={merchant.logo}
              className="img-fluid rounded-start"
              alt="..."
            />
          </Col>
          <Col md={6}>
            <Card.Body>
              <Card.Title>{merchant.name}</Card.Title>
              <Card.Text>
                <small className="text-muted">{merchant.address}</small>
              </Card.Text>
            </Card.Body>
          </Col>
        </Row>
      </Card>
    </Link>
  );
};

const MainContainerStyled = styled.div`
  display: flex;
  flex-direction: row;
  align-items: start;
  justify-content: start;
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

  align-items: center;
  @media screen and (max-width: 700px) {
    width: 100%;
    margin-bottom: 20px;
  }
`;
