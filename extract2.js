const fs = require('fs');
const path = require('path');
const logPath = 'C:\\Users\\PANDA\\.gemini\\antigravity-ide\\brain\\55a08ea2-41a5-430b-9032-8a8707f2b9cc\\.system_generated\\logs\\transcript_full.jsonl';
const lines = fs.readFileSync(logPath, 'utf8').split('\n');

for(let line of lines) {
    if (line.includes('"TargetContent"') && line.includes('"step_index":528')) {
        const obj = JSON.parse(line);
        const calls = obj.tool_calls;
        if (calls && calls[0] && calls[0].args && calls[0].args.ReplacementContent) {
            fs.writeFileSync('step528.txt', calls[0].args.ReplacementContent, 'utf8');
            console.log('Extracted to step528.txt');
        }
    }
}
