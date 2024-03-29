import { Component } from './core/aro'

export default class App extends Component {
    render() {
        const routerview = document.createElement('router-view')
        this.el.append(routerview)
    }
}