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

Develop

* `npm i` and `npm i -g ts-node typescript`
* Run `npm start`
* Also run `node server/`
* Open browser at localhost:9000

./node_modules/.bin/prettier src/\*.ts --write

Develop with firebase

* npm i -g firebase
* `firebase serve --only functions,hosting`

Build

* Run `npm run build`
* Then run `node server/`
* Open browser at localhost:9001

Deploy setup

https://www.youtube.com/watch?v=LOeioOKUKI8

* npm install -g firebase-tools
* firebase init hosting
* public = dist
* SPA = yes

* firebase init functions

Deploy updates

* `firebase deploy`
* See https://realtime-planner.firebaseapp.com/foo

Firebase and Travis CI

https://docs.travis-ci.com/user/deployment/firebase/

Run Prettier on save (in Webstorm)
https://prettier.io/docs/en/webstorm.html > "Using a file watcher"
> Go to File | Settings | Tools | File Watchers for Windows and Linux or WebStorm | Preferences | Tools | File Watchers for OS X and click + to add a new tool. Let’s name it Prettier.
> File Type: JavaScript
> Scope: Current File
> Program set prettier (if you have prettier installed locally, see "Configure External Tool" above)
> Arguments set --write [other opts] $FilePath$
> Working directory set $ProjectFileDir$
> Immediate file synchronization: Uncheck to reformat on Save only (otherwise code will jump around while you type).

Styling: material design lite
https://getmdl.io/


# TODO

Planning

* 23-1 use prettier and TSLint (also for server/), pre-commit hook, test with `pretty-quick` - pretty-quick define target dirs - pre-commit should only be for validate, formatter in the IDE. 
* 23-1 Set up a backend with web sockets
* 23-1 Randomly generate events from a Node back-end that should show real-time updates in the table
* 30-1 Show a table with appointments and the status (in-use, deleted, free, etc)
* 30-1 Try out https://parceljs.org/ and ts-node and sentry.io 
* Replace innerHTML with cloneNode: http://blog.teamtreehouse.com/creating-reusable-markup-with-the-html-template-element
* 30-1 Render the table with RxJS
* 6-2 multiple streams
* combine with redux
* Firebase and hosting
* Try out https://stenciljs.com/

* webpack 4
// TODO edit (bug), lock, twitter streaming API, TypeScript
* bug: add, add, edit (highlighting on the last added row will show again, but should not)
