import child_process,{ChildProcess} from "child_process";
import {Log} from "./log";

let npm:ChildProcess=null;
let firstStarted=true;
/**
 *启动typescript编译监控  */
export function StartTSC(option:{onStart:()=>void}){
    npm=child_process.spawn("tsc",["--watch"]);
    npm.stdout.on("data",data=>{
        let str=data.toString();
        //tsc编译结束后再启动nodeserver
        if(str.toLowerCase().indexOf("watching for file changes")!=-1){
            if(option.onStart && firstStarted){
                firstStarted=false;
                option.onStart();
                return;
            }
        }
        log(str);
    });
    npm.stderr.on("data",data=>{
        log(data,true);
    });
    npm.on("close",(code,sig)=>{
        log(`tsc 停止工作，退出代码[${code}],退出信号[${sig}]`,true);
    });
}
/**
 *停止tsc
*/
export function StopTSC(){
    firstStarted=true;
    if(npm && !npm.killed)
        npm.kill("SIGKILL");
}
function log(message:string|Buffer,iserror:boolean=false){
    if(iserror)
        Log(npm.pid,"tsc",message,"red");
    else
        Log(npm.pid,"tsc",message,"green");
}



