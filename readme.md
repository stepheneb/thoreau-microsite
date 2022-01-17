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



## ffmpeg notes


**Generating `webm` from `mp4` with `ffmpeg`**

Reference: see: https://trac.ffmpeg.org/wiki/Encode/VP9

Equivalent to original quality:
```
$ cd src/media/video/winter-stream/
$ ../../../../bin/mp4-to-webm.sh winter-stream-960x540.mp4
...
$ ls -lh winter-stream-960x540.*
-rw-r--r--  1 stephen  staff    24M Nov 26 18:20 winter-stream-960x540.mp4
-rw-r--r--  1 stephen  staff    21M Nov 29 13:29 winter-stream-960x540.webm
```

Generating webm and mp4 copies **while** limiting the average bit rate:

Average bit rate: 2M
```
$ ../../../../bin/mp4-to-webm.sh winter-stream-960x540.mp4 2M
...
$ ls -lh winter-stream-960x540-2M.*
-rw-r--r--  1 stephen  staff   9.0M Nov 29 15:03 winter-stream-960x540-2M.mp4
-rw-r--r--  1 stephen  staff   8.8M Nov 29 15:02 winter-stream-960x540-2M.webm
```

Average bit rate: 1M
```
$ ../../../../bin/mp4-to-webm.sh winter-stream-960x540.mp4 1M
...
$ ls -lh winter-stream-960x540-1M.*
-rw-r--r--  1 stephen  staff   4.8M Nov 29 15:00 winter-stream-960x540-1M.mp4
-rw-r--r--  1 stephen  staff   4.5M Nov 29 15:00 winter-stream-960x540-1M.webm
```
Working with a smaller portrait clip of the same video.

```
$ ../../../../bin/mp4-to-webm.sh winter-stream-304x540.mp4
$ ../../../../bin/mp4-to-webm.sh winter-stream-304x540.mp4 500k
$ ../../../../bin/mp4-to-webm.sh winter-stream-304x540.mp4 250k
$ ls -lSh winter-stream-304x540*
-rw-r--r--  1 stephen  staff   7.4M Nov 29 15:18 winter-stream-304x540.webm
-rw-r--r--  1 stephen  staff   6.6M Nov 26 18:20 winter-stream-304x540.mp4
-rw-r--r--  1 stephen  staff   2.7M Nov 29 15:14 winter-stream-304x540-500k.mp4
-rw-r--r--  1 stephen  staff   2.4M Nov 29 15:14 winter-stream-304x540-500k.webm
-rw-r--r--  1 stephen  staff   1.6M Nov 29 15:16 winter-stream-304x540-250k.mp4
-rw-r--r--  1 stephen  staff   1.4M Nov 29 15:15 winter-stream-304x540-250k.webm
```

Changing aspect ratio of video to portrait for mobile.

```
<video preload="auto" loop="" autoplay="" muted="" playsinline="" webkit-playsinline="webkit-playsinline" class="svelte-swxx5">
  <source type="video/mp4" src="https://int.nyt.com/data/videotape/finished/2021/07/1626759862/top8_final_1600_v3-1600w.mp4">
  <source type="video/webm" src="https://int.nyt.com/data/videotape/finished/2021/07/1626759862/top8_final_1600_v3-1600w.webm">
</video>


ffmpeg -i winter-stream-960x540.mp4 -vf "crop=ih*9/16:ih" winter-stream-540x304.mp4

$ ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of default=nw=1 winter-stream-540x304.mp4
width=304
height=540


ffmpeg -i winter-stream-960x540.mp4 -vf "crop=ih*9/16:ih" -f null - 2>&1 ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of default=nw=1

ffmpeg -i winter-stream-960x540.mp4 -b:v 1M -crf 30 -c:a libopus -threads 8 -speed 4 -row-mt 1 -y winter-stream-960x540.mp4-1M.mp4
ffmpeg i winter-stream-960x540-2M.mp4 -b:v 2M -crf 30 -c:a libopus -threads 8 -speed 4 -row-mt 1 -y winter-stream-960x540-2M.mp4
```

**Extract first frame from video to use as background image**

```
ffmpeg -i src/media/video/walden-sunset/012315408-sun-sets-over-walden-pond_Edited_Loop_crf_22.mp4 -vf "scale=iw*sar:ih,setsar=1" -vframes 1 src/media/images/spyglass/sun-sets-over-walden-pond.jpg
```
