#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = __importDefault(require("child_process"));
const path_1 = __importDefault(require("path"));
const node_1 = require("./node");
const tsc_1 = require("./tsc");
require("./wb");
const webpack_1 = require("./webpack");
let rmdir = child_process_1.default.spawn("rm", ["-rf", path_1.default.resolve(process.cwd(), "dist")]);
rmdir.on("close", () => {
    tsc_1.StartTSC({
        onStart: () => {
            node_1.StartNodeServer();
            webpack_1.StartWebpack(null);
        }
    });
});
process.on("uncaughtException", err => {
    console.log("捕获到异常");
    console.log(err);
    clear();
    process.exit(1);
});
process.on("SIGINT", () => {
    clear();
    process.exit(0);
});
function clear() {
    tsc_1.StopTSC();
    node_1.StopNodeServer();
    webpack_1.StopWebpack();
}
//# sourceMappingURL=main.js.map