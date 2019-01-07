"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = __importDefault(require("child_process"));
const log_1 = require("./log");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
let nodejs;
/**
 * 启动node server
 */
function StartNodeServer() {
    if (nodejs)
        return;
    let app = path_1.default.resolve(process.cwd(), "dist/start.js");
    // nodejs=child_process.fork(app,[],{silent:true,execArgv:['--debug=5859']});
    nodejs = child_process_1.default.fork(app, [], { silent: true });
    nodejs.stdout.on("data", data => {
        log_1.Log(nodejs.pid, "nodejs", data);
    });
    nodejs.stderr.on("data", data => {
        log_1.Log(nodejs.pid, "nodejs", data, "red");
    });
    nodejs.on("close", code => {
        log_1.Log(nodejs.pid, "nodejs", "nodejs exit " + code, "red");
        nodejs = null;
    });
    WatchChange();
}
exports.StartNodeServer = StartNodeServer;
/**
 * 关闭nodejs server
 */
function StopNodeServer(onClose) {
    if (nodejs && !nodejs.killed) {
        nodejs.kill("SIGKILL");
        nodejs.on("close", () => {
            nodejs = null;
            if (onClose)
                onClose();
        });
    }
}
exports.StopNodeServer = StopNodeServer;
function WatchChange() {
    let root = path_1.default.resolve(process.cwd(), "dist");
    fs_1.default.watch(root, { recursive: true }, (event, filename) => {
        if (path_1.default.extname(filename) == ".js") {
            if (nodejs) {
                StopNodeServer(() => {
                    StartNodeServer();
                });
            }
            else {
                StartNodeServer();
            }
        }
    });
}
//# sourceMappingURL=node.js.map