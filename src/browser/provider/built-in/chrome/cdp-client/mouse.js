import MOUSE_BUTTONS from './mouse';
import COMMANDS from './commands';
import MOUSE_EVENT_TYPES from './mouse-event-types';
import convertModifiersToIntCode from './convert-modifiers-to-int-code';

export default class Mouse {
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
        await this.automationClient.send(COMMANDS.dispatchMouseEvent, {
            type:       MOUSE_EVENT_TYPES.mousePressed,
            button:     options.button,
            x:          options.clientX,
            y:          options.clientY,
            modifiers:  convertModifiersToIntCode(options.modifiers),
            clickCount: options.clickCount
        });
    }

    async _mouseReleased (options) {
        await this.automationClient.send(COMMANDS.dispatchMouseEvent, {
            type:       MOUSE_EVENT_TYPES.mouseReleased,
            button:     options.button,
            x:          options.clientX,
            y:          options.clientY,
            modifiers:  convertModifiersToIntCode(options.modifiers),
            clickCount: options.clickCount
        });
    }

    async _move (x, y) {
        await this.automationClient.send(COMMANDS.dispatchMouseEvent, {
            type: MOUSE_EVENT_TYPES.mouseMoved,
            x:    x,
            y:    y
        });
    }
}
