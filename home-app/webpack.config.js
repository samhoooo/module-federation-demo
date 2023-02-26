const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const { dependencies } = require("./package.json");

module.exports = {
    entry: "./src/entry",
    mode: "development",
    devServer: {
        port: 3000,
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)?$/,
                exclude: /node_modules/,
                use: [
                    {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"],
                    },
                    },
                ],
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html",
        }),
        new ModuleFederationPlugin({
            name: "HomeApp",  // This application named 'Home'
            // This is where we define the federated modules that we want to consume in this app. 
            // Note that we specify "Header" as the internal name 
            // so that we can load the components using import("Header/"). 
            // We also define the location where the remote's module definition is hosted: 
            // Header@[http://localhost:3001/remoteEntry.js]. 
            // This URL provides three important pieces of information: the module's name is "Header", it is hosted on "localhost:3001", 
            // and its module definition is "remoteEntry.js".
            remotes: {
                // a remote 'Header' from the url '<http://localhost:3001/remoteEntry.js>'
                "HeaderApp": "HeaderApp@http://localhost:3001/remoteEntry.js",  
            },
            shared: {
                ...dependencies,
                react: {
                  singleton: true,
                  requiredVersion: dependencies["react"],
                },
                "react-dom": {
                  singleton: true,
                  requiredVersion: dependencies["react-dom"],
                },
            },
        }),
    ],
    resolve: {
        extensions: [".js", ".jsx"],
    },
    target: "web",
};