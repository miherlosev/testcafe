import hammerhead from '../deps/hammerhead';
import { RequestBarrier, pageUnloadBarrier, browser } from '../deps/testcafe-core';
import DriverStatus from '../status';


const { createNativeXHR, utils } = hammerhead;

export default function executeNavigateTo (command) {
    debugger;
    const navigationUrl = utils.url.getNavigationUrl(command.url, window);

    let ensurePagePromise = hammerhead.Promise.resolve();

    if (navigationUrl && browser.isRetryingTestPagesEnabled())
        ensurePagePromise = browser.fetchPageToCache(navigationUrl, createNativeXHR);

    return ensurePagePromise
        .then(() => {
            const requestBarrier = new RequestBarrier();

            hammerhead.navigateTo(command.url, command.forceReload);

            return hammerhead.Promise.all([requestBarrier.wait(), pageUnloadBarrier.wait()]);
        })
        .then(() => {
            debugger;
            return new DriverStatus({ isCommandResult: true });
        })
        .catch(err => {
            debugger;
            return new DriverStatus({ isCommandResult: true, executionError: err });
        });
}
