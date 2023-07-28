import router from "router";

type AppOpts = {
    readonly production: boolean,
}

class App implements AppOpts {
    public readonly production: boolean;

    constructor(prod: boolean) {
        this.production = prod;
    }

    run(): void {
        /* :) */
        if (this.production === true) {
            router({ prefetch: "visible", log: false })
        } else {
            router({ prefetch: "visible", log: true })
        }
    }
}

function app(opts: AppOpts) {
    let a = new App(opts.production);
    a.run();
}

(() => {
    let opts: AppOpts = {
        production: true,
    }
    app(opts);
})();


