export function Log(pid:number,flag:string,data:string|Buffer,color:"green"|"red"="green"){
    let str=data.toString().trim();
    let index=str.indexOf("\x1bc");
    if(index!=-1)
        str=str.substring(index+2);
    if(str!=""){
        if(color=="red")
            console.log("\x1b[4m\x1b[31m"+flag+"[PID-"+pid+"]\x1b[0m"+str+"\n");
        if(color=="green")
            console.log("\x1b[4m\x1b[32m"+flag+"[PID-"+pid+"]\x1b[0m"+str+"\n");
    }
}