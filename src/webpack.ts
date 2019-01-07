import child_process,{ChildProcess} from "child_process";
import {Log} from "./log";

let webpack:ChildProcess;
/**
 *启动webpack编译  */
export function StartWebpack(onClose:()=>void){
    webpack=child_process.spawn("webpack-dev-server",["--config", "webpack.config.js"]);
    webpack.stdout.on("data",data=>{
        Log(webpack.pid,"webpack",data);
    });
    webpack.stderr.on("data",data=>{
        Log(webpack.pid,"webpack",data,"red");
    });
    webpack.on("close",code=>{
        Log(webpack.pid,"webpack","webpack 退出，代码:"+code,"red");
        if(onClose){
            onClose();
        }
    });
}
/**
 * 停止webpack
 */
export function StopWebpack(){
    if(webpack && !webpack.killed){
        webpack.kill("SIGKILL");
    }
}
