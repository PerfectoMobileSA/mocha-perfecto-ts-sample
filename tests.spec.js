var sel      = require('selenium-webdriver');
let expect = require('chai').expect; // include chai assrtions lib
let describeWithPerfecto = require('../PerReportHelper.js'); // include Perfecto reporter helper
var drv;
describeWithPerfecto(      // PerfectoReportingDescribe
    'iOS caculator tests',  // suite name
b=>{drv=b.drv;rpt=b.rpt;},  //callback to launch webdriver and perfectoreporting client
function(){
    describe('iOS caculator tests', async function() {
       
        var i=0;
        
        while (i++ < 5) { // repetitive tests
          it(' test and verify 1 + 2 = 3',  async function() {
                
                await drv.findElement(sel.By.xpath('//*[@label="1"]')).click();
                await drv.findElement(sel.By.xpath('//*[@label="add"]')).click();
                await drv.findElement(sel.By.xpath('//*[@label="2"]')).click();
                await drv.findElement(sel.By.xpath('//*[@label="equals"]')).click();
                expect(await drv.findElement(sel.By.xpath('//*[@label="Result"]')).getText()).to.be.equal('3');
              
          });
    
          it(' test and verify 3 - 2 = 1', async function(){
              await drv.findElement(sel.By.xpath('//*[@label="3"]')).click();
              await drv.findElement(sel.By.xpath('//*[@label="subtract"]')).click();
              await drv.findElement(sel.By.xpath('//*[@label="2"]')).click();
              await drv.findElement(sel.By.xpath('//*[@label="equals"]')).click();
              expect(await drv.findElement(sel.By.xpath('//*[@label="Result"]')).getText()).to.be.equal('1');
            
          });
        }
      
        
    });

}
);

