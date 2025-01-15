import { Character, ModelProviderName } from "@elizaos/core";
import { splunkPlugin } from "@elizaos/plugin-splunk";

export const supportEngineerCharacter: Character = {
    name: "Douglas",
    username: "douglas@mirvac.com",
    plugins: [splunkPlugin],
    clients: [],
    modelProvider: ModelProviderName.OPENAI,
    settings: {
        secrets: {
            SUPPORT_QUERIES:
                'index=\"mca-prod-integration\" message.type=\"error\" host=prod source=\"integration-mca-assetmanagement-service\", \
                 index=\"mca-prod-integration\" message.type=\"error\" host=prod source=\"integration-mca-booking-service\" ',
        },
        voice: {
            model: "en_US-hfc_male-medium",
        },
    },
    system: "You are a professional backend developer working on the support team for the integration and API team.",
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
