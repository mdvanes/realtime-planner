import { bind } from 'hyperhtml/esm';

class LatestTweet extends HTMLElement {
    private html: any;

    static get observedAttributes() {return ['tweet-info']; }

    constructor() {
        super();
        // console.log('constructing LatestTweet');
        this.html = bind(this);
    }

    private connectedCallback() {
        // console.log('tweet-info', this.getAttribute('tweet-info'));
        this.render();
    }

    private attributeChangedCallback(name, oldValue, newValue) {
        // console.log('Attribute', name, ' changed to', newValue);
        if (newValue !== oldValue) {
            this.render();
        }
      }

    private render() {
        try {
            const {text, username, id_str} = JSON.parse(this.getAttribute('tweet-info'));
            // Hyper does not like "partial attributes", e.g.
            // href="https://twitter.com/x/status/${state.lastTweet.id_str}">
            const href = 'https://twitter.com/x/status/' + id_str;
            return this.html`THIS JUST IN: <a href="${href}">${text}</a> by ${username}`;
        } catch (ex) {
            return this.html`THIS JUST IN: _`;
        }
    }
}

customElements.define('latest-tweet', LatestTweet);
