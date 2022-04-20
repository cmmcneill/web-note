import { getTextNodes, nodeTextLength } from './utils';

export default class Note {
    constructor(data = {}) {
        this.id = data.id || this.generateId();
        this.title = data.title || '';
        this.content = data.content || '';
        this.selection = { start: 0, end: 0 };

        if (data.content) {
            // Set the initial cursor position to the end of the note
            const elem = document.createElement('div');
            elem.innerHTML = this.content;
            const textNodes = getTextNodes(elem.childNodes);
            let lastPos = textNodes.length ? -1 : 0;
            for (let node of textNodes) lastPos += nodeTextLength(node) + 1;
            this.selection = { start: lastPos, end: lastPos };
        }
    }

    generateId() {
        const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_';
        let id = '';
        do {
            id += chars[Math.floor(Math.random() * chars.length)];
        } while (id.length < 8);
        return id;
    }
}