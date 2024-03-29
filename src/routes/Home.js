import { Component } from "../core/aro";
import Headline from "../components/Headline";
import GlobalBar from "../components/GlobalBar";
import TableCol from "../components/TableCol";

export default class Home extends Component {
    render() {
        const headline = new Headline().el;
        const globalbar = new GlobalBar().el;
        const tablecol = new TableCol();
        
        this.el.classList.add('container');
        this.el.append (
            headline,
            globalbar,
            tablecol.el 
        );
    }
}
