<h1 align="center">
  Studio Emojilog
</h1>
<p align="center">
  🌈 A pretty printer for the Studio Log format with emoji ✨
</p>
<p align="center">
  <a href="https://www.npmjs.com/package/@studio/emojilog">
    <img src="https://img.shields.io/npm/v/@studio/emojilog.svg" alt="npm Version">
  </a>
  <a href="https://semver.org">
    <img src="https://img.shields.io/:semver-%E2%9C%93-blue.svg" alt="SemVer">
  </a>
  <a href="https://travis-ci.org/javascript-studio/studio-emojilog">
    <img src="https://img.shields.io/travis/javascript-studio/studio-emojilog/master.svg" alt="Build Status">
  </a>
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/License-MIT-brightgreen.svg" alt="License">
  </a>
</p>

![](https://github.com/javascript-studio/studio-emojilog/raw/master/emojilog.png)

## Features

- A command line tool to pretty print [Studio Log][1] ndjson.
- [Fancy formats][2] with emoji for log file reading pleasure.
- Map stack traces back to original sources with source maps.

## Usage

Assuming you have the following ndjson in a file called `logs.json`:

```json
{"ts":1486630378584,"ns":"Server","topic":"launch","msg":"My Service","data":{"port":433}}
```

Send the logs to the `emojilog` command for pretty printing:

```bash
❯ cat logs.json | emojilog
09:52:58 🚀 Server My Service port=433
```

## Install

```bash
❯ npm i -g @studio/emojilog
```

## CLI Options

- `--format` or `-f` set the formatter to use. Defaults to "fancy".
- `--no-ts` hide timestamps
- `--no-topic` hide topics
- `--no-ns` hide namespaces
- `--no-data` hide data
- `--no-stack` hide stacks
- `--stack message` only show the error message
- `--stack peek` show the message and the first line of the trace (default)
- `--stack full` show the message and the full trace
- `--stack` same as `--stack full`
- `--map` use given source maps file to map stack traces

## Related modules

- 👻 [Studio Log][1] logs ndjson to an output stream.
- 🎩 [Studio Log Format][2] pretty print Studio Log streams.
- ❎ [Studio Log X][3] x-out confidential data in log entries.
- 📦 [Studio Changes][4] is used to create the changelog for this module.

## License

MIT

<div align="center">Made with ❤️ on 🌍</div>

[1]: https://github.com/javascript-studio/studio-log
[2]: https://github.com/javascript-studio/studio-log-format
[3]: https://github.com/javascript-studio/studio-log-x
[4]: https://github.com/javascript-studio/studio-changes
