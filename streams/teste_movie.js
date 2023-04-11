import express from 'express';
const app = express();
import range from 'range-parser';
import fs from 'fs';

const moviePath = 'D:/Documentos/Video/PYTHON/FastAPI - A python framework _ Full Course.mp4';
const port = 3000;

app.get('/movie', (req, res) => {
  const stat = fs.statSync(moviePath);
  const fileSize = stat.size;
  const rangeRequest = req.headers.range;

  if (rangeRequest) {
    const parts = range(fileSize, rangeRequest);
    const start = parts[0].start;
    const end = parts[0].end;

    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': end - start + 1,
      'Content-Type': 'video/mp4'
    });

    const stream = fs.createReadStream(moviePath, { start, end });

    stream.on('open', () => stream.pipe(res));
    stream.on('error', (streamErr) => res.end(streamErr));
  } else {
    res.writeHead(200, {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4'
    });

    const stream = fs.createReadStream(moviePath);

    stream.on('open', () => stream.pipe(res));
    stream.on('error', (streamErr) => res.end(streamErr));
  }
});

app.listen(port, () => {
  console.log(`Streaming server listening on port ${port}`);
});
