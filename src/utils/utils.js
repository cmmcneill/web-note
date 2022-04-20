export function getTextNodes(nodeList) {
    let textNodes = [];
    for (let node of nodeList) {
        if (node.nodeType === 3) {
            textNodes.push(node);
        } else if (node.nodeType === 1 && node.tagName === 'BR' && !node.nextSibling && !node.previousSibling) {
            textNodes.push(node.parentNode);
        } else if (node.childNodes.length) {
            textNodes = textNodes.concat(getTextNodes(node.childNodes));
        }
    }
    return textNodes;
}

export function nodeTextLength(node) {
    return node.length ?? 0;
}