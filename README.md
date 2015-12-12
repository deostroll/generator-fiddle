# generator-fiddle [![Build Status](https://secure.travis-ci.org/behrangsa/generator-fiddle.png?branch=master)](https://travis-ci.org/behrangsa/generator-fiddle)

A [Yeoman](http://yeoman.io) generator for creating a local Web fiddling environment.

## Getting Started

First, install [Yeoman](http://yeoman.io) if you haven't already

```bash
$ npm install -g yo
```

Then install `generator-fiddle`:

```bash
$ npm install -g generator-fiddle
```

Now to create a fiddling environment, create a project folder and inside that folder run `yo fiddle`:

```bash
$ mkdir proj
$ cd proj
$ yo fiddle
```

This will create a basic project for you to work on. If you want to fiddle with some jQuery stuff (say), do a bower install:

```bower install jquery --save```

It automatically gets added into your `app/index.html`. So take care if that file has unsaved changes prior to the bower install process.

## `--less` switch to include less

While scaffolding a project include the `--less option` if you want to work with less.

```
yo fiddle --less
```

## License

MIT
