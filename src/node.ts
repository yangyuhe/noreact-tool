import child_process,{ChildProcess} from "child_process";
import {Log} from "./log";
import fs from "fs";
import path from "path";

let nodejs:ChildProcess;
/**
 * 启动node server
 */
export function StartNodeServer(){
    if(nodejs)
        return;
    let app=path.resolve(process.cwd(),"dist/start.js");
    // nodejs=child_process.fork(app,[],{silent:true,execArgv:['--debug=5859']});
    nodejs=child_process.fork(app,[],{silent:true});
    nodejs.stdout.on("data",data=>{
        Log(nodejs.pid,"nodejs",data);
    });
    nodejs.stderr.on("data",data=>{
        Log(nodejs.pid,"nodejs",data,"red");
    });
    nodejs.on("close",code=>{
        Log(nodejs.pid,"nodejs","nodejs exit "+code,"red");
        nodejs=null;
    });
    WatchChange();
}
/**
 * 关闭nodejs server
 */
export function StopNodeServer(onClose?:()=>void){
    if(nodejs && !nodejs.killed){
        nodejs.kill("SIGKILL");
        nodejs.on("close",()=>{
            nodejs=null;
            if(onClose)
                onClose();
        });
    }
}
function WatchChange(){
    let root=path.resolve(process.cwd(),"dist");
    fs.watch(root,{recursive:true},(event,filename)=>{
        if(path.extname(filename)==".js"){
            if(nodejs){
                StopNodeServer(()=>{
                    StartNodeServer();
                });
            }else{
                StartNodeServer();
            }
        }
    });
}