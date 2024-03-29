import { Component } from "../core/aro";
import Headline from "./Headline";
import { getDatabase, ref, push } from "firebase/database";

export default class ItemAdd extends Component {
    constructor() {
        super();
        this.data = []; // 사용자 입력을 저장할 배열
        // Firebase 데이터베이스 초기화
        this.database = getDatabase();

    }
    render() {
        const headlineComponent = new Headline();
        const headlineElement = headlineComponent.render();

        this.el.appendChild(headlineElement);
        this.el.classList.add('add-form');
        
                this.el.innerHTML += /* html */ `
                    <section>
                        <div class="add-tb-content">
                            <div>
                                <label for="name"></label>
                                <input type="text" id="name" placeholder="품명">
                                <label for="company"></label>
                                <input type="text" id="company" placeholder="발주처">
                                <label for="count"></label>
                                <input type="number" id="count" placeholder="수량">
                                <label for="date"></label>
                                <input type="date" id="date">
                                <label for="img"></label>
                                <input type="file" accept=".img, .jpg, .png" class="add-img" id="img">
                                <button id="addRow">추가</button>
                            </div>
                        </div>
                    </section>
                `;
                this.initializeEvents();
                return this.el;
            }
        
            initializeEvents() {
                const self = this;
        
                // 사용자 입력을 기반으로 데이터 추가
                this.el.querySelector("#addRow").addEventListener("click", () => {
                    const name = self.el.querySelector("#name").value;
                    const count = self.el.querySelector("#count").value;
                    const date = self.el.querySelector("#date").value;
                    const company = self.el.querySelector("#company").value;
                    const img = self.el.querySelector("#img").files[0]; // 이미지 파일 객체를 가져옵니다.
        
                    if (name && count && date && company && img) {
                        const reader = new FileReader();
                        reader.onload = event => {
                            const imgData = event.target.result;
                            const newRow = { 
                                "품명": name, 
                                "수량": count, 
                                "유통기한": date, 
                                "발주처": company, 
                                "이미지": imgData 
                            };
                            // Firebase 데이터베이스에 데이터 추가
                            const dbRef = ref(self.database, 'items');
                            push(dbRef, newRow);
                            // 입력 필드 초기화
                            self.el.querySelector("#name").value = "";
                            self.el.querySelector("#count").value = "";
                            self.el.querySelector("#date").value = "";
                            self.el.querySelector("#company").value = "";
                            self.el.querySelector("#img").value = "";
                        };
                        // 이미지 파일을 읽어 Base64로 변환합니다.
                        reader.readAsDataURL(img);
                    } else {
                        alert("빈 항목이 있습니다.");
                    }
                });
            }
        }
