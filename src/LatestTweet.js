import { bind } from 'hyperhtml/esm';

// TODO: bind this.state.lastTweet (or something) to my-last-tweet.tweet-info wsStream.ts after construction
// TODO: convert to TS
class LatestTweet extends HTMLElement {
    static get observedAttributes() {return ['tweet-info']; }

    constructor(...args) {
        super(...args);
        console.log('constructing LatestTweet');
        this.html = bind(this);
    }

    connectedCallback() {
        console.log('tweet-info', this.getAttribute('tweet-info'));
        this.render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log('Attribute', name, ' changed to', newValue);
        if(newValue !== oldValue) {
            //updateStyle(this);
            this.render();
        }
      }

    render() {
        try {
            const {text, username} = JSON.parse(this.getAttribute('tweet-info'));
            return this.html`THIS JUST IN: <a href="#">${text}</a> by ${username}`;
            // render`<a href="${href}">"${state.lastTweet.text}" by ${state.lastTweet.username} ${state.lastTweet.id_str}</a>`;
        } catch(ex) {
            return this.html`<a href="#">THIS JUST IN: _</a>`;
        }
    }
}

customElements.define('latest-tweet', LatestTweet);
// customElements.define(
//     'h-welcome',
//     class HyperWelcome extends HTMLElement {
//       constructor(...args) {
//         super(...args);
//         this.html = hyperHTML.bind(this);
//       }
//       connectedCallback() { this.render(); }
//       render() {
//         return this.html`
//         <h1>Hello, ${this.getAttribute('name')}</h1>`;
//       }
//     }
//   );
  
//   hyperHTML.bind(document.getElementById('root'))`
//     <h-welcome name="Sara"></h-welcome>
//     <h-welcome name="Cahal"></h-welcome>
//     <h-welcome name="Edite"></h-welcome>
//   `;