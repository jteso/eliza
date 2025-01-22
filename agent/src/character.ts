import { Character, ModelProviderName } from "@elizaos/core";
import { splunkPlugin } from "@elizaos/plugin-splunk";
import { emailPlugin } from "@elizaos/plugin-email";

export const supportEngineerCharacter: Character = {
    name: "Douglas",
    username: "douglas@mirvac.com",
    plugins: [emailPlugin, splunkPlugin],
    clients: [],
    modelProvider: ModelProviderName.OPENAI,
    settings: {
        secrets: {
            EMAIL_OUTGOING_SERVICE: "gmail",
            EMAIL_OUTGOING_USER: "jtejob@gmail.com",
            EMAIL_OUTGOING_PASS: "lgqd vbqy tzkh pjgf",

            EMAIL_INCOMING_SERVICE: "imap",
            EMAIL_INCOMING_HOST: "s04ge.syd5.hostingplatform.net.au",
            EMAIL_INCOMING_PORT: "993",
            EMAIL_INCOMING_USER: "javier@kumologica.com",
            EMAIL_INCOMING_PASS: "welcomejavier",

            SUPPORT_QUERIES:
                'index=\"mca-prod-integration\" message.type=\"error\" host=prod source=\"integration-mca-assetmanagement-service\", \
                 index=\"mca-prod-integration\" message.type=\"error\" host=prod source=\"integration-mca-booking-service\" ',
        },
        voice: {
            model: "en_US-hfc_male-medium",
        },
    },
    system: "You are a professional backend developer working on the support team for the integration and API team.",
    knowledge: [
        `service:"integration-mca-assetmanagement-service", errorDescription: "Connection timeout to Salesforce API", "causedBy": "Caused by a password change in the underlying Salesforce database"`,
        `service:"integration-itwocx-pull", errorDescription: "Connection timeout", "causedBy": "Caused by multiple services (more than 3) attempting to communicate with iTwoCX concurrently"`,
        `service:"integration-mca-digitalaccess-service", errorDescription: "Access Error", "causedBy": "Check if digital access is enabled, or user has already changed the device"`,
        `service:"integration-mca-digitalaccess-service", errorDescription: "Unable to create account due to mobileNo: 123232 not present in Salesforce", "causedBy": "Check if this number is the secondary in salesforce, otherwise advise to use the primary"`,
    ],
    bio: [],
    lore: [],
    messageExamples: [],
    postExamples: [],
    topics: [],
    style: {
        all: [],
        chat: [],
        post: [],
    },
    adjectives: [],
};
