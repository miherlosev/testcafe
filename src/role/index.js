import { EventEmitter } from 'events';
import nanoid from 'nanoid';
import PHASE from './phase';
import { assertType, is } from '../errors/runtime/type-assertions';
import wrapTestFunction from '../api/wrap-test-function';
import { resolvePageUrl } from '../api/test-page-url';
import roleMarker from './marker-symbol';
import { StateSnapshot } from 'testcafe-hammerhead';

class Role extends EventEmitter {
    constructor (loginPageUrl, initFn, options = {}) {
        super();

        this[roleMarker] = true;

        this.id    = nanoid(7);
        this.phase = loginPageUrl ? PHASE.uninitialized : PHASE.initialized;

        this.loginPageUrl = loginPageUrl;
        this.initFn       = initFn;
        this.opts         = options;

        this.redirectUrl   = null;
        this.stateSnapshot = StateSnapshot.empty();
        this.initErr       = null;
    }

    async _storeStateSnapshot (testRun) {
        if (this.initErr)
            return;

        this.stateSnapshot = await testRun.getStateSnapshot();
    }

    async _executeInitFn (testRun) {
        try {
            let fn = () => this.initFn(testRun);

            fn = testRun.decoratePreventEmitActionEvents(fn, { prevent: false });
            fn = testRun.decorateDisableDebugBreakpoints(fn, { disable: false });

            await fn();
        }
        catch (err) {
            this.initErr = err;
        }
    }

    async initialize (testRun) {
        this.phase = PHASE.pendingInitialization;

        await testRun.switchToCleanRun(this.loginPageUrl);

        await this._executeInitFn(testRun);
        await this._storeStateSnapshot(testRun);

        if (this.opts.preserveUrl)
            await this.setCurrentUrlAsRedirectUrl(testRun);

        this.phase = PHASE.initialized;
        this.emit('initialized');
    }

    async setCurrentUrlAsRedirectUrl(testRun) {
        this.redirectUrl = await testRun.getCurrentUrl();
    }
}

export function createRole (loginPageUrl, initFn, options = { preserveUrl: false}) {
    assertType(is.string, 'Role', '"loginPageUrl" argument', loginPageUrl);
    assertType(is.function, 'Role', '"initFn" argument', initFn);
    assertType(is.nonNullObject, 'Role', '"options" argument', options);
    assertType(is.boolean, 'Role', '"preserveUrl" option', options.preserveUrl);

    loginPageUrl = resolvePageUrl(loginPageUrl);
    initFn       = wrapTestFunction(initFn);

    return new Role(loginPageUrl, initFn, options);
}

export function createAnonymousRole () {
    return new Role(null, null);
}
