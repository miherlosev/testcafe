import RequestHook from './hook';
import WarningLog from '../../notifications/warning-log';
import { RequestHookNotImplementedMethodError, RequestHookUnhandledError } from '../../errors/test-run';

interface RequestHookInitializationData {
    hook: RequestHook;
    warningLog: WarningLog;
    session: Session;
    onRequestHookMethodError: (err: Error, hook: RequestHook) => void;
}

interface RequestHookDisposalData {
    hook: RequestHook;
    session: Session;
}

export default class RequestHookInitializer {
    static _prepareError (event: any, hook: RequestHook) {
        let err                                      = event.error;
        const isRequestHookNotImplementedMethodError = err instanceof RequestHookNotImplementedMethodError;

        if (!isRequestHookNotImplementedMethodError) {
            const hookClassName = hook.constructor.name;

            err = new RequestHookUnhandledError(err, hookClassName, event.methodName);
        }

        return err;
    }

    static initialize ({ hook, warningLog, session, onRequestHookMethodError }: RequestHookInitializationData): void {
        hook._warningLog = warningLog;

        hook._instantiateRequestFilterRules();
        hook._instantiatedRequestFilterRules.forEach(rule => {
            // @ts-ignore
            session.addRequestEventListeners(rule, {
                // @ts-ignore access to protected method
                onRequest:           hook.onRequest.bind(hook),
                // @ts-ignore access to protected method
                onConfigureResponse: hook._onConfigureResponse.bind(hook),
                // @ts-ignore access to protected method
                onResponse:          hook.onResponse.bind(hook)
            }, (event: any) => {
                const err = RequestHookInitializer._prepareError(event, hook);

                onRequestHookMethodError(err, hook)
            });
        });
    }

    static dispose ({ hook, session }: RequestHookDisposalData): void {
        hook._warningLog = null;

        hook._instantiatedRequestFilterRules.forEach(rule => {
            // @ts-ignore
            session.removeRequestEventListeners(rule);
        });
    }
}
