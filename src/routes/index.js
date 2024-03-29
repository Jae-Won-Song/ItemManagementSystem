import { createRouter } from "../core/aro";
import Home from './Home'
import ItemAdd from "../components/ItemAdd";
import ItemDel from "../components/ItemDel";
import Detail from '../components/Detail'


export default createRouter([
    { path: '#/', component: Home },
    { path: '#/add', component: ItemAdd },
    { path: '#/del', component: ItemDel },
    { path: '#/detail', component: Detail }
])