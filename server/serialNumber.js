"use strict";

var exec = require("child_process").exec;

var serialNumber = function (cb, cmdPrefix) {
  var delimiter = ": ";
  var uselessSerials = ["To be filled by O.E.M."];

  var stdoutHandler = function (error, stdout, bypassCache) {
    cb(error, parseResult(stdout));
  };

  var parseResult = function (input) {
    var result = input.slice(input.indexOf(delimiter) + 2).trim();

    var isResultUseless = uselessSerials.some(function (val) {
      return val === result;
    });

    if (isResultUseless) {
      return "";
    }

    return result;
  };

  cmdPrefix = cmdPrefix || "";
  var vals = ["Serial", "UUID"];
  var cmd;

  switch (process.platform) {
    case "win32":
      delimiter = "\r\n";
      vals[0] = "IdentifyingNumber";
      cmd = "wmic csproduct get ";
      break;

    case "darwin":
      cmd = "system_profiler SPHardwareDataType | grep ";
      break;
  }

  if (!cmd)
    return cb(
      new Error("Cannot provide serial number for " + process.platform)
    );

  exec(cmdPrefix + cmd + vals[0], function (error, stdout) {
    if (error || parseResult(stdout).length > 1) {
      stdoutHandler(error, stdout);
    } else {
      exec(cmdPrefix + cmd + vals[1], stdoutHandler);
    }
  });
};

module.exports = exports = serialNumber;

exports.useSudo = function (cb) {
  serialNumber(cb, "sudo ");
};
