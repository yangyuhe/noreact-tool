"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
let ws_queue = [];
const server = new ws_1.default.Server({ host: "127.0.0.1", path: "/noreact-tool", port: 8002 });
server.on("connection", (ws, req) => {
    ws_queue.push(ws);
    ws.on("close", (code, reason) => {
        let index = ws_queue.indexOf(ws);
        if (index != -1)
            ws_queue.splice(index, 1);
    });
});
function NotifyClient() {
    ws_queue.forEach(ws => {
        ws.send("refresh");
    });
}
exports.NotifyClient = NotifyClient;
//# sourceMappingURL=wb.js.map