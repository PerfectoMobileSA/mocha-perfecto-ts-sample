declare var rpt: any
declare var r: any
var sel      = require('selenium-webdriver');
var perfectoReporting = require('perfecto-reporting');
var capabilities = {
    'platformName' : 'iOS',
    'deviceName' : '<Device ID>',
    'bundleId' : 'com.apple.calculator', //your app bundle id
    'browserName' : 'mobileOS',
    'securityToken' : '<Sec Token>'
  }

var REMOTE_URL = 'https://<Cloud Name>.perfectomobile.com/nexperience/perfectomobile/wd/hub/fast';

// Helper function to launch and provide browser object and reporting client for our test cases. Usage
//
//  describeWithPerfecto(
//   'name'
//  )
//
module.exports = function describeWithPerfecto(name, callback, body) {
  let browser;
  let reportingClient;
  describe(name, function() {
    this.timeout(50000); 
    // as we using beforeEach here, new browser will be received for every test case
    before(async function() {
            try{
                    //launch the remoteWebDriver
                    browser =  await  new sel.Builder().withCapabilities(capabilities).usingServer(REMOTE_URL).build();
                
                    await browser.manage().setTimeouts({implicit:20000});
                    var perfectoExecutionContext =  
                        await new perfectoReporting.Perfecto.PerfectoExecutionContext({
                            webdriver: browser,
                            //set the CI job name and CI job number, can be prameterized
                            job: {jobName: "Your_Ci_Job_Name",buildNumber:'1'},
                            //Set the tags
                            tags: ['Tag1 Tag2']
                        }
                    );
                    reportingClient = 
                        await new perfectoReporting.Perfecto.PerfectoReportingClient(perfectoExecutionContext);
    
             }catch(e)
            {
                console.log(e);
            }
            r={};
            r.drv=browser;
            r.rpt=reportingClient;
      callback(r);
    });
    beforeEach(async function(){
        await reportingClient.testStart(this.currentTest.title);
    });
    afterEach(async function(){
      if(this.currentTest.state === "passed")
          await reportingClient.testStop({status: perfectoReporting.Constants.results.passed});
      else if(this.currentTest.state === "failed")
        await reportingClient.testStop( {status: perfectoReporting.Constants.results.failed,
          message: this.currentTest.err.message
          });


    });

    body();

    // we should shut down browser when we don't need it anymore, in order to avoid
    // dead sessions. Always ensure that you are ending your session in the test end!
    after(function() {
      return browser.quit();
    });
  });
};