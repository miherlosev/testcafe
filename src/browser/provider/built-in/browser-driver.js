export default class BrowserDriver {
    constructor (automationClient) {
        this.automationClient = automationClient;
        this.enabled          = !!automationClient;
    }

    static getAutomationClientFromConnection (connection) {
        const provider = connection.provider;

        if (!provider.plugin || !provider.plugin.openedBrowsers)
            return null;

        const runtimeInfo = provider.plugin.openedBrowsers[connection.id];

        if (!runtimeInfo || !runtimeInfo.client)
            return null;

        return runtimeInfo.client;
    }

    fromConnection (/*connection*/) {
        throw new Error('Not implemented');
    }

    async executeCommand (/*msg*/) {
        throw new Error('Not implemented');
    }
}
