export * from "./types/splunk-types";

import { Plugin } from "@elizaos/core";
import { SplunkService } from "./services/SplunkService";
import { BasementClientInterface } from "./clients/index";

// declare a variable to hold the version number of the package, where package.json is on the ../ level
const { version } = require("../package.json");

// Initial banner
console.log(`Initializing Splunk Plugin (v${version})...`);

export const splunkPlugin: Plugin = {
    name: "splunk",
    description: "Splunk Plugin for Eliza",
    clients: [BasementClientInterface],
    actions: [],
    evaluators: [],
    services: [new SplunkService()],
};

export default splunkPlugin;
