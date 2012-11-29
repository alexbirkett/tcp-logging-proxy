TCP Logging Proxy
===============
Listens to upstream connections from clients on the input port and forwards them to the server on the output port. Data sent from the client to the proxy is forwarded to the server and data sent from the server to the proxy is forwarded it to the client.

Motivation
========
This project was created to help debug the TCP based protocols commonly used by GPS tracking devices for the [Location IO project](https://github.com/alexbirkett/location.io)

Usage
=====
`node tcp-logging-proxy.js <input port> <output port> <host / ip address>`

Output
======
The upstream and downstream data is logged to the console. In addition data is logged to files in the output directory. The `.meta` files contain upstream and downstream data with meta information about when and in which direction the data was sent. The  `.upstream` files contains the raw upstream data, the `.downstream` files contain the downstream data. The file names are timestamps that relate to when the connection was established.


