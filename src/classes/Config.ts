interface ConfigInterface {
    [key: string]: string
}

export default class Config {

    static developmentConfig: ConfigInterface = {
        routerBasePath: "/",
        backendUrl: "http://localhost:8000",
    }

    static productionConfig: ConfigInterface = {
        routerBasePath: "/typing-test",
        backendUrl: "https://typing.yxcv.at",
    }

    static get(key: string) {
        if (process.env.NODE_ENV === "development") {
            return this.developmentConfig[key];
        } else {
            return this.productionConfig[key];
        }
    }
}