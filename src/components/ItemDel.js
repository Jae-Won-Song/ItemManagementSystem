import { Component } from "../core/aro";
import Headline from "./Headline";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, remove } from "firebase/database";

// Firebase 설정
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

export default class ItemDel extends Component {
    constructor() {
        super();
        this.data = []; // 사용자 입력을 저장할 배열
        this.database = getDatabase(); // Firebase 데이터베이스 초기화
        this.updateTable();
    }

    render() {
        const headlineComponent = new Headline();
        const headlineElement = headlineComponent.render();
        this.el.appendChild(headlineElement);

        // 추가된 데이터 기반 테이블이 생성 될 곳
        this.el.innerHTML += /* html */ `
            <section class="tb-content-wrapper">
                <div class="tb-content">
                    <div id="tableContainer"></div>
                </div>
            </section>
        `;

        // 삭제 버튼 추가
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "선택된 항목 삭제";
        deleteButton.addEventListener("click", () => {
            this.deleteCheckedItems();
        });
        this.el.appendChild(deleteButton);

        return this.el;
    }

    updateTable() {
        const tableContainer = this.el.querySelector("#tableContainer");
        const dbRef = ref(this.database, 'items');

        onValue(dbRef, (snapshot) => {
            const data = snapshot.val();

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
            } else {
                tableContainer.innerHTML = '<p>데이터가 없습니다.</p>';
            }
        });
    }

    createTable(data) {
        const table = document.createElement("table");

        if (data.length === 0) {
            const caption = document.createElement("caption");
            caption.textContent = "항목이 없습니다.";
            table.appendChild(caption);
            return table;
        }

        const headers = ["삭제", "품명", "수량", "유통기한", "발주처", "이미지"];

        // 헤더 행 추가
        const headerRow = document.createElement("tr");
        headers.forEach(headerText => {
            const th = document.createElement("th");
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        // 각 데이터 행 추가
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
                    } else if (header === "삭제") { // 삭제 버튼 생성
                        const checkbox = document.createElement("input");
                        checkbox.type = "checkbox";
                        checkbox.className = "delete-checkbox";
                        checkbox.dataset.key = rowData["index"];
                        td.appendChild(checkbox);
                    } else {
                        td.textContent = rowData[header];
                    }
                    row.appendChild(td);
                }
            });

            table.appendChild(row);
        });

        return table;
    }

    // 체크된 항목 삭제
    deleteCheckedItems() {
        const checkedCheckboxes = this.el.querySelectorAll(".delete-checkbox:checked");
        checkedCheckboxes.forEach(checkbox => {
            const itemKey = checkbox.dataset.key;
            this.deleteItem(itemKey);
        });
    }

    // Firebase에서 아이템 삭제
    deleteItem(itemKey) {
        const itemRef = ref(this.database, `items/${itemKey}`);
        remove(itemRef)
            .then(() => {
                console.log("Item successfully deleted!");
            })
            .catch((error) => {
                console.error("Error removing item: ", error);
            });
    }
}
