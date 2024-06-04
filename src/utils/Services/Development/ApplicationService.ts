//@ts-ignore
//@ts-nocheck
import {  ApplicationDeploymentModes,ApplicationModes, BusinessObject, DataAdapter, DataAdapterOptions, IApplicationConfiguration, IViewConfiguration, SimpleNameValueCollection, TabService } from 'alphautils';
import { injectable, inject, interfaces } from 'inversify';
import { CommandPaletteContextLevels } from '../../CommandPalette/CommandPaletteContextLevels';
import { ICommandProvider } from '../../CommandPalette/ICommandProvider';
import { CommandPaletteService } from '../../CommandPalette/Services/CommandPaletteService';
import { BaseServiceProvider } from 'alphautils';
import { ViewConfigurationService } from '../ViewConfigurationService';
import { DataContextManager } from 'alphautils';
import { ContextLevel } from 'alphautils';
import { AuthenticationMechanism } from 'alphautils';


@injectable()
export class ApplicationService extends BaseServiceProvider{

    private tabService: TabService
    private dataAdapter: DataAdapter
    private commandService: CommandPaletteService
    private viewService: ViewConfigurationService
    private contextManager: DataContextManager
    constructor(
        @inject('ViewConfigurationService') viewService: ViewConfigurationService,
        @inject('TabService') tabService: TabService,
        @inject('DataAdapter') dataAdapter: interfaces.Newable<DataAdapter>,
        @inject('CommandPaletteService') commandService: CommandPaletteService,
        @inject('DataContextManager') globalVariableDataProvider: DataContextManager
    ){
        super()
        this.contextManager = globalVariableDataProvider;
        this.viewService = viewService;
        this.tabService = tabService;       
        this.commandService = commandService;
        const dataAdapterOptions = new DataAdapterOptions({
            boType: new BusinessObject({
                name: 'Application',
                propertys:[]
            }),
            persistGlobalStorage: false,
            persistLocalStorage: true,
            contextId: 0 // the root context has always the id = 0
        })
        this.dataAdapter = new dataAdapter(dataAdapterOptions);
        this.commandService.AddCommand({
            label: 'Create New Application',
            contextLevel: CommandPaletteContextLevels.application,
            commandName: 'CreateNewApplication'
        } as ICommandProvider)
    }
    public CreateApplicationContext(){
        const c = this.contextManager.NewContext(undefined, ContextLevel.Application);
        console.log(c)
        return c.contextid;
    }
    public CreateNewApplication(config: IApplicationConfiguration){
      
        config.boType = new BusinessObject({
            name: 'Application',
        })
        config = this.InitializeApplication(config)
        config = this.dataAdapter.Create(config);
      
        this.tabService.AddAndOpenTab({title: "App:" + config.name,path: `appdevelopment/${config.name}`})
        return config;
    }

    public GetApplicationConfigByName(name: string){
        let application = this.dataAdapter.Find('Application', (value: IApplicationConfiguration) => { return value.name ==  name})
        if(application?.id == undefined){
            // occurs on page reload
           application = this.FetchApplicationConfiguration(name)

           //only in dev

           
           application = this.ConfigureApplication(application)
           this.InitializeApplication(application)
           this.dataAdapter.Create(application)
        }
        return application;
    }

    private FetchApplicationConfiguration(name: string): IApplicationConfiguration{
        return {
            name: name
        }
    }
    private InitializeApplication(config: IApplicationConfiguration): IApplicationConfiguration{

        config.globalVariables = {
            vars: new SimpleNameValueCollection(
                [
                    {
                        key:'defaultTabletWidth',
                        value: '"768px"'
                    },
                    {
                        key:'defaultDesktopWidth',
                        value: '"100%"'
                    },
                    {
                        key:'defaultMobileHeight',
                        value: '"480px"'
                    },
                    {
                        key: 'defaultMobileWidth',
                        value: '"250px"'
                    },
                    {
                        key:'defaultTabletHeight',
                        value: '"481px"'
                    },
                    {
                        key:'defaultDesktopHeight',
                        value: '"100%"'
                    }
            ])
        }
        config.stylesheets = {
            colors: [
                {
                    key: 'Brand_Primary',
                    value: '#3170F8'
                },
                {
                    key: 'Brand_Secondary',
                    value: '#3D3D3D'
                },
                {
                    key: 'Brand_Accent',
                    value: '#FF4081'
                },
                {
                    key: 'Brand_Dark',
                    value: '#212121'
                },
                {
                    key: 'Status_Success',
                    value: '#4CAF50'
                },
                {
                    key: 'Status_Warning',
                    value: '#FFC107'
                },
                {
                    key: 'Status_Error',
                    value: '#F44336'
                },
                {
                    key: 'Status_Info',
                    value: '#2196F3'
                },
                {
                    key: 'Text_Dark',
                    value: '#212121'
                },
                {
                    key: 'Text_Light',
                    value: '#FFFFFF'
                }
        ]
        }
        config.networkConfigs = [
            {
              name: "WebCreatorBackend",
              url: "https://localhost:44314/api/",
              authentication:{
                mechanism: AuthenticationMechanism.UserCredentials,
                tokenEndpoint: "https://localhost:44314/connect/token/",
                authEndpoint: "https://localhost:44314/connect/authorize",
                client_id: "WebCreator_App",
                client_secret: "",
                grant_type: "password",
                username: undefined,
                password: undefined
        
              },
              headers: {
                'Content-Type': 'application/json'
              }
            } as IExternalNetworkConfiguration
          ] as Array<IExternalNetworkConfiguration>
        config = this.ConfigureApplication(config)
        return config;
    }

    /* #region private Hilfsmethoden */
    private ConfigureApplication(config: IApplicationConfiguration): IApplicationConfiguration{
        const rootView = this.createDefaultRootView(config);

       
        config.components = [];
        config.mode = ApplicationModes.shadow;
        config.deploymentMode = ApplicationDeploymentModes.spaclient;
        config.pages = [
            {
                name: 'Your Page',
                meta:{
                    title: 'Your Page'
                },
                role: "Landingpage",
                route: '/',
                views: [rootView],
            }
        ];
        return config;
    }
    public createDefaultRootView(app: IApplicationConfiguration): IViewConfiguration{
        const config = {
            type: 'viewdefinition:Application:DefaultRootComponent',
            tag: 'component:DefaultRootComponent',
            name: 'Default Root Component',
            htmlattributes:{
            },
            style: {
                position: 'relative',
                height: '100%',
                width: '100%'
            },
            dataConfig:{
                contextId: app.contextid,
            },
            properties:{
                isactive: true,
            },
            isRoot: true,
        } as IViewConfiguration

        return config;   
    }
}