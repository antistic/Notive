# Notive

An app to collect and create images.

## Building
```
npm install
```
[sqlite3](https://github.com/mapbox/node-sqlite3) needs to be (re-)built for electron:
```
npm rebuild sqlite3--runtime=electron --target=1.7.6 --dist-url=https://atom.io/download/electron
```
## Testing
```
npm run test:unit
```
This project tests in a node environment. [sqlite3](https://github.com/mapbox/node-sqlite3) needs to be (re-)built for this environment as well.
```
npm rebuild sqlite3
```