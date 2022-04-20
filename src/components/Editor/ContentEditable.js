import React from 'react';
import { getTextNodes, nodeTextLength } from '../../utils/utils';

export default class ContentEditable extends React.Component {
    constructor(props) {
        super(props);
        this.ref = React.createRef();
        this.prevHtml = this.props.html;
        this.selectionChanged = this.selectionChanged.bind(this);
    }

    render() {
        return (
            <div
                className="content"
                contentEditable="true"
                ref={this.ref}
                onInput={(e) => this.handleChange(e)}
                onBlur={(e) => this.handleChange(e)}
                dangerouslySetInnerHTML={{ __html: this.props.html }}
            ></div>
        );
    }

    handleChange(e) {
        const html = e.target.innerHTML;
        if (html !== this.prevHtml) this.props.onChange(html);
        this.prevHtml = html;
    }

    componentDidMount() {
        document.addEventListener('selectionchange', this.selectionChanged);
        if (!this.props.noFocus) this.updateSelection();
    }

    componentWillUnmount() {
        document.removeEventListener('selectionchange', this.selectionChanged);
    }

    shouldComponentUpdate(newProps) {
        return newProps.html !== this.ref.current.innerHTML;
    }

    componentDidUpdate() {
        if (this.props.html !== this.ref.current.innerHTML) {
            this.ref.current.innerHTML = this.props.html;
        }
        if (!this.props.noFocus) this.updateSelection();
    }

    selectionChanged() {
        const sel = document.getSelection();
        if (!sel.rangeCount) return;
        const container = this.ref.current;
        if (!container.contains(sel.anchorNode) || !container.contains(sel.focusNode)) return;
        const textNodes = getTextNodes(container.childNodes);
        let start = 0, end = 0, startFound = false, endFound = false;
        for (let node of textNodes) {
            if (!startFound) {
                if (node === sel.anchorNode) {
                    start += sel.anchorOffset;
                    startFound = true;
                } else {
                    start += nodeTextLength(node) + 1;
                }
            }
            if (!endFound) {
                if (node === sel.focusNode) {
                    end += sel.focusOffset;
                    endFound = true;
                } else {
                    end += nodeTextLength(node) + 1;
                }
            }
            if (startFound && endFound) break;
        }
        this.props.onSelectionChange({ start, end });
    }

    updateSelection() {
        const selection = this.props.selection;
        const textNodes = getTextNodes(this.ref.current.childNodes);
        if (!textNodes.length) {
            this.ref.current.focus();
            return;
        }
        let startNode, endNode;
        let start = selection.start;
        let end = selection.end;
        for (let node of textNodes) {
            let len = nodeTextLength(node);
            if (!startNode) {
                if (start <= len) {
                    startNode = node;
                } else {
                    start -= len + 1;
                }
            }
            if (!endNode) {
                if (end <= len) {
                    endNode = node;
                } else {
                    end -= len + 1;
                }
            }
            if (startNode && endNode) break;
        }
        if (!startNode || !endNode) {
            console.warn(`Unable to set selection (start: ${selection.start}, end: ${selection.end})`);
            this.ref.current.focus();
            return;
        }
        const sel = document.getSelection();
        sel.removeAllRanges();
        const range = new Range();
        range.setStart(startNode, start);
        range.setEnd(startNode, start);
        sel.addRange(range);
        sel.extend(endNode, end);
    }

    focus() {
        this.ref.current.focus();
    }
}