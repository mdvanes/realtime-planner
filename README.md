# ES 6 modules test

Run http-server

Native ES6 module work in Chrome > 61 (e.g. Chromium in /codestar-website/node_modules/puppeteer/.local-chromium/linux-515411/chrome-linux/chrome)
It works with two standalone modules (main.js and test.js).
However, RxJS still uses require and that conflicts when loading into the browser.
Therefore still use webpack/typescript.

# Webpack

Run `npm run start`
Open browser at localhost:9000