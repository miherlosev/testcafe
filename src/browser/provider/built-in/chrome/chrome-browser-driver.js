import BrowserDriver from '../browser-driver';

const AUTOMATION_CLIENT_COMMANDS = {
    dispatchMouseEvent: 'Input.dispatchMouseEvent',
    dispatchKeyEvent:   'Input.dispatchKeyEvent'
};
const MOUSE_EVENT_TYPES          = {
    mousePressed:  'mousePressed',
    mouseReleased: 'mouseReleased',
    mouseMoved:    'mouseMoved',
    mouseWheel:    'mouseWheel'
};

const MOUSE_BUTTONS = {
    none:   'none',
    left:   'left',
    middle: 'middle',
    right:  'right'
};

const KEY_TYPES = {
    keyDown:    'keyDown',
    keyUp:      'keyUp',
    rawKeyDown: 'rawKeyDown',
    char:       'char'
};

const MODIFIER_CODES = {
    alt:   1,
    ctrl:  2,
    meta:  4,
    shift: 8
};

function convertModifiersToIntCode (modifiers) {
    let result = 0;

    Object.keys(modifiers).forEach(key => {
        result |= modifiers[key] ? MODIFIER_CODES[key] : 0;
    });

    return result;
}

class Keyborad {
    constructor (automationClient) {
        this.automationClient = automationClient;
    }

    async _press (key, options) {
        await this._down(key, options);
        await this._up(key);
    }

    async _down (key, options) {
        await this.automationClient.send(AUTOMATION_CLIENT_COMMANDS.dispatchKeyEvent, {
            type: KEY_TYPES.keyDown,
            text: key
        });
    }

    async _up (key) {
        await this.automationClient.send(AUTOMATION_CLIENT_COMMANDS.dispatchKeyEvent, {
            type: KEY_TYPES.keyUp
        });
    }


    async typeText (options) {
        for (const char of options.text) {
            await this._press(char, options);
            // if (keyDefinitions[char])
            //     await this.press(char, { delay });
            // else
            //     await this.sendCharacter(char);
        }
    }
}

class Mouse {
    constructor (automationClient) {
        this.automationClient = automationClient;
    }

    async click (options) {
        options.clickCount = 1;
        options.button     = MOUSE_BUTTONS.left;

        await this._baseClick(options);
    }

    async doubleClick (options) {
        options.clickCount = 2;
        options.button     = MOUSE_BUTTONS.left;

        await this._baseClick(options);
    }

    async rightClick (options) {
        options.clickCount = 1;
        options.button     = MOUSE_BUTTONS.right;

        await this._baseClick(options);
    }

    async _baseClick (options) {
        this._move(options.clientX, options.clientY);
        this._mousePressed(options);
        await this._mouseReleased(options);
    }

    async _mousePressed (options) {
        await this.automationClient.send(AUTOMATION_CLIENT_COMMANDS.dispatchMouseEvent, {
            type:       MOUSE_EVENT_TYPES.mousePressed,
            button:     options.button,
            x:          options.clientX,
            y:          options.clientY,
            modifiers:  convertModifiersToIntCode(options.modifiers),
            clickCount: options.clickCount
        });
    }

    async _mouseReleased (options) {
        await this.automationClient.send(AUTOMATION_CLIENT_COMMANDS.dispatchMouseEvent, {
            type:       MOUSE_EVENT_TYPES.mouseReleased,
            button:     options.button,
            x:          options.clientX,
            y:          options.clientY,
            modifiers:  convertModifiersToIntCode(options.modifiers),
            clickCount: options.clickCount
        });
    }

    async _move (x, y) {
        await this.automationClient.send(AUTOMATION_CLIENT_COMMANDS.dispatchMouseEvent, {
            type: MOUSE_EVENT_TYPES.mouseMoved,
            x:    x,
            y:    y
        });
    }
}

export default class ChromeBrowserDriver extends BrowserDriver {
    constructor (automationClient) {
        super(automationClient);

        this.keybord = new Keyborad(automationClient);
        this.mouse   = new Mouse(automationClient);
    }

    static fromConnection (connection) {
        const cdpClient = BrowserDriver.getAutomationClientFromConnection(connection);

        return new ChromeBrowserDriver(cdpClient);
    }

    async executeCommand (msg) {
        switch (msg.type) {
            case 'mousePressed':
                msg.options.clickCount = 1;
                msg.options.button     = MOUSE_BUTTONS.left;

                await this.mouse._mousePressed(msg.options);
                break;
            case 'mouseReleased':
                msg.options.clickCount = 1;
                msg.options.button     = MOUSE_BUTTONS.left;

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
            case 'typeText':
                await this.keybord.typeText(msg.options);
                break;
            default:
                break;
        }
    }
}
