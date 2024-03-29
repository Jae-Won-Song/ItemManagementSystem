import { Component } from "../core/aro";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import Detail from "../components/Detail";

// Firebase 구성
const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: "product-mangement-system-a318c.firebaseapp.com",
    databaseURL: "https://product-mangement-system-a318c-default-rtdb.firebaseio.com",
    projectId: "product-mangement-system-a318c",
    storageBucket: "product-mangement-system-a318c.appspot.com",
    messagingSenderId: "762523774803",
    appId: "1:762523774803:web:2d26649ff27d4115793ba6",
    measurementId: "G-YXRZBGBMZ9"
};
const app = initializeApp(firebaseConfig);

export default class TableCol extends Component {
    constructor() {
        super();
        this.data = []; // 사용자 입력을 저장할 배열
        this.database = getDatabase(); // Firebase 데이터베이스 초기화
        this.updateTable();
    }

    render() {
        // 테이블의 첫 번째 행(헤더)을 추가합니다.
        const headers = ["Num", "품명", "발주처", "수량", "유통기한", "이미지"];
        const table = document.createElement("table");
        const thead = document.createElement("thead");
        const tr = document.createElement("tr");

        headers.forEach(headerText => {
            const th = document.createElement("th");
            th.textContent = headerText;
            tr.appendChild(th);
        });

        thead.appendChild(tr);
        table.appendChild(thead);
        this.el.appendChild(table);
        
        // 추가된 데이터 기반 테이블이 생성 될 곳
        this.el.innerHTML += /* html */ `
            <section class="tb-content-wrapper">
                <div class="tb-content">
                    <div id="tableContainer"></div>
                </div>
            </section>
        `;
        return this.el;
    }

    updateTable() {
        const tableContainer = this.el.querySelector("#tableContainer");
        const dbRef = ref(this.database, 'items');
    
        onValue(dbRef, (snapshot) => {
            const data = snapshot.val();
            console.log("Data", data); // 데이터 확인 로그
    
            if (data) {
                const dataArray = Object.keys(data).map(key => ({
                    index: key, // index 값을 key 대신에 사용
                    품명: data[key]["품명"],
                    발주처: data[key]["발주처"],
                    수량: data[key]["수량"],
                    유통기한: data[key]["유통기한"],
                    이미지: data[key]["이미지"]
                }));
    
                this.data = dataArray;
                const mainTable = this.createTable(dataArray);
                tableContainer.innerHTML = '';
                tableContainer.appendChild(mainTable);
    
                // 각 이미지에 클릭 이벤트 추가
                mainTable.querySelectorAll("img").forEach((img, index) => {
                    img.addEventListener("click", () => {
                        // 클릭된 이미지의 데이터를 가져옵니다.
                        const itemData = dataArray[index];
                        // 페이지 이동 로직을 호출합니다.
                        this.navigateToDetailPage(itemData.index); // 아이템의 키 값을 전달
                    });
                });
            } else {
                tableContainer.innerHTML = '<p>데이터가 없습니다.</p>';
            }
        });
    }
    
    navigateToDetailPage(itemKey) {
        // 클릭된 이미지의 키 값을 이용하여 Detail 페이지의 URL을 생성합니다.
        const detailURL = `#/detail?key=${itemKey}`;
        // 생성된 URL로 새 창 또는 새 탭으로 페이지를 엽니다.
        window.open(detailURL, '_blank');
    }
    
    createTable(data) {
        const table = document.createElement("table");
    
        if (data.length === 0) {
            const caption = document.createElement("caption");
            caption.textContent = "항목이 없습니다.";
            table.appendChild(caption);
            return table;
        }
    
        const headers = Object.keys(data[0]);
    
        data.forEach((rowData, index) => {
            const row = document.createElement("tr");
            headers.forEach(header => {
                // key가 'index'인 경우는 표시하지 않음
                if (header !== "index") {
                    const td = document.createElement("td");
                    if (header === "이미지") {
                        const img = document.createElement("img");
                        img.src = rowData[header];
                        img.alt = "이미지";
                        img.style.maxWidth = "100px";
                        img.style.maxHeight = "100px";
                        td.appendChild(img);
                    } else {
                        td.textContent = rowData[header];
                    }
                    row.appendChild(td);
                }
            });
            // 번호를 표시하는 컬럼 추가
            const tdIndex = document.createElement("td");
            tdIndex.textContent = index + 1;
            row.insertBefore(tdIndex, row.firstChild);
    
            table.appendChild(row);
        });
    
        return table;
        
    }
    
}