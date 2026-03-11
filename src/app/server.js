const express = require('express');
const next = require('next');
const { createServer } = require('http');
const { Server } = require('ws');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();

    server.get('*', (req, res) => {
        return handle(req, res);
    });

    const httpServer = createServer(server);
    const wss = new Server({ server: httpServer });

    wss.on('connection', (ws) => {
        console.log('Client connected');

        ws.on('message', (message) => {
            console.log(`Received message => ${message}`);
        });

        ws.on('close', () => {
            console.log('Client disconnected');
        });

        // // Simulate stock price updates
        // setInterval(() => {
        //     const stockData = JSON.stringify({
        //         symbol: 'AAPL',
        //         price: (Math.random() * 1000).toFixed(2)
        //     });
        //     ws.send(stockData);
        // }, 1000);
    });

    const port = process.env.PORT || 3000;
    httpServer.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${port}`);
    });
});
