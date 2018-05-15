import { bind } from 'hyperhtml/esm';

// TODO: bind this.state.lastTweet (or something) to my-last-tweet.tweet-info wsStream.ts after construction
// TODO: convert to TS
class MyLastTweet extends HTMLElement {
    static get observedAttributes() {return ['tweet-info']; }

    constructor(...args) {
        super(...args);
        console.log('constructing MyLastTweet');
        //observedAttributes();
        this.html = bind(this);
    }

    connectedCallback() {
        console.log('tweet-info', this.getAttribute('tweet-info'));
        this.render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log('Custom square element attributes changed.');
        //updateStyle(this);
        this.render();
      }

    render() {
    return this.html`
    <h1>Hello, ${this.getAttribute('tweet-info')}</h1>`;
    }
}

customElements.define('my-last-tweet', MyLastTweet);
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