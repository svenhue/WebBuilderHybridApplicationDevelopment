export const files = {
  "AppConfigs": {
    "directory": {
      "AppConfig.ts": {
        "file": {
          "contents": "import { HybridAppDevelopmentApplicationModule } from 'hybridappdev/module.js';\r\n//import { ModellingModule } from 'app/modules/Modelling/ModellingModule';\r\nimport { ApplicationConfiguration, UtilityModule, IApplicationConfiguration, IPageConfiguration, ApplicationDeploymentModes } from 'alphautils';\r\nimport { ApplicationModes } from 'alphautils';\r\nimport { config } from './pages';\r\nimport { AuthenticationMechanism } from 'alphautils/app/Authentication/AuthenticationMechanism.ts';\r\n\r\n class WebBuilderApplicationConfiguration extends ApplicationConfiguration implements IApplicationConfiguration {\r\n  name = 'WebBuilderr';\r\n  deploymentMode= ApplicationDeploymentModes.spaclient;\r\n  mode = ApplicationModes.extension;\r\n  modules = [new UtilityModule(), new HybridAppDevelopmentApplicationModule()];\r\n  networkConfigs = [\r\n    {\r\n      name: \"WebCreatorBackend\",\r\n      url: \"https://localhost:44314/\",\r\n      authentication:{\r\n        mechanism: AuthenticationMechanism.UserCredentials,\r\n        tokenEndpoint: \"https://localhost:44314/connect/token/\",\r\n        authEndpoint: \"https://localhost:44314/connect/authorize\",\r\n        client_id: \"WebCreator_App\",\r\n        client_secret: \"\",\r\n        grant_type: \"password\",\r\n        username: undefined,\r\n        password: undefined\r\n\r\n      },\r\n      headers: {\r\n        'Content-Type': 'application/json'\r\n      }\r\n    } as IExternalNetworkConfiguration\r\n  ] as Array<IExternalNetworkConfiguration>\r\n}\r\n\r\nexport { WebBuilderApplicationConfiguration}\r\n\r\n\r\n"
        }
      },
      "languages": {
        "directory": {
          "de.json": {
            "file": {
              "contents": ""
            }
          },
          "en.json": {
            "file": {
              "contents": ""
            }
          }
        }
      },
      "pages.ts": {
        "file": {
          "contents": "import { IApplicationConfiguration } from \"alphautils\";\r\n\r\nexport  const config = {\r\n  internationalization: {\r\n    enabled: true,\r\n    defaultLocale: 'en',\r\n    langDir: './AppConfigs/languages',\r\n    locales: [{\r\n      code: 'en',\r\n      file: 'en.json'\r\n    },\r\n    {\r\n      code: 'de',\r\n      file: 'de.json'\r\n    }\r\n    ]\r\n  },\r\n  networkConfigs:[\r\n    {\r\n      name: 'Application',\r\n      \r\n      url: 'http://localhost:5000'\r\n    }\r\n  ],\r\n  deploymentMode: \"spaclient\",\r\n\r\n  pages: [\r\n    {\r\n      id:1,\r\n      name: 'index',\r\n        route:{\r\n          path: '/',\r\n          name: 'index' \r\n        },\r\n      requiresAuth:{\r\n          auth:true\r\n      },\r\n      tag: 'component:RootLayout',\r\n      isRoot: true,\r\n      children:[\r\n        {\r\n          name: 'marketplace',\r\n          id: 7,\r\n          tag: 'component:MarketplaceOverviewComponent',\r\n          isRoutable: true,\r\n          route:{\r\n            path: '/marketplace',\r\n            name: 'marketplace',\r\n            parentName: 'index' \r\n          }\r\n        },\r\n        {\r\n          id:2,\r\n          name: 'appdevelopment',\r\n          tag: 'component:MainDevelopmentLayout',\r\n          isRoutable: true,\r\n          route:{\r\n            path: '/appdevelopment',\r\n            name: 'appdevelopment',\r\n            parentName: 'index' \r\n          },\r\n          children:[\r\n            {\r\n              name: 'development',\r\n              id:4,\r\n              tag: 'component:DevelopmentComponent',\r\n              isRoutable: true,\r\n              route:{\r\n                path: ':appName',\r\n                name: 'development',\r\n                parentName: 'appdevelopment' \r\n              }\r\n            }\r\n          ]\r\n        },\r\n        {\r\n          id:3,\r\n          tag: 'component:CreateNewApplicationSolution',\r\n          isRoutable: true,\r\n          route:{\r\n            path: '/createApp',\r\n            name: 'createApp',\r\n            parentName: 'index' \r\n          }\r\n        },\r\n      ]\r\n    } \r\n  ] \r\n\r\n} "
        }
      }
    }
  },
  "composables": {
    "directory": {
      "useProcess.ts": {
        "file": {
          "contents": "export const useProcess = () => {\r\n    return {\r\n        isServer: process.server == true,\r\n    }\r\n  }"
        }
      }
    }
  },
  "css": {
    "directory": {
      "sassvariables.scss": {
        "file": {
          "contents": "// Quasar SCSS (& Sass) Variables\r\n// --------------------------------------------------\r\n// To customize the look and feel of this app, you can override\r\n// the Sass/SCSS variables found in Quasar's source Sass/SCSS files.\r\n\r\n// Check documentation for full list of Quasar variables\r\n\r\n// Your own variables (that are declared here) and Quasar's own\r\n// ones will be available out of the box in your .vue/.scss/.sass files\r\n\r\n// It's highly recommended to change the default colors\r\n// to match your app's branding.\r\n// Tip: Use the \"Theme Builder\" on Quasar's documentation website.\r\n\r\n$primary: #181cb4;\r\n$secondary: #26a69a;\r\n$accent: #9c27b0;\r\n\r\n$brightgrey: #9a9b9e;\r\n$darkgrey: #57595d;\r\n\r\n$fontwhite: #e1e2e3;\r\n$dark: #1d1d1d;\r\n$dark-page: #121212;\r\n\r\n$rezisedot: black;\r\n\r\n$positive: #21ba45;\r\n$negative: #c10015;\r\n$info: #31ccec;\r\n$warning: #f2c037;\r\n\r\n$edittext: #00ccff;\r\n"
        }
      }
    }
  },
  "middleware": {
    "directory": {
      "_originHeaders.ts": {
        "file": {
          "contents": "export default function(res) {\r\n    console.log(123, res)\r\n    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');\r\n    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');\r\n    res.setHeader('Cross-Origin-Resource-Policy', 'same-site');\r\n\r\n};"
        }
      },
      "_reflect.ts": {
        "file": {
          "contents": "import 'reflect-metadata';\r\n\r\nexport default () => {\r\n  throw new Error('This is hack for correct working reflect metadata on server');\r\n};"
        }
      }
    }
  },
  "modules": {
    "directory": {
      "AlphaApp": {
        "directory": {
          "GeneratePagesScript.ts": {
            "file": {
              "contents": "//@ts-ignore\r\n//@ts-nocheck\r\nimport { IApplicationConfiguration, IPageConfiguration } from 'alphautils';\r\nimport {  writeFileSync, lstatSync, mkdirSync, existsSync } from 'node:fs';\r\nimport { config } from '../../AppConfigs/pages.ts'\r\n\r\n//for each page in config look mode (spa, ssg, ssr) and generate the page\r\n//...\r\n//nuxt will generate routes based on the page files\r\n\r\n//for spa pages, add nested routes e.g to vue router\r\n\r\n//todo dynamic pages with []\r\nclass PagesGenerator{\r\n  \r\n  private config: IApplicationConfiguration;\r\n\r\n  constructor(){  \r\n    if(config == undefined){\r\n      throw new Error('No pages found in config')\r\n    }\r\n    \r\n    if(config.deploymentMode == undefined){\r\n      throw new Error('No deployment mode found in config')\r\n    }\r\n    this.config = config;\r\n  }\r\n\r\n  public generate(){\r\n    \r\n    if(this.config.deploymentMode == 'spaclient'){\r\n\r\n      if(this.config.pages.length != 1){\r\n        throw new Error('Only one page is allowed in spaclient mode')\r\n      }\r\n      \r\n    }\r\n    for(const page of this.config.pages){\r\n        let path = page.route.name \r\n        this.generatePageFile(page, path)\r\n      }\r\n    \r\n    }\r\n\r\n\r\n    private generatePageFile(page: IPageConfiguration, path){\r\n\r\n      let filePath = './pages'\r\n      let pageFile; \r\n      \r\n      \r\n      if(page?.isRoot == true){\r\n        pageFile = `\r\n          <template>\r\n              <div ref=\"templateRef\">\r\n                  <ComponentTreeBase :view=\"page.config.value\" :isPage=\"true\" :contextid=\"page.config.value.contextid\" :resolver=\"resolver\" />\r\n                  <NuxtPage :contextid=\"page.config.value.contextid\"></NuxtPage>\r\n              </div>\r\n          </template>\r\n  \r\n  \r\n          <script setup lang=\"ts\">\r\n         \r\n          //import { useHead } from 'unhead'\r\n          import { ref } from 'vue'\r\n          import { Page,IPageConfiguration } from 'alphautils'\r\n          import   {ComponentTreeBase}   from 'alphaviewlibrary'\r\n          import { ComponentResolver } from '@src/utils/ComponentResolver'\r\n          ${config.deploymentMode == 'spaclient' ? `import { useRouter } from 'vue-router'` : ''}\r\n  \r\n  \r\n          definePageMeta({\r\n            middleware:[\r\n              ${page.requiresAuth.auth == true ? '\"auth\"' : ''}\r\n            ],\r\n            auth: { requiresAuth: ${page.requiresAuth.auth}, redirect:\"${page.requiresAuth.redirect ?? '/login'}\"}\r\n          })\r\n  \r\n          const templateRef = ref<HTMLElement>(null)\r\n          const pageconfig = ${JSON.stringify(page)} as IPageConfiguration\r\n  \r\n          const resolver = new ComponentResolver()\r\n          const page = new Page(\r\n              pageconfig, \r\n              templateRef\r\n              \r\n              ${config.deploymentMode == 'spaclient' ? ',useRouter(),resolver' : ''}\r\n              )\r\n  \r\n          </script>\r\n      `\r\n      }else{\r\n        pageFile = `\r\n    \r\n          <template>\r\n            <BaseViewTreeRenderer :view=\"useViewConfiguration(props.contextid, viewId).view.value\" :contextid=\"props.contextid\" :resolver=\"resolver\" />\r\n          </template>\r\n      \r\n      \r\n          <script setup lang=\"ts\">\r\n          import { useViewConfiguration } from 'alphautils' \r\n          import   {BaseViewTreeRenderer}   from 'alphaviewlibrary'\r\n          import { ComponentResolver } from '@src/utils/ComponentResolver'\r\n          \r\n          const props = defineProps({\r\n            contextid: {\r\n              type: Number,\r\n              required:true\r\n            }\r\n          })\r\n          const resolver = new ComponentResolver()\r\n          const viewId = ${JSON.stringify(page.id)} as Number\r\n          \r\n      \r\n          </script>\r\n      `\r\n      }\r\n  \r\n      //index page\r\n      if(page.route.path == '/'){\r\n        mkdirSync(filePath + '/index', {recursive:true})\r\n        console.log(filePath)\r\n        writeFileSync(filePath + '/index.vue', pageFile)\r\n        \r\n      }else{\r\n      \r\n        \r\n        const dirPath = filePath + '/' + path + '/' + page.route.name\r\n        \r\n        \r\n  \r\n        if(!existsSync(dirPath)){\r\n          mkdirSync(dirPath)  \r\n        }else{\r\n          const stats = lstatSync(dirPath)\r\n          if(!stats.isDirectory()){\r\n            mkdirSync(dirPath)\r\n          }\r\n        }\r\n  \r\n        writeFileSync(dirPath + '/' + 'index.vue', pageFile)\r\n      }\r\n\r\n      if(page.route.name != 'index'){\r\n        path += '/' + page.route.name\r\n      }\r\n  \r\n      if(page.children != undefined){\r\n        for(const child of page.children){\r\n          this.generatePageFile(child, path)\r\n        }\r\n      }\r\n  \r\n      return pageFile;\r\n  }\r\n} \r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\nconst generator = new PagesGenerator()\r\n\r\ngenerator.generate()"
            }
          },
          "index.ts": {
            "file": {
              "contents": "import { createResolver, defineNuxtModule,addPlugin  } from 'nuxt/kit'\r\n\r\n\r\nexport default defineNuxtModule({\r\n  meta: {\r\n    name: 'hello'\r\n  },\r\n  setup (options, nuxt) {\r\n    const { resolve } = createResolver(import.meta.url)\r\n    \r\n    \r\n    // adding file based routes\r\n    \r\n    //todo: add plugins\r\n    addPlugin(resolve('plugins/AlphaUIAppExtension.ts'))\r\n    addPlugin(resolve('plugins/NonPojoPayloadPlugin.ts'))\r\n\r\n\r\n    //todo: handle pages and vue router routing\r\n    \r\n    //todo feature: hybrid rendering for pages\r\n    //router options\r\n\r\n  }\r\n})"
            }
          },
          "plugins": {
            "directory": {
              "AlphaUIAppExtension.ts": {
                "file": {
                  "contents": "import { VueApplication,AuthenticationMiddleware } from \"alphautils\";\r\nimport {WebBuilderApplicationConfiguration} from \"../../../AppConfigs/AppConfig.js\"\r\nimport { config } from \"../../../AppConfigs/pages.js\"\r\nimport { BaseServiceProvider, TabService } from 'alphautils';\r\n\r\n\r\n\r\nexport default defineNuxtPlugin({\r\n    order: 10,\r\n    dependsOn: ['nuxt:revive-payload:client', 'nuxt:revive-payload:server', 'nuxt:chunk-reload'], // required to access pinia on client and server side\r\n    name: 'appextension',\r\n    enforce: 'pre', // or 'post'\r\n    async setup (nuxtApp) {\r\n        \r\n      //app instance\r\n        const alphaApp = new VueApplication(\r\n          new WebBuilderApplicationConfiguration(), \r\n          undefined, \r\n          nuxtApp.vueApp,\r\n          undefined,\r\n          undefined, \r\n          nuxtApp.$pinia, \r\n          new ComponentResolver())\r\n        .setup()\r\n        .build()\r\n        .mount();\r\n      \r\n      \r\n      \r\n\r\n      \r\n      for(const page of config.pages){\r\n        \r\n        if(page.requiresAuth?.auth == true){\r\n          //todo auth\r\n          addRouteMiddleware('auth',  AuthenticationMiddleware)\r\n\r\n        }\r\n      }\r\n\r\n      let tabService;\r\n\r\n      async function navigate(url: string){\r\n          await navigateTo(url)\r\n      }\r\n\r\n      if(typeof process == 'undefined'){\r\n          tabService = BaseServiceProvider.ServiceWithContext<TabService>('TabService', 1) as TabService\r\n          tabService.SetNavigationHandler(navigate)\r\n      }else if(process.server == false){\r\n          tabService =BaseServiceProvider.ServiceWithContext<TabService>('TabService', 1)\r\n          tabService.SetNavigationHandler(navigate)\r\n      }\r\n        \r\n    },\r\n    \r\n    env: {\r\n      // Set this value to `false` if you don't want the plugin to run when rendering server-only or island components.\r\n      islands: true\r\n    }\r\n  })"
                }
              },
              "NonPojoPayloadPlugin.ts": {
                "file": {
                  "contents": "import { Page, ViewElement, VueApplication } from \"alphautils\"\r\nimport { BODeclarationContainer } from \"alphautils\"\r\nimport { UITreeProviderService } from \"alphaviewlibrary/src/renderer/UITreeProviderService.js\"\r\nimport { CommandPaletteViewModel } from \"hybridappdev/src/utils/CommandPalette/ViewModels/CommandPaletteViewModel.js\"\r\n\r\nexport default definePayloadPlugin(() => {\r\n    definePayloadReducer('BODeclarationContainer', data => {\r\n\r\n        \r\n        if(data instanceof UITreeProviderService){\r\n            console.log('reducerTree', data)\r\n        }else if(data instanceof Page){\r\n            console.log('reducerPage', data)\r\n        }else if (data instanceof VueApplication){\r\n            console.log('reducerVueApp', data)\r\n        }else if(data instanceof ViewElement){\r\n            console.log('reducerViewElement', data)\r\n        }else if(data instanceof BODeclarationContainer){\r\n       \r\n            return JSON.parse(JSON.stringify(data))\r\n        }else if(data instanceof CommandPaletteViewModel){\r\n            console.log('reducerCommandPalette')\r\n        }\r\n        \r\n        \r\n    })\r\n    definePayloadReducer('CommandPaletteViewModel', data => {\r\n\r\n        \r\n        if(data instanceof CommandPaletteViewModel){\r\n            console.log('reducerCommandPalette')\r\n        }\r\n        \r\n        \r\n    })\r\n    definePayloadReviver('BODeclarationContainer', data => {\r\n      //because alphautils vueapp sets this class as state in a pinia store\r\n      if(data instanceof BODeclarationContainer){\r\n        return new BODeclarationContainer(data)\r\n      }else if (data instanceof CommandPaletteViewModel){\r\n        return new CommandPaletteViewModel(data)\r\n      }\r\n    })\r\n    definePayloadReviver('CommandPaletteViewModel', data => {\r\n        //because alphautils vueapp sets this class as state in a pinia store\r\n        if(data instanceof BODeclarationContainer){\r\n          return new BODeclarationContainer(data)\r\n        }else if (data instanceof CommandPaletteViewModel){\r\n          return new CommandPaletteViewModel(data)\r\n        }\r\n      })\r\n\r\n})"
                }
              }
            }
          }
        }
      }
    }
  },
  "plugins": {
    "directory": {}
  },
  "server": {
    "directory": {
      "tsconfig.json": {
        "file": {
          "contents": "{\n  \"extends\": \"../.nuxt/tsconfig.server.json\",\n  \"compilerOptions\": {\n    \"experimentalDecorators\": true,\n    \"emitDecoratorMetadata\": true,\n    \"resolveJsonModule\": true\n  }\n}\n"
        }
      }
    }
  },
  "utils": {
    "directory": {
      "ComponentResolver.ts": {
        "file": {
          "contents": "import { type IComponentResolver, BaseComponentResolver } from 'alphaviewlibrary'\r\nimport { type IViewConfiguration } from 'alphautils'\r\nimport { defineAsyncComponent } from 'vue';\r\n\r\nexport class ComponentResolver extends BaseComponentResolver implements IComponentResolver{\r\n\r\n    constructor(){\r\n        super()\r\n    }\r\n\r\n    public override resolveComponent(node: IViewConfiguration) {\r\n        \r\n\r\n        const componentName = this.GetComponentName(node.tag);\r\n        //const importPath = 'hybridappdev'\r\n        if(node.tag?.startsWith('component:')){\r\n            let component = undefined //defineAsyncComponent(() =>  import(/* @vite-ignore */  'alphaviewlibrary').catch(e => console.log(e)).then(m => m[componentName]))\r\n            if(component == undefined){\r\n                \r\n                component = defineAsyncComponent(() =>  import('hybridappdev')\r\n                    .catch(e => console.log(\"Import Error\", e))\r\n                    .then(m =>  m[componentName]))\r\n                    const t = import('hybridappdev')\r\n            }\r\n            return component;\r\n        }\r\n\r\n    }\r\n}"
        }
      }
    }
  },
  "pages": {
    "directory": {}
  },
  "nuxt.config.ts": {
    "file": {
      "contents": "\n    // https://nuxt.com/docs/api/configuration/nuxt-config\n    import typescript from '@rollup/plugin-typescript'\n    import { resolve } from 'path'\n    import { config } from './AppConfigs/pages'\n    \n    export default defineNuxtConfig({\n      ssr: config.deploymentMode == 'spaclient' ? false : true,\n      \n      devtools: { enabled: true },\n      modules:['nuxt-quasar-ui', \"@pinia/nuxt\", \"@nuxtjs/i18n\"],\n      quasar:{\n        plugins: ['Notify'],\n        sassVariables: './css/sassvariables.scss'\n      },\n      i18n:{\n        vueI18n: './i18n.config.ts',\n        detectBrowserLanguage: {\n          useCookie: true,\n          cookieKey: 'i18n_redirected',\n          redirectOn: 'root' // recommended\n        }\n      },\n      \n      nitro:{\n        routeRules:{\n          '**':{\n            headers: {\n              'Cross-Origin-Embedder-Policy': 'require-corp',\n              'Cross-Origin-Opener-Policy': 'same-origin',\n            },\n          }\n        }\n      },\n    \n      vite: {\n        \n        server:{\n          headers:{\n            'Cross-Origin-Opener-Policy': 'same-origin',\n            'Cross-Origin-Embedder-Policy': 'require-corp',\n            'Cross-Origin-Resource-Policy': 'cross-origin'\n          \n          }\n        },\n        optimizeDeps:{\n          include: [\n\n          ]\n        },\n        \n    \n        esbuild: {\n          tsconfigRaw: {\n            compilerOptions: {\n              experimentalDecorators: true\n            }\n          }\n        },\n        \n      },\n      alias:{\n        'appConfig': resolve(__dirname, './AppConfigs'),\n        '@src': resolve(__dirname, './'),\n      }\n    })"
    }
  },
  "i18n.config.ts": {
    "file": {
      "contents": "import { config } from './AppConfigs/pages'\n\n    export default defineI18nConfig(() => ({\n        legacy: false,\n        defaultLocale: config.internationalization?.defaultLocale,\n        locales: config.internationalization?.locales,\n        langDir: config.internationalization?.langDir\n      }))"
    }
  },
  "tsconfig.json": {
    "file": {
      "contents": "{\n        \"$schema\": \"http://json.schemastore.org/tsconfig\",\n        // https://nuxt.com/docs/guide/concepts/typescript\n        \"extends\": \"./.nuxt/tsconfig.json\",\n        \"compilerOptions\": {\n          \"experimentalDecorators\": true,\n          \"emitDecoratorMetadata\": true,\n          \"target\": \"ES2022\",\n          \"module\": \"ES2022\",\n          \"verbatimModuleSyntax\": false,\n          \"resolveJsonModule\": true\n        }\n      }\n      "
    }
  },
  "package.json": {
    "file": {
      "contents": "{\n        \"name\": \"nuxt-app\",\n        \"private\": true,\n        \"type\": \"module\",\n        \"scripts\": {\n          \"build\": \"nuxt build\",\n          \"dev\": \"nuxt dev\",\n          \"generate\": \"nuxt generate\",\n          \"preview\": \"nuxt preview\",\n          \"postinstall\": \"nuxt prepare\",\n          \"generatePages\": \"npx tsx modules/AlphaApp/GeneratePagesScript.ts --experimentalDecorators\"\n        },\n        \"dependencies\": {\n          \"@nuxtjs/i18n\": \"^8.3.1\",\n          \"@pinia/nuxt\": \"^0.5.1\",\n          \"@quasar/extras\": \"^1.16.9\",\n          \"@rollup/plugin-typescript\": \"^11.1.6\",\n          \"alphautils\": \"https://github.com/svenhue/WebBuilderUtils.git\",\n          \"alphaviewlibrary\": \"https://github.com/svenhue/WebBuilderViewLibrary.git\",\n          \"axios\": \"^1.6.8\",\n          \"inversify\": \"^6.0.2\",\n          \"lodash-es\": \"^4.17.21\",\n          \"nuxt\": \"^3.11.1\",\n          \"pinia\": \"^2.1.7\",\n          \"quasar\": \"^2.15.1\",\n          \"reflect-metadata\": \"^0.2.1\",\n          \"sass\": \"^1.72.0\",\n          \"vue\": \"^3.4.21\",\n          \"vue-i18n\": \"^9.13.1\",\n          \"vue-router\": \"^4.3.0\",\n          \"nuxt-quasar-ui\": \"^2.0.8\",\n          \"tsx\": \"^4.11.2\"\n        },\n        \"devDependencies\": {\n          \"nuxt-quasar-ui\": \"^2.0.8\",\n          \"tsx\": \"^4.11.2\"\n        }\n      }\n      "
    }
  },
  "app.vue": {
    "file": {
      "contents": "<template>\n    <div>\n        Hello World!!!\n      <NuxtPage />\n    </div>\n  </template>\n  "
    }
  }
}