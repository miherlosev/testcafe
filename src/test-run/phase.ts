enum TestRunPhase {
    initial = 'initial',
    inFixtureBeforeHook = 'inFixtureBeforeHook',
    inFixtureBeforeEachHook = 'inFixtureBeforeEachHook',
    inTestBeforeHook = 'inTestBeforeHook',
    inTest = 'inTest',
    inTestAfterHook = 'inTestAfterHook',
    inFixtureAfterEachHook = 'inFixtureAfterEachHook',
    inFixtureAfterHook = 'inFixtureAfterHook',
    inRoleInitializer = 'inRoleInitializer',
    inBookmarkRestore = 'inBookmarkRestore',
    pendingFinalization = 'pendingFinalization'
}

export default TestRunPhase;
