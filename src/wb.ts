import ws from "ws";


let ws_queue:ws[]=[];
const server=new ws.Server({host:"127.0.0.1",path:"/noreact-tool",port:8002});
server.on("connection",(ws,req)=>{
    ws_queue.push(ws);
    ws.on("close",(code,reason)=>{
        let index=ws_queue.indexOf(ws);
        if(index!=-1)
            ws_queue.splice(index,1);
    });
});
export function NotifyClient(){
    ws_queue.forEach(ws=>{
        ws.send("refresh");
    });
}