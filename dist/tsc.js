"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = __importDefault(require("child_process"));
const log_1 = require("./log");
let npm = null;
let firstStarted = true;
/**
 *启动typescript编译监控  */
function StartTSC(option) {
    npm = child_process_1.default.spawn("tsc", ["--watch"]);
    npm.stdout.on("data", data => {
        let str = data.toString();
        //tsc编译结束后再启动nodeserver
        if (str.toLowerCase().indexOf("watching for file changes") != -1) {
            if (option.onStart && firstStarted) {
                firstStarted = false;
                option.onStart();
                return;
            }
        }
        log(str);
    });
    npm.stderr.on("data", data => {
        log(data, true);
    });
    npm.on("close", (code, sig) => {
        log(`tsc 停止工作，退出代码[${code}],退出信号[${sig}]`, true);
    });
}
exports.StartTSC = StartTSC;
/**
 *停止tsc
*/
function StopTSC() {
    firstStarted = true;
    if (npm && !npm.killed)
        npm.kill("SIGKILL");
}
exports.StopTSC = StopTSC;
function log(message, iserror = false) {
    if (iserror)
        log_1.Log(npm.pid, "tsc", message, "red");
    else
        log_1.Log(npm.pid, "tsc", message, "green");
}
//# sourceMappingURL=tsc.js.map