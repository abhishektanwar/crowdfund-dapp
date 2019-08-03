const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');


// fs-extra is advanced version of defaulf fs module ,
// contains removeSync,ensureDIrSync etc
// logic to delete entire build folder if exits,
// build folder contains 


const buildPath = path.resolve(__dirname, 'build');
// fs.removeSync is responsible for deleting the build folder / path 
// specified in buildPath variable

fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(campaignPath, 'utf8');
const output = solc.compile(source,1).contracts;

// ensureDirSync is responsible for creating the new folder to save the compiled files

fs.ensureDirSync(buildPath);
// console.log(output);
for (let contract in output) {
    
    fs.outputJSONSync(
        path.resolve(buildPath, contract.replace(':','') + '.json'),
        output[contract]
    );
}
