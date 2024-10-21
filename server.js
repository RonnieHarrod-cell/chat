const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

// Create an Express application
const app = express();

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Create an HTTP server
const server = http.createServer(app);

// Create a WebSocket server
const wss = new WebSocket.Server({ server });

// Store connected clients
const clients = [];

// Handle WebSocket connections
wss.on('connection', (ws) => {
    clients.push(ws);

    ws.on('message', (message) => {
        // If message is a Buffer, convert it to a string
        const messageString = Buffer.isBuffer(message) ? message.toString() : message;

        // Log received messages for debugging
        console.log('Received message:', messageString);

        // Broadcast received message to all clients
        clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(messageString);  // Send the original message as a string
            }
        });
    });

    ws.on('close', () => {
        // Remove the client from the array on disconnect
        const index = clients.indexOf(ws);
        if (index !== -1) {
            clients.splice(index, 1);
        }
    });
});

// Start the server
const PORT = 12345;
server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
