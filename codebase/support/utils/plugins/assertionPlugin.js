function fixTestCafeAssertions() {
    let TestController = require('testcafe/lib/api/test-controller/index');

    TestController.prototype._enqueueCommand = function(apiMethodName, CmdCtor, cmdArgs) {
        return this._enqueueTask(apiMethodName, callsite => {
            let command = null;
            try {
                command = new CmdCtor(cmdArgs, this.testRun);
            }
            catch (err) {
                err.callsite = callsite;
                throw err;
            }
            return () => {
                return this.testRun.executeAction(apiMethodName, command, callsite)
                    .catch(err => {
                        throw err;
                    });
            };
        });
    }
}

exports.fixTestCafeAssertions = fixTestCafeAssertions;