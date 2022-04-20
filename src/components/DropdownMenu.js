import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class DropdownMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            xAnchor: 'left',
            yAnchor: 'top',
        };
        this.menuRef = React.createRef();
        this.bodyClickHandler = this.bodyClickHandler.bind(this);
    }

    render() {
        const items = [];
        for (let i = 0; i < this.props.items.length; i++) {
            const item = this.props.items[i];
            items.push(
                <div
                    key={i}
                    className="item"
                    onClick={() => this.handleItemClick(item)}
                >
                    <FontAwesomeIcon icon={item.icon} className="icon"/>
                    {item.title}
                </div>
            );
        }

        let classes = 'dropdown-menu';
        if (!this.props.show) classes += ' hidden';
        let styles = {
            [this.state.xAnchor]: '1px',
            [this.state.yAnchor]: '100%'
        };

        return (
            <div ref={this.menuRef} className={classes} style={styles} onClick={(e) => e.stopPropagation()}>
                {items}
            </div>
        );
    }

    get trigger() {
        return this.props.trigger.current;
    }

    handleItemClick(item) {
        if (this.props.onClose) this.props.onClose();
        item.onClick();
    }

    bodyClickHandler(e) {
        if (
            this.props.show
            && this.props.onClose
            && (!this.trigger || !this.trigger.contains(e.target))
        ) {
            this.props.onClose();
        }
    }

    componentDidMount() {
        document.addEventListener('click', this.bodyClickHandler);
    }

    componentDidUpdate() {
        if (!this.props.show) return;
        const menu = this.menuRef.current;
        const rect = menu.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
            this.setState({ xAnchor: 'right' });
        }
        if (rect.bottom > window.innerHeight) {
            this.setState({ yAnchor: 'bottom' });
        }
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.bodyClickHandler);
    }
}