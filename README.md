
[![JQEGaHJ.md.jpg](https://iili.io/JQEGaHJ.md.jpg)](https://freeimage.host/i/JQEGaHJ)
- - -
## 🔗‍線上網站

[前往線上網站](https://se040054.github.io/lost-and-found-app-deploy/home)


* 若在網頁使用中出現訊號不佳或連線中斷情形導致跳出錯誤訊息，請登出後清除cookie及瀏覽紀錄後重新登入，否則資料可能無法正確顯示或操作失效

## 🌟網站介紹

一個架構類似於電商的小型網站 

為提供使用者刊登與協尋遺失物品

並且可對物品提出認領

主要使用套件、框架、工具：

前端：React、Bootstrap 

後端：Express、Sequelize

資料庫：MySQL




## 📷網站畫面

登入畫面

[![登入畫面](https://iili.io/JQ1X0cF.md.jpg)](https://freeimage.host/i/JQ1X0cF)

首頁

[![首頁](https://iili.io/JQ1X18g.md.jpg)](https://freeimage.host/i/JQ1X18g)




## 📌網站功能

大部分的功能需要登入後才能使用，進入網站前建議登入。

- 使用者： 

    - 註冊會員
    - 登入會員
    - 使用Google帳戶登入
        >>>(需允許彈出視窗，會擷取使用者的名稱，照片，信箱)
    - 使用者資料總覽
    - 編輯使用者資訊
    - 修改密碼
    - 刊登物品
    - 創建商家
        >>>(一個人只能五個)
    - 查看自己的收藏
        >>>(不能看其他使用者的)

>為了增加物品的遺失詳細情形與方便辨認位置，提供使用者新增商家資訊。

- 商家：

    - 創建商家
    - 商家資訊總覽
    - 創建者可以編輯商家資訊
    - 創建者可以刪除商家

- 物品：

    - 物品資訊總覽
    - 刊登者編輯物品資訊
    - 刊登者可以刪除物品
    - 提出認領申請
    - 收藏／取消收藏物品
    - 對物品留言
    - 刪除自己的留言

- 認領：
    - 查看申請的認領列表
    - 若申請未回應，可以取消申請
    - 查看收到的認領申請列表
    - 對未回應的申請提交批准或拒絕
        >>>(若批准申請，則自動回絕其他對相同物品的申請)

- 其他功能:
    - 導覽小工具
    - 返回首頁 
    - 返回頂端
    - 返回上一頁
    - 除了首頁以外的地方，顯示返回首頁
    - 切換暗黑模式 
    [![JQ16yzB.md.gif](https://iili.io/JQ16yzB.gif)](切換)
    

## 本地使用

此應用須配合API使用:

```bash
　Fork 專案

  $ git clone https://github.com/se040054/Lost-and-Found-APP
  
  切換目錄
  $ cd lost-and-found-app 

　安裝套件
  $ npm install 

　啟動專案
  $ npm start

  如果遇到錯誤，嘗試清理緩存：
  $ npm cache clean --force

　停止執行
　Ctrl + C

```


    
## 主要使用套件

- axios
- bootstrap
- react
- react-bootstrap
- styled-components
- sweetalert2
- @react-oauth/google

