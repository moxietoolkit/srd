const { exec } = require('child_process');
const path = require('path');

async function runScript(scriptPath) {
    return new Promise((resolve, reject) => {
        const fullPath = path.join(__dirname, scriptPath);
        console.log(`Running ${scriptPath}...`);
        
        exec(`node "${fullPath}"`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing ${scriptPath}:`, error);
                reject(error);
                return;
            }
            
            if (stderr) {
                console.error(`${scriptPath} stderr:`, stderr);
            }
            
            console.log(`${scriptPath} stdout:`, stdout);
            resolve();
        });
    });
}

async function buildSRD() {
    try {
        // First run merge-srd.js
        await runScript('./merge-markdown.js');
        console.log('Merge completed successfully!');

        // Then run convert-srd.js
        await runScript('./convert-srd.js');
        console.log('Build process completed successfully!');
    } catch (error) {
        console.error('Build process failed:', error);
        process.exit(1);
    }
}

buildSRD(); 