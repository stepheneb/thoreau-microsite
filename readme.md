**Thoreau microsite**

Repository: https://github.com/stepheneb/thoreau-microsite

Static website: https://stepheneb.github.io/thoreau-microsite/

**Local Development**

1. Make sure that the active long-term-support version of Node.js is installed. If not see options for installing below.
```
$ node -v
v14.18.1
```
2. Clone the repository to your local computer.
3. Open a shell and move to the directory where the repository is cloned.
4. Install the thoreau microsite development dependencies.
```
$ npm install
```
5. Start the development server.
```
$ gulp
[16:01:44] Requiring external module esm
[16:01:46] Using gulpfile ~/dev/00-clients/rlmg/thoreau/thoreau-microsite/gulpfile.esm.js
[16:01:46] Starting 'default'...
[16:01:46] Starting 'build'...
[16:01:46] Finished 'build' after 69 ms
[16:01:46] Starting 'serve'...
[16:01:46] Finished 'serve' after 13 ms
[16:01:46] Starting 'watch'...
[Browsersync] Access URLs:
 --------------------------------------
       Local: http://localhost:3000
    External: http://192.168.1.108:3000
 --------------------------------------
          UI: http://localhost:3001
 UI External: http://localhost:3001
 --------------------------------------
[Browsersync] Serving files from: public
```

This will open a browser window with the thoreau microsite in Chrome at the local url. In this case: http://localhost:3000.

Any changes made to the content, JavaScript, or CSS styling for the project will initiate a rebuild of the project and a browser reload.

You can open the thoreau microsite in multiple different browsers. Any changes to the project will cause all the browser windows to be reloaded.

The site can also be opened from another computer or mobile computer on the same local network using the external url. In this case: http://192.168.1.108:3000


**Node.js is a local development dependency**

Node.js: https://nodejs.dev/

The build tools for the thoreau microsite use the latest active long-term-support (lts) release of Node.js.

```
$ node -v
v14.18.1
```

There are instructions on the Node.js home page describing how to install it.

The instructions for macOS suggest using the Node Version Manager **`nvm`** to install Node.js: https://github.com/nvm-sh/nvm

```
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash
$ nvm install --lts
```

Updating to a newer lts/Fermium version of Node.js and migrate any globally installed npm packagees.

nvm install node --reinstall-packages-from=node
