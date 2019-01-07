#!/usr/bin/env node
import child_process from "child_process";
import path from "path";
import { StartNodeServer, StopNodeServer } from "./node";
import { StartTSC, StopTSC } from "./tsc";
import "./wb";
import { StartWebpack, StopWebpack } from "./webpack";

let rmdir=child_process.spawn("rm",["-rf",path.resolve(process.cwd(),"dist")]);
rmdir.on("close",()=>{
    StartTSC({
        onStart:()=>{
            StartNodeServer();
            StartWebpack(null);
        }
    });  
});

process.on("uncaughtException",err=>{
    console.log("捕获到异常")
    console.log(err);
    clear();
    process.exit(1);
});
process.on("SIGINT",()=>{
    clear();
    process.exit(0);
});

function clear(){
    StopTSC();
    StopNodeServer();
    StopWebpack();
}












