#!/usr/bin/env node
'use strict';
var nopt = require('nopt');
var path = require('path');
var pkg = require('../package.json');
var project = require('../lib');

var opts = nopt({
  help: Boolean,
  version: Boolean,
  config: path,
  exclude: Array,
  baseUrl: path,
  transitive: Boolean,
  shim: Boolean,
  'exclude-dev': Boolean
}, {
  'base-url': '--baseUrl',
  h: '--help',
  v: '--version',
  c: '--config',
  e: '--exclude',
  b: '--base-url',
  t: '--transitive',
  s: '--shim',
  d: '--exclude-dev'
});

function help() {
  var out = [
    'Usage: bower-requirejs [options]',
    '',
    'General options:',
    '  -h, --help              # Print options and usage',
    '  -v, --version           # Print the version number',
    '  -c, --config            # Path to your RequireJS config file',
    '  -e, --exclude           # Name of a dependency to be excluded from the process',
    '  -b, --base-url          # Path which all dependencies will be relative to',
    '  -t, --transitive        # Process transitive dependencies',
    '  -s, --shim              # Shim dependencies',
    '  -d, --exclude-dev       # Exclude devDependencies',
    ''
  ];

  return out.join('\n');
}

if (opts.version) {
  return console.log(pkg.version);
}

if (opts.help) {
  return console.log(help());
}

project(opts);
