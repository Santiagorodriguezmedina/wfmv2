module.export = {
    apps: [
        {
            name: "WFMV2",
            script: "npm",
            args: "run dev",
            env:{
                NODE_ENV: "development",
                ENV_VAR1: "enviroment-variable",
            }, 
       },
    ],
};