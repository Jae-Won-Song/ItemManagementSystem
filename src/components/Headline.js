import { Component } from "../core/aro";

export default class Headline extends Component {
    render() {
        this.el.classList.add('nav-top');
        this.el.innerHTML = /* html */ `
        <a href="/#/">재고 관리 시스템</a>
        `
        return this.el
    }
}