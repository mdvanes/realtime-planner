import { bind } from 'hyperhtml/esm';

// TODO: bind this.state.lastTweet (or something) to my-last-tweet.tweet-info wsStream.ts after construction
// TODO: convert to TS
class LatestTweet extends HTMLElement {
    static get observedAttributes() {return ['tweet-info']; }

    constructor(...args) {
        super(...args);
        // console.log('constructing LatestTweet');
        this.html = bind(this);
    }

    connectedCallback() {
        // console.log('tweet-info', this.getAttribute('tweet-info'));
        this.render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        // console.log('Attribute', name, ' changed to', newValue);
        if(newValue !== oldValue) {
            //updateStyle(this);
            this.render();
        }
      }

    render() {
        try {
            const {text, username, id_str} = JSON.parse(this.getAttribute('tweet-info'));
            // Hyper does not like "partial attributes", e.g. href="https://twitter.com/x/status/${state.lastTweet.id_str}">
            const href = 'https://twitter.com/x/status/'+ id_str;
            return this.html`THIS JUST IN: <a href="${href}">${text}</a> by ${username}`;
        } catch(ex) {
            return this.html`THIS JUST IN: _`;
        }
    }
}

customElements.define('latest-tweet', LatestTweet);