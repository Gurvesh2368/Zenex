import https from 'https';

const urls = [
  { slug: 'pm-kisan', url: 'https://pmkisan.gov.in/' },
  { slug: 'ab-pmjay', url: 'https://beneficiary.nha.gov.in/' },
  { slug: 'pm-ujjwala', url: 'https://www.pmuy.gov.in/' },
  { slug: 'atal-pension', url: 'https://www.npscra.nsdl.co.in/scheme-details.php' },
  { slug: 'ignoaps-old-age', url: 'https://nsap.nic.in/' },
  { slug: 'pm-matru-vandana', url: 'https://pmmvy.wcd.gov.in/' },
  { slug: 'sukanya-samriddhi', url: 'https://www.indiapost.gov.in/' },
  { slug: 'pm-vishwakarma', url: 'https://pmvishwakarma.gov.in/' },
  { slug: 'post-matric-sc', url: 'https://scholarships.gov.in/' },
  { slug: 'stand-up-india', url: 'https://www.standupmitra.in/' }
];

for (const item of urls) {
  try {
    const req = https.request(item.url, {
      method: 'HEAD',
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      rejectUnauthorized: false,
      timeout: 6000
    }, (res) => {
      console.log(`${item.slug}: HTTP ${res.statusCode} (target: ${item.url})`);
    });
    req.on('error', (err) => {
      console.log(`${item.slug}: ERROR ${err.message}`);
    });
    req.on('timeout', () => {
      req.destroy();
      console.log(`${item.slug}: TIMEOUT`);
    });
    req.end();
  } catch (e) {
    console.log(`${item.slug}: EXCEPTION ${e.message}`);
  }
}
