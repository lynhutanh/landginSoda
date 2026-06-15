const fs = require('fs');
const path = require('path');
const https = require('https');
const { URL } = require('url');

const videos = [
  {
    url: 'https://videos.pexels.com/video-files/4859062/4859062-uhd_2560_1440_25fps.mp4',
    filename: 'sneaker_street.mp4'
  },
  {
    url: 'https://videos.pexels.com/video-files/4066224/4066224-uhd_2560_1440_30fps.mp4',
    filename: 'streetwear_runway.mp4'
  },
  {
    url: 'https://videos.pexels.com/video-files/6090150/6090150-uhd_2560_1440_25fps.mp4',
    filename: 'street_walk.mp4'
  },
  {
    url: 'https://videos.pexels.com/video-files/4859074/4859074-uhd_2560_1440_25fps.mp4',
    filename: 'sneaker_closeup.mp4'
  }
];

const targetDir = path.join(__dirname, '../user/public');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function downloadFile(videoUrl, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const parsedUrl = new URL(videoUrl);
    const options = {
      protocol: parsedUrl.protocol,
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    };

    https.get(options, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Handle redirect
        file.close();
        downloadFile(response.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (response.statusCode !== 200) {
        file.close();
        fs.unlink(dest, () => {});
        reject(new Error(`Failed to get '${videoUrl}' (Status Code: ${response.statusCode})`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${path.basename(dest)}`);
        resolve();
      });
    }).on('error', (err) => {
      file.close();
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function main() {
  console.log('Starting download of video assets with User-Agent...');
  for (const video of videos) {
    const dest = path.join(targetDir, video.filename);
    try {
      await downloadFile(video.url, dest);
    } catch (err) {
      console.error(`Error downloading ${video.filename}:`, err.message);
    }
  }
  console.log('All downloads finished.');
}

main();
