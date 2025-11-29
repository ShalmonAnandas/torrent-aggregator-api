const fs = require('fs');
const path = require('path');
const https = require('https');

const STATUS_URL = 'https://aggregatorapi.shalmon.site/status';
const README_PATH = path.join(__dirname, '..', 'README.md');

const fetchStatus = () => {
    return new Promise((resolve, reject) => {
        https.get(STATUS_URL, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
};

const generateTable = (statusData) => {
    // statusData is expected to be { data: [ { name: '...', status: 'working'|'failed', results: 0, latency: 0 }, ... ] }

    const providers = statusData.data || [];

    // Sort providers by name for consistency
    providers.sort((a, b) => a.name.localeCompare(b.name));

    const rows = providers.map(provider => {
        const statusIcon = provider.status === 'working' ? '✅' : '❌';
        const displayName = provider.name.charAt(0).toUpperCase() + provider.name.slice(1);
        const results = provider.results !== undefined ? provider.results : '-';
        const latency = provider.latency !== undefined ? `${provider.latency}ms` : '-';

        return `| ${displayName} | ${statusIcon} | ${results} | ${latency} |`;
    });

    return rows.join('\n');
};

const updateReadme = async () => {
    try {
        console.log('Fetching status...');
        const statusData = await fetchStatus();
        console.log('Status fetched.');

        const newTableContent = generateTable(statusData);

        console.log('Reading README.md...');
        let readmeContent = fs.readFileSync(README_PATH, 'utf8');

        const startMarker = '<!-- STATUS_TABLE_START -->';
        const endMarker = '<!-- STATUS_TABLE_END -->';

        const startIndex = readmeContent.indexOf(startMarker);
        const endIndex = readmeContent.indexOf(endMarker);

        if (startIndex === -1 || endIndex === -1) {
            console.error('Markers not found in README.md');
            process.exit(1);
        }

        const before = readmeContent.substring(0, startIndex + startMarker.length);
        const after = readmeContent.substring(endIndex);

        const newReadmeContent = `${before}\n${newTableContent}\n${after}`;

        console.log('Writing to README.md...');
        fs.writeFileSync(README_PATH, newReadmeContent);
        console.log('README.md updated successfully.');

    } catch (error) {
        console.error('Error updating README:', error);
        process.exit(1);
    }
};

updateReadme();
