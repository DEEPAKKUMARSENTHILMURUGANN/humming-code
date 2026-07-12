const fs = require('fs');
const path = require('path');
const logPath = 'C:\\Users\\PANDA\\.gemini\\antigravity-ide\\brain\\55a08ea2-41a5-430b-9032-8a8707f2b9cc\\.system_generated\\logs\\transcript_full.jsonl';
const lines = fs.readFileSync(logPath, 'utf8').split('\n');

for(let line of lines) {
    if (line.includes('"TargetContent"') && line.includes('"step_index":546')) {
        const obj = JSON.parse(line);
        const calls = obj.tool_calls;
        if (calls && calls[0] && calls[0].args && calls[0].args.TargetContent) {
            let content = calls[0].args.TargetContent;
            // The TargetContent is what I tried to match, which was the bottom of the file (spaces included).
            fs.writeFileSync('extracted.css', content, 'utf8');
            console.log('Extracted ' + content.length + ' characters');
            
            // Try to de-space it just in case
            let despaced = content.replace(/ \x00|\x00 /g, '').replace(/ /g, ''); // Not entirely accurate, let's just strip nulls
            fs.writeFileSync('extracted_despaced.css', content.replace(/\x00/g, ''), 'utf8');
        }
    }
}
