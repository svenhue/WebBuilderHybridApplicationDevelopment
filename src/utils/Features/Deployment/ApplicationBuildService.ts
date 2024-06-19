import { Dir } from "./IDirsAndFiles";
import { WebContainerService } from "./WebContainerService";

export class ApplicationBuildService extends WebContainerService{

    private readonly _buildOutputDirectory: string = './.output';

    public async Build(){
        
        const FileSaver = require('file-saver');
        let result = null;
        await this.boot();
        
       
        await this.env.RunCommand(this.api.containerInstance, 'npm', ['run', 'generatePages'], true)


        await this.env.RunCommand(this.api.containerInstance, 'npm', ['run', 'generate'], true, "You can now deploy", async () => {
            
            result = await this.GetBuildDirectory()
            const zip = await this.CreateZip(result)
            const r = await zip.generateAsync({ type: 'blob' }).then(function (content) {
              
                FileSaver.saveAs(content, 'download.zip');
            });

        }
        );

        
    }
    private async CreateZip(dirx: Dir){
        const JSZip = require('jszip');
        const zip = new JSZip();

        for(const dir of dirx.subDirs){
            createContent(dir)
        }

        for(const file of dirx.files){
            //fix this in place
            zip.file('output/' + file.name, file.value)
        }
        function createContent(dir: Dir){
            
            for(const file of dir.files){
                //todo remove this substring and fix it in place GetBuildDirectory()
                zip.file(dir.name.substring(3) + '/' + file.name, file.value, { compression: 'STORE'})
            }

            for(const subDir of dir.subDirs){
                createContent(subDir)
            }  
        }
        return zip;
    }

    

    private async GetBuildDirectory(): Promise<Dir>{
        
        const result = await copyDirOrFile(this._buildOutputDirectory, this)
        async function copyDirOrFile(dirPath, self: ApplicationBuildService){

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