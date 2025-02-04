/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
'use strict';

const bundle = require('./bundle/bundle');
const Config = require('./util/Config');
const dependencies = require('./dependencies/dependencies');
const Promise = require('promise');

const documentedCommands = {
  bundle: bundle,
  dependencies: dependencies,
};

const hiddenCommands = {
  '-h': help,
  '--help': help,
};

/**
 * Programmatic entry point for the cli. This function runs the given
 * command passing it the arguments array.
 */
function run(command, commandArgs) {
  if (!command) {
    return Promise.reject(helpMessage());
  }
  commandArgs = commandArgs || [];

  const commandToExec = documentedCommands[command] || hiddenCommands[command];
  if (!commandToExec) {
    return Promise.reject(helpMessage(command));
  }

  return commandToExec(commandArgs, Config.get());
}

function helpMessage(command) {
  const validCommands = Object
    .keys(documentedCommands)
    .map(c => '"' + c + '"')
    .join(' | ');

  if (command) {
    return 'Unknown command "' + command + '". ' +
      'Available commands: ' + validCommands;
  } else {
    return 'Must specify a command. Available commands: ' +
      validCommands;
  }
}

function help() {
  console.log(helpMessage());
  return Promise.resolve();
}

module.exports = {
  run: run,
  commands: documentedCommands,
};
