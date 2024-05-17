import styled, { useTheme } from "styled-components";
import React from "react";
import Header from "../components/Assists/Header";
import { FaSearch, FaFilter } from "react-icons/fa";
import { FiPlusCircle } from "react-icons/fi";
import { getItems } from "../api/items";
import { useEffect, useState } from "react";
import {
  Card,
  CardGroup,
  Col,
  Row,
  Form,
  Button,
  InputGroup,
  Dropdown,
  Badge,
  Spinner,
  Image,
  Container,
} from "react-bootstrap";

import { Link } from "react-router-dom";
import { getCategories } from "../api/categories";
import { PaginationControl } from "react-bootstrap-pagination-control";
import {
  defaultAvatar,
  defaultItemPhoto,
  defaultMerchantLogo,
} from "../assets/";
import { FaRegCommentDots } from "react-icons/fa6";
import { deleteFavorite, getMyFavorites, postFavorite } from "../api/favorites";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { useAuth } from "../context/AuthContext";

const ITEM_AMOUNT_PER_PAGE = 12;

const MainContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  margin: 120px auto;
  width: 80%;
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BadgesContainerStyled = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  width: 50%;
  margin-top: 20px;
`;

const CreateContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  font-size: 1rem;
  align-items: center;
`;

export default function HomePage() {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState(null); // 分類的格式為string，id+name(1金錢財物)，目前eventKey物件會產生問題
  const [search, setSearch] = useState(null);
  const [items, setItems] = useState([]);
  const [favoritesId, setFavoritesId] = useState([]);
  const [totalPage, setTotalPage] = useState(null);
  const [apiRes, setApiRes] = useState("loading");
  const { isLogin } = useAuth();
  // 目前構思，由於items物品不直接更動但會受其他組件影響，Effect放置於父元件
  // const theme = useTheme();
  // console.log("主題" + JSON.stringify(theme));
  useEffect(() => {
    // 當你新增篩選時 page應該要返回第一頁
    setPage(1);
  }, [category, search]); // 注意這裡不追蹤page 以免page頁面被鎖定setPage(1)

  useEffect(() => {
    //當新增篩選或換頁時fetch資料
    const fetchItems = async () => {
      try {
        const ItemData = await getItems({
          page,
          category: category?.substring(0, 1),
          search,
        });
        if (ItemData.apiData.items.length === 0) {
          setApiRes("empty");
          setItems(null);
          return;
        }
        const favoriteData = await getMyFavorites();
        const favoritesId = favoriteData.apiData.map((favorite) => favorite.id);
        setItems(ItemData.apiData.items);
        setTotalPage(ItemData.apiData.totalPage);
        setFavoritesId(favoritesId);
        setApiRes("success");
        console.log("物品" + ItemData.apiData.items);
        console.log("收藏ID" + favoritesId);
      } catch (error) {
        console.log(error);
        setApiRes("false");
      }
    };
    fetchItems();
    if (isLogin === "success") {
      fetchItems();
    }
  }, [category, search, page, isLogin]);

  const cleanSearch = () => {
    setSearch(null);
  };
  const cleanCategory = () => {
    setCategory(null);
  };

  const handleFavorite = (favoriteId) => {
    // 因為收藏可能是短時間頻繁的操作，在確保與後端一致的情況下，不重新fetch
    if (favoritesId.includes(favoriteId)) {
      console.log("移除收藏" + favoriteId);
      setFavoritesId(favoritesId.filter((id) => id !== favoriteId));
    } else {
      console.log("新增收藏" + favoriteId);
      setFavoritesId([...favoritesId, favoriteId]);
    }
  };
  return (
    <>
      {/* 導覽列 */}
      <Header />
      {/* 主要部分 */}
      <MainContainerStyled>
        {/* 搜尋 */}
        <Container fluid>
          <Row>
            <Col className="col-md-5 offset-md-3">
              <FilterContainer>
                <InputGroup>
                  <CategoryFilter
                    category={category}
                    handleSelect={setCategory}
                  />
                  <SearchBar search={search} handleSubmit={setSearch} />
                </InputGroup>
              </FilterContainer>
            </Col>
            <Col className="col-md-3 offset-md-1">
              <CreateContainer>
                <Link to="/items/post">
                  <Button variant="success">
                    <FiPlusCircle className="me-1 mb-1" size="1rem" />
                    刊登物品
                  </Button>
                </Link>
                <Link to="/merchants/post">
                  <Button variant="success">
                    <FiPlusCircle className="me-1 mb-1" size="1rem" />
                    申請商家
                  </Button>
                </Link>
              </CreateContainer>
            </Col>
          </Row>
        </Container>
        {/* 顯示篩選 */}
        {(search || category) && (
          <>
            <BadgesContainer
              search={search}
              category={category}
              cleanSearch={cleanSearch}
              cleanCategory={cleanCategory}
            ></BadgesContainer>
          </>
        )}

        {/* 物品 */}
        <ItemsContainer
          items={items}
          apiRes={apiRes}
          favoritesId={favoritesId}
          handleFavorite={handleFavorite}
        ></ItemsContainer>

        <PaginationContainer
          page={page}
          onPageChange={setPage}
          totalPage={totalPage}
        ></PaginationContainer>
      </MainContainerStyled>
    </>
  );
}

