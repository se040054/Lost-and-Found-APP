import styled from "styled-components";
import React from "react";
import HeaderTest from "../components/Assists/HeaderTest";
import { FaSearch, FaFilter } from "react-icons/fa";
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
  Pagination,
} from "react-bootstrap";

import { Link } from "react-router-dom";
import { getCategories } from "../api/categories";

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
  width: 50%;
`;

const BadgesContainerStyled = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  width: 50%;
`;

const HomePage = () => {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState(null); // 分類的格式為string，id+name(1金錢財物)，目前eventKey物件會產生問題
  const [search, setSearch] = useState(null);
  const [items, setItems] = useState([]);
  // 目前構思，由於items物品不直接更動但會受其他組件影響，Effect放置於父元件
  useEffect(() => {
    async function fetchItemsArray() {
      const data = await getItems({
        page,
        category: category?.substring(0, 1),
        search,
      });
      setItems(data.apiData.items);
    }
    fetchItemsArray();
  }, [category, search, page]);
  const cleanSearch = () => {
    setSearch(null);
  };
  const cleanCategory = () => {
    setCategory(null);
  };
  return (
    <>
      {/* 導覽列 */}
      <HeaderTest />
      {/* 主要部分 */}
      <MainContainerStyled>
        {/* 搜尋 */}

        <FilterContainer>
          <InputGroup>
            <CategoryFilter category={category} handleSelect={setCategory} />
            <SearchBar search={search} handleSubmit={setSearch} />
          </InputGroup>
        </FilterContainer>
        {/* 顯示篩選 */}
        {(search || category) && (
          <BadgesContainerStyled>
            <BadgesContainer
              search={search}
              category={category}
              cleanSearch={cleanSearch}
              cleanCategory={cleanCategory}
            ></BadgesContainer>
          </BadgesContainerStyled>
        )}

        {/* 物品 */}
        <ItemsContainer items={items}></ItemsContainer>

        {/* <PaginationContainer page={page} handlePage={setPage}></PaginationContainer> */}
      </MainContainerStyled>

    </>
  );
};

export default HomePage;

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
  const [inputValue, setInputValue] = useState(null); //注意這是輸入欄位變動時更新的數值
  return (
    <>
      <Form.Control
        aria-label=""
        aria-describedby="basic-addon1"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <Button
        className="btn btn-light btn-outline-success pb-2 px-4"
        onClick={() => {
          handleSubmit?.(inputValue);
        }}
      >
        <FaSearch />
      </Button>
    </>
  );
};

const ItemsContainer = ({ items }) => {
  console.log(items.length + "物件");
  return (
    <CardGroup className="mt-5">
      {/* CardGroup會統一掌管卡片大小 */}
      {items.length === 0 ? (
        <h3>沒有符合的項目</h3>
      ) : (
        <Row xs={1} sm={2} md={3} lg={4} xl={4} className="g-4">
          {/* 這些屬性是一rows 在RWD響應下有幾個元素 */}
          {items.map((item) => {
            return (
              <Col key={item.id}>
                <ItemsWrapper item={item}></ItemsWrapper>
              </Col>
            );
          })}
        </Row>
      )}
    </CardGroup>
  );
};

const ItemsWrapper = ({ item }) => {
  return (
    <Link to={`/items/${item.id}`}>
      <Card>
        <Card.Img
          variant="top"
          src={item.photo}
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
        <Card.Footer className="text-end">
          <small className="text-muted ">拾獲日期：{item.findDate}</small>
        </Card.Footer>
      </Card>
    </Link>
  );
};

const BadgesContainer = ({ search, category, cleanSearch, cleanCategory }) => {
  return (
    <div className="d-flex align-items-center mt-4">
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
    </div>
  );
};

const PaginationContainer  =({page , handlePage})=>{
   return (
     <Pagination className="mt-5 mt-5">
       <Pagination.First />
       <Pagination.Prev />
       <Pagination.Item>{1}</Pagination.Item>
       <Pagination.Ellipsis />

       <Pagination.Item>{10}</Pagination.Item>
       <Pagination.Item>{11}</Pagination.Item>
       <Pagination.Item active>{12}</Pagination.Item>
       <Pagination.Item>{13}</Pagination.Item>
       <Pagination.Item disabled>{14}</Pagination.Item>

       <Pagination.Ellipsis />
       <Pagination.Item>{20}</Pagination.Item>
       <Pagination.Next />
       <Pagination.Last />
     </Pagination>
   );
}