# Harry Potter app (harry-potter-fe)

A Quasar Project

## Install the dependencies
```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```


### Lint the files
```bash
yarn lint
# or
npm run lint
```



### Build the app for production
```bash
quasar build
```

### Customize the configuration
See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).

### Pré-Requisitos para rodar a versão mobile
É necessário corrigir um bug do android studio, para criar a pasta tools na pasta Sdk  
O java precisa estar na versão 11, já que o Cordova está numa versão maior que a 10
Necassário instalar o gradle.  

Depois de configurado o android e studio, e rodar um emulador de celular, execute o seguinte comando:
```bash
quasar dev -m cordova -T android
```


 