const CategoryFilter = ({ category, handleSelect }) => {
  const [categories, setCategories] = useState([]); // 注意這裡的分類是選單要呈現的分類而非你要操作的分類
  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories();
      setCategories(data.apiData);
    };
    fetchCategories();
  }, [category]);
  // 選單按鈕
  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <Button
      className="btn btn-success pb-2 px-4"
      ref={ref} //記得要給Ref 否則格式會跑掉
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {" "}
      {children}
      <FaFilter ref={ref} style={{ cursor: "pointer", marginLeft: "8px" }} />
    </Button>
  ));
  // 選單本體
  const CustomMenu = React.forwardRef(
    ({ children, style, className, "aria-labelledby": labeledBy }, ref) => {
      const [value, setValue] = useState(""); // 注意 這個value 是給input欄位用的 非選單選擇
      return (
        <div
          ref={ref} // ref僅是用來做版面的定位
          style={style}
          className={className}
          aria-labelledby={labeledBy}
        >
          <Form.Control // 這是搜索器
            autoFocus
            className="mx-3 my-2 w-auto"
            placeholder="Type to filter..."
            onChange={(e) => setValue(e.target.value)} //依據搜尋欄位的值更新state
            value={value}
          />
          <ul className="list-unstyled">
            {React.Children.toArray(children).filter(
              (child) => !value || child.props.children.startsWith(value) // 這在篩選依據欄位輸入的選項
            )}
          </ul>
        </div>
      );
    }
  );

  return (
    <Dropdown
      onSelect={(eKey) => {
        handleSelect?.(eKey);
        console.log(eKey);
      }}
    >
      <Dropdown.Toggle id="dropdown-basic" as={CustomToggle}>
        <span>{category ? category.substring(1) : "篩選類型"}</span>
        {/* substring 是因為第一位為id數字寫進字串(目前eventKey設置為物件會錯誤) */}
      </Dropdown.Toggle>
      <Dropdown.Menu as={CustomMenu} align="end">
        {categories.map((categoryData) => {
          return (
            <Dropdown.Item
              key={categoryData.id}
              eventKey={`${categoryData.id}${categoryData.name}`}
            >
              {categoryData.name}
            </Dropdown.Item>
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
};

const SearchBar = ({ handleSubmit }) => {
  const [inputValue, setInputValue] = useState(""); //注意這是輸入欄位變動時更新的數值
  return (
    <>
      <Form.Control
        aria-label=""
        aria-describedby="basic-addon1"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button // 這邊如果套用react-bootstrap 沒有黑暗模式
        className="btn  btn-outline-success pb-2 px-4"
        onClick={() => {
          handleSubmit?.(inputValue);
        }}
      >
        <FaSearch />
      </button>
    </>
  );
};

const ItemsContainer = ({ items, apiRes, favoritesId, handleFavorite }) => {
  return (
    <CardGroup className="mt-5">
      {/* CardGroup會統一掌管卡片大小 */}
      {apiRes === "empty" && <h3>沒有符合的項目</h3>}
      {apiRes === "loading " && (
        <Spinner animation="border" variant="success" />
      )}
      {apiRes === "success" && (
        <Row xs={1} sm={2} md={3} lg={4} xl={4} className="g-3">
          {/* 這些屬性是一rows 在RWD響應下有幾個元素 */}
          {items.map((item) => {
            return (
              <Col key={item.id}>
                <Container fluid className="position-relative p-0 m-0">
                  <ItemsWrapper item={item}></ItemsWrapper>
                  <FavoriteIcon
                    itemId={item.id}
                    isFavorite={favoritesId.includes(item.id)}
                    handleClick={handleFavorite}
                  ></FavoriteIcon>
                </Container>
              </Col>
            );
          })}
        </Row>
      )}
    </CardGroup>
  );
};

const ItemsWrapper = ({ item }) => {
  function formatDate(rawDate) {
    // node 時間已經為UTC+8
    const date = new Date(rawDate);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1; // 月份從0開始 要+1
    const day = date.getUTCDate();
    return `${year}年${month}月${day}日`;
  }

  function stringToDate(rawData) {
    const splitArray = rawData.split("-");
    return `${splitArray[0]}年${splitArray[1]}月${splitArray[2]}日`;
  }
  return (
    <Card>
      <Card.Header variant="top">
        {/* variant 會讓radius自動適應 */}
        {item.Merchant ? (
          <a href={`/merchants/${item.Merchant.id}`}>
            <Image
              src={item.Merchant.logo || defaultMerchantLogo}
              alt="logo"
              style={{
                marginRight: "6px",
                width: "25px",
                height: "25px",
                borderRadius: "50%",
                zIndex: "2",
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
                width: "25px",
                height: "25px",
                borderRadius: "50%",
                zIndex: "2",
              }}
            />

            <small>{item.User.name}</small>
          </a>
        )}{" "}
        <Card.Text>
          <small className="text-muted ">
            張貼於：{formatDate(item.createdAt)}
          </small>
        </Card.Text>
      </Card.Header>
      <Link to={`/items/${item.id}`}>
        <Card.Img
          variant="none" // 取消圖像的邊角radius
          src={item.photo || defaultItemPhoto}
          style={{
            width: "100%",
            height: "300px",
            display: "block",
            objectFit: "cover",
            overflow: "hidden",
          }}
        />
        <Card.Body>
          <Card.Title>{item.name} </Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            {item.place}
          </Card.Subtitle>
          <Card.Text>
            <small className="text-muted ">
              拾獲日期：{stringToDate(item.findDate)}
            </small>
          </Card.Text>
          <Card.Text
            style={{
              overflow: "hidden",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 3, // 限制文本显示为4行
              height: "90px",
            }}
          >
            {item.description}
          </Card.Text>
        </Card.Body>
        <Card.Footer className="d-flex align-items-center  justify-content-end ">
          <FaRegCommentDots className="me-1" />
          {item.commentAmount}
        </Card.Footer>
      </Link>
    </Card>
  );
};

const FavoriteIcon = ({ itemId, isFavorite, handleClick }) => {
  const handleFavorite = async (itemId) => {
    try {
      if (isFavorite) {
        const data = await deleteFavorite(itemId);
        if (data.status === "success") {
          handleClick?.(itemId);
        }
      } else {
        const data = await postFavorite(itemId);
        if (data.status === "success") {
          handleClick?.(itemId);
        }
      }
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };
  return (
    <>
      {isFavorite ? (
        <MdFavorite
          className="position-absolute m-0 p-1"
          style={{
            top: "10px",
            right: "10px",
            width: "38px",
            height: "38px",
            color: "#e3395b",
            cursor: "pointer",
          }}
          onClick={() => handleFavorite?.(itemId)}
        />
      ) : (
        <MdFavoriteBorder
          className="position-absolute m-0 p-1"
          style={{
            top: "10px",
            right: "10px",
            width: "38px",
            height: "38px",
            color: "#e3395b",
            cursor: "pointer",
          }}
          onClick={() => handleFavorite?.(itemId)}
        />
      )}
    </>
  );
};

const BadgesContainer = ({ search, category, cleanSearch, cleanCategory }) => {
  return (
    <BadgesContainerStyled>
      <h5 className="me-2">搜尋 : </h5>
      {search && (
        <h5>
          <Badge bg="secondary" className="ms-1 me-1">
            {search}
            <button
              type="button"
              size="lg"
              class="btn-close  ms-1"
              aria-label="Close"
              onClick={() => cleanSearch?.()}
            ></button>
          </Badge>
        </h5>
      )}
      {category && (
        <h5>
          <Badge bg="secondary">
            {category.substring(1)}
            <button
              size="lg"
              type="button"
              class="btn-close ms-1"
              aria-label="Close"
              onClick={() => cleanCategory?.()}
            ></button>
          </Badge>
        </h5>
      )}
    </BadgesContainerStyled>
  );
};

const PaginationContainer = ({ page, onPageChange, totalPage }) => {
  return (
    <div className="mt-5">
      <PaginationControl
        page={page} // 當前頁數 把state傳進來
        between={4} // 當前頁數左右要有幾個
        total={totalPage * ITEM_AMOUNT_PER_PAGE} // 總item數量
        limit={ITEM_AMOUNT_PER_PAGE} // 一頁有幾個item
        changePage={(page) => {
          //setPage
          onPageChange(page);
        }}
        last={true}
        ellipsis={2} // 有幾個省略頁
      />
    </div>
  );
};
