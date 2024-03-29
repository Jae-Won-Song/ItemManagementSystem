// GlobalBar.js
import { Component } from "../core/aro";

export default class GlobalBar extends Component {
    constructor(onSearch) {
        super();
        this.onSearch = onSearch;
    }

    render() {
        this.el.classList.add('gnb');
        this.el.innerHTML = /* html */ `
            <button class="add-btn"><a href="/#/add"> 물품 추가 </a></button>
            <button class="del-btn"> <a href="/#/del"> 물품 제거 </a></button>
            <input class="search" type="text" onkeyup="filter()" id="searchItem" placeholder='찾고 있는 물품을 입력하세요.'>
        `;
        this.initializeEvents();
        return this.el;
    }
    initializeEvents() {
        const self = this;
        this.el.querySelector(".search").addEventListener("input", function() {
            const searchTerm = this.value.trim();
            self.onSearch(searchTerm);
        });
    }
}


