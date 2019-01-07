"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = __importDefault(require("child_process"));
const log_1 = require("./log");
let webpack;
/**
 *启动webpack编译  */
function StartWebpack(onClose) {
    webpack = child_process_1.default.spawn("webpack-dev-server", ["--config", "webpack.config.js"]);
    webpack.stdout.on("data", data => {
        log_1.Log(webpack.pid, "webpack", data);
    });
    webpack.stderr.on("data", data => {
        log_1.Log(webpack.pid, "webpack", data, "red");
    });
    webpack.on("close", code => {
        log_1.Log(webpack.pid, "webpack", "webpack 退出，代码:" + code, "red");
        if (onClose) {
            onClose();
        }
    });
}
exports.StartWebpack = StartWebpack;
/**
 * 停止webpack
 */
function StopWebpack() {
    if (webpack && !webpack.killed) {
        webpack.kill("SIGKILL");
    }
}
exports.StopWebpack = StopWebpack;
//# sourceMappingURL=webpack.js.map