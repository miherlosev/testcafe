import { transport, utils } from '../deps/hammerhead';
import { disableRealEventsPreventing, preventRealEvents } from '../prevent-real-events';
import MESSAGE from '../../../test-run/client-messages';

export default {
    enabled: false,

    driverName: '',

    performAction (args) {
        disableRealEventsPreventing();

        const msgArgs = {
            disableResending: true,
            cmd:              MESSAGE.performSpecialDriverAction,
            driverName:       this.driverName
        };

        utils.extend(msgArgs, args);

        return transport.queuedAsyncServiceMsg(msgArgs)
            .then(() => preventRealEvents());
    }
};
