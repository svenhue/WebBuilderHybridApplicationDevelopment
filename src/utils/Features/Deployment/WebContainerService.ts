import { StartUp } from "webcontainer";
import { BuildEnvironment } from "webcontainer";  
import { files }  from './files'
import { Ref, ref } from "vue";
import { Dir } from "./IDirsAndFiles";


export class WebContainerService{

    private readonly _rootDir: string = ''


    public env: BuildEnvironment
    public api: StartUp
    public isReady: Ref<boolean> = ref(false);
    

    public async boot(){

        if(this.api != undefined){
            throw new Error('Already booted')
        }

        const api = new StartUp();


        const env = new BuildEnvironment();

        const container = await api.Boot();

     
        await env.CreateEnvironment(container, './public', files, true )
        
        this.api = api;
        this.env = env;
 
        return container;
    }

    public async startDevServer(){
       
        await this.env.RunCommand(this.api.containerInstance, 'npm', ['run', 'dev']); 
 
        const el = document.getElementById('webcontainerXXX') as HTMLIFrameElement;

        this.api.containerInstance.on('server-ready', (port, url) => {
            el.src  = url;
            console.log('Server ready at', url)
        })
        
    }

    public async Run(){
        await this.env.RunCommand(this.api.containerInstance, 'npm', ['run', 'preview']);
        
        
        this.api.containerInstance.on('server-ready', (port, url) => {
            this.createWindow(url)
            console.log('Server ready at', url)
        })
        this.api.containerInstance.on('error', (error) => {
            console.log(error)
        })
    }

    public createWindow(url){
        const el = document.createElement('iframe');
        el.setAttribute('allow', 'cross-origin-isolated')
        el.id = 'webcontainerXXX';
        el.style.position = 'fixed';
        el.style.width = '100%';
        el.style.height = '100%';
        el.style.top = '0';
        el.style.left = '0';
        el.style.zIndex = '99999';

        
        el.src = url;

        document.body.appendChild(el);
        
        return el;
    }

    public async GetRootDirectory(): Promise<Dir>{
        
        const result = await copyDirOrFile(this._rootDir, this)

        async function copyDirOrFile(dirPath, self: WebContainerService){

            const dirFn = await self.api.containerInstance.fs.readdir(dirPath)

            const rootDir: Dir = {name: dirPath, files: [], subDirs: []}

                for(const dirOrFile of dirFn){  
                    let isDir = true
                    let file;
                    
                    try{
                        file = await self.api.containerInstance.fs.readdir(dirPath + '/' + dirOrFile)
                        
                    }catch(e){
                        isDir = false
                    }
                    if(!isDir){
                        file = self.api.containerInstance.fs.readFile(dirPath + '/' + dirOrFile, "utf8")
                        
                        rootDir.files.push({value:file, name: dirOrFile})
                    }else{
                        
                        const newDir = await copyDirOrFile(dirPath + '/' + dirOrFile, self)
                        rootDir.subDirs.push(newDir)
                    }
                }
                return rootDir;
        }
        return result;
        
    }
}