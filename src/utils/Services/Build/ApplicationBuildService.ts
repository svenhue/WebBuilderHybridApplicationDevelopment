import { StartUp } from "webcontainer/src/StartUp";
import { BuildEnvironment } from "webcontainer/src/Server/server";  
import * as files  from 'localtest/files.json'
export class ApplicationBuildService {
    constructor() {
    }

    

    public async BundleStaticPages(){
        const api = new StartUp();
        const el = document.createElement('iframe');
        el.style.position = 'fixed';
        el.style.width = '400px';
        el.style.height = '400px';
        el.style.top = '0';
        el.style.left = '0';

        document.body.appendChild(el);
       
        const env = new BuildEnvironment();

        const container = await api.Boot();
        console.log(container, files.default)
        env.CreateEnvironment(container, './public', files.default )
       env.InstallDependencies(container, true);

        
    }
}   