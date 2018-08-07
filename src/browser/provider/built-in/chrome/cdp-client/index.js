import BrowserDriver from '../../browser-driver';
import Mouse from './mouse';

export default class ChromeBrowserDriver extends BrowserDriver {
    constructor (automationClient) {
        super(automationClient);

        this.mouse   = new Mouse(automationClient);
    }

    static fromConnection (connection) {
        const cdpClient = BrowserDriver.getAutomationClientFromConnection(connection);

        return new ChromeBrowserDriver(cdpClient);
    }

    async executeCommand (msg) {
        switch (msg.type) {
            case 'mousePressed':
                await this.mouse._mousePressed(msg.options);
                break;
            case 'mouseReleased':
                await this.mouse._mouseReleased(msg.options);
                break;
            case 'click':
                await this.mouse.click(msg.options);
                break;
            case 'doubleClick':
                await this.mouse.doubleClick(msg.options);
                break;
            case 'rightClick':
                await this.mouse.rightClick(msg.options);
                break;
            default:
                break;
        }
    }
}
