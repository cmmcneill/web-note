import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class ContextMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            x: 0,
            y: 0,
        };
        this.menuRef = React.createRef();
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
    }

    render() {
        const items = [];
        for (let i = 0; i < this.props.items.length; i++) {
            const item = this.props.items[i];
            items.push(
                <div
                    key={i}
                    className="item"
                    onClick={item.onClick}
                >
                    <FontAwesomeIcon icon={item.icon} className="icon"/>
                    {item.title}
                </div>
            );
        }

        let classes = 'ui-block';
        if (!this.state.show) classes += ' hidden';
        let styles = {
            left: this.state.x,
            top: this.state.y,
        };

        return (
            <div className={classes} onClick={this.close} onContextMenu={this.close}>
                <div ref={this.menuRef} className="dropdown-menu" style={styles}>
                    {items}
                </div>
            </div>
        );
    }

    get trigger() {
        return this.props.trigger.current;
    }

    open(e) {
        if (!this.trigger.contains(e.target)) return;
        this.setState({
            show: true,
            x: e.clientX,
            y: e.clientY,
        });
    }

    close(e) {
        e.stopPropagation();
        e.preventDefault();
        this.setState({ show: false });
    }

    componentDidMount() {
        document.addEventListener('contextmenu', this.open);
    }

    componentDidUpdate() {
        if (!this.state.show) return;
        const elem = this.menuRef.current;
        if (this.state.x + elem.offsetWidth > window.innerWidth) {
            this.setState({ x: this.state.x - elem.offsetWidth - 1 });
        }
        if (this.state.y + elem.offsetHeight > window.innerHeight) {
            this.setState({ y: this.state.y - elem.offsetHeight - 1 });
        }
    }

    componentWillUnmount() {
        document.removeEventListener('contextmenu', this.open);
    }
}