import { Component } from "../core/aro";
import { getDatabase, ref, onValue } from "firebase/database";

export default class Detail extends Component {
    constructor() {
        super();
        this.database = getDatabase(); // Firebase 데이터베이스 초기화
        this.itemData = {}; // 데이터 초기화
        const queryParams = new URLSearchParams(window.location.search);
        const itemKey = queryParams.get('key'); // URL에서 키 값 가져오기

        // 키 값으로 데이터베이스에서 데이터 가져오기
        const dbRef = ref(this.database, `items/${itemKey}`);
        onValue(dbRef, (snapshot) => {
            this.itemData = snapshot.val() || {}; // 데이터가 존재하지 않을 경우 빈 객체 반환
            this.render(); // 데이터가 준비되면 다시 렌더링
        });
    }

    render() {
        // 데이터가 비어 있거나 undefined인 경우에 대비하여 각 속성을 렌더링할 때 확인
        const itemName = this.itemData && this.itemData["품명"] ? this.itemData["품명"] : '';
        const itemCount = this.itemData && this.itemData["수량"] ? this.itemData["수량"] : '';
        const itemExpiration = this.itemData && this.itemData["유통기한"] ? this.itemData["유통기한"] : '';
        const itemSupplier = this.itemData && this.itemData["발주처"] ? this.itemData["발주처"] : '';
        const itemImage = this.itemData && this.itemData["이미지"] ? this.itemData["이미지"] : '';
    
        // 데이터 출력
        this.el.innerHTML = /* html */ `
            <h2>${itemName}</h2>
            <p>수량: ${itemCount}</p>
            <p>유통기한: ${itemExpiration}</p>
            <p>발주처: ${itemSupplier}</p>
            <p>이미지: <img src="${itemImage}" alt="이미지"></p>
            <!-- 추가적인 데이터 출력을 원하면 여기에 추가 -->
        `;
    }
}
