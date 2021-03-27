const http = require('http');
const port = 3200;

const server = http.createServer( (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-type', 'text/plain');
    //res.setHeader('Content-type', 'application/json');
    res.end(`<html>
    <head></head>
    <body>Czesc</body>
    </html>`);
});

server.listen(port, '127.0.0.1', () => {
    console.log('Serwer wystartowal na porcie' + port);
});