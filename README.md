# Notive

An app to collect and create images.

## Download

Find on the [releases](https://github.com/ant-i-c-s/Notive/releases) page.

## Build
Should be able to build on any machine electron supports (Windows, MacOS, Linux).
```
npm install --production
```
[sqlite3](https://github.com/mapbox/node-sqlite3) needs to be (re-)built for electron. On Windows this requires MSBuildTools 2015.
```
npm rebuild sqlite3 --runtime=electron --target=8.2.1 --dist-url=https://atom.io/download/electron
```
[sharp](https://github.com/lovell/sharp) may also need rebuilding
```
npm run postinstall
```
Finally, build. The output will be in `dist_electron`.
```
npm run electron:build
```

## Develop
```
npm install
```
Follow the instructions above for sqlite and sharp.
```
npm run electron:build
```

## Test
```
npm run test:unit
```
This project tests in a node environment. [sqlite3](https://github.com/mapbox/node-sqlite3) needs to be (re-)built for this environment as well.
```
npm rebuild sqlite3
```