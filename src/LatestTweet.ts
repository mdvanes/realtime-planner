import { bind } from 'hyperhtml/esm';
import { Tweet } from './ITweet';

class LatestTweet extends HTMLElement {
    private html: any;

    static get observedAttributes() {return ['tweet-info']; }

    constructor() {
        super();
        // // console.log('constructing LatestTweet');
        this.html = bind(this);
    }

    private connectedCallback() {
        // // console.log('tweet-info', this.getAttribute('tweet-info'));
        this.render();
    }

    private attributeChangedCallback(name, oldValue, newValue) {
        // // console.log('Attribute', name, ' changed to', newValue);
        if (newValue !== oldValue) {
            this.render();
        }
      }

    private render() {
        let source: any = {};
        try {
            source = JSON.parse(this.getAttribute('tweet-info'));
            // // return this.html`<div>THIS JUST IN: <a href="${href}">${text}</a> by ${username}</div>`;
        } catch (ex) {
            // Continue with source as {}
        }
        const {
            text = '',
            username = '',
            id_str = ''
        }: Tweet = source;
        // Hyper does not like "partial attributes", e.g.
        // href="https://twitter.com/x/status/${state.lastTweet.id_str}">
        const href: string = 'https://twitter.com/x/status/' + id_str;
        return this.html`
        <style>
        .tweet-card > .mdl-card__title h2 {
            color: white;
        }
        .tweet-card > .mdl-card__actions {
            display: flex;
            box-sizing:border-box;
            align-items: center;
        }
        .tweet-card > .mdl-card__actions,
        .tweet-card > .mdl-card__actions .mdl-button--colored {
            color: white;
        }
        </style>
        <div class="mdl-card mdl-shadow--2dp tweet-card" style="background-color: rgb(83,109,254);">
            <div class="mdl-card__title mdl-card--expand">
                <h2 class="mdl-card__title-text">
                    ${username}:<br/>
                    ${text}
                </h2>
            </div>
            <div class="mdl-card__actions mdl-card--border">
                <a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" href="${href}">
                Read More
                </a>
                <div class="mdl-layout-spacer"></div>
                <i class="material-icons">comment</i>
            </div>
        </div>`;
    }
}

customElements.define('latest-tweet', LatestTweet);
