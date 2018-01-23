# Goal

Test RxJS combined with Web Sockets by setting up a real time planner where appointments can be made. Multiple users
can add/remove/edit appointments and changes should propagate in real time to all users.

To simulate extra users it should be possible to enable random planner activity on the server.


# ES 6 modules test

Run http-server

Native ES6 module work in Chrome > 61 (e.g. Chromium in /codestar-website/node_modules/puppeteer/.local-chromium/linux-515411/chrome-linux/chrome)
It works with two standalone modules (main.js and test.js).
However, RxJS still uses require and that conflicts when loading into the browser.
Therefore still use webpack/typescript.

# Webpack

Run `npm start`
Open browser at localhost:9000


# TODO

Planning

* 23-1 use prettier 
* 23-1 Set up a backend with web sockets
* 23-1 Randomly generate events from a Node back-end that should show real-time updates in the table
* 30-1 Show a table with appointments and the status (in-use, deleted, free, etc)
* 30-1 Try out https://parceljs.org/
* 30-1 Render the table with RxJS
* 6-2 multiple streams 
* combine with redux 
* Firebase and hosting
* Try out https://stenciljs.com/
