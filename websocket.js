//
      // This example shows a simple TCP echo server.
      // The server will listen on port 6789 and respond back with whatever
      // has been sent to the server.
      //
      function startSocket() {

      console.log("hello");
       //  Request permission to listen on port 6789
       navigator.tcpServerPermission.requestPermission({"localPort":6789}).then(
         () => {
           // Permission was granted

           //  Create a new server socket that listens on port 6789
           var myServerSocket = new TCPServerSocket({"localPort": 6789});

           // Listen for connection attempts from TCP clients.
           listenForConnections();
           function listenForConnections() {
             myServerSocket.listen().then(
                 connectedSocket => {
                 // A connection has been accepted

                   console.log ("Connection accepted from address: " +
                                 connectedSocket.remoteAddress + " port: " +
                                 connectedSocket.remotePort);

                   var reader = connectedSocket.readable.getReader();

                   // Wait for data
                   waitForData();
                   function waitForData () {
                     reader.read().then(
                       ({ value, done }) => {
                         if (done) return;

                         // Data in buffer, read it
                         console.log("Received: " + value);

                         // Send data back
                         connected.writeable.write(value).then(
                           () => console.log("Sending data succeeded"),
                           e => console.error("Failed to send: ", e);
                         });
                         // Continue to wait for data
                         waitForData ();
                       }
                     );

                   }

                   // Continue to listen for new connections
                   listenForConnections();
             },
                 e => {
                   console.error("A client connection attempt failed: ", e);

                   // Continue to listen for new connections
                   listenForConnections();
                 }

             );
           }

           // Log result of TCP server socket creation attempt.
           myServerSocket.opened.then(
             () => {
               console.log("TCP server socket created sucessfully");
             },
             e =>console.error("TCP server socket creation failed due to error: ", e);
           );

           // Handle TCP server closed, either as a result of the webapp
           // calling myServerSocket.close() or due to an error.
           myServerSocket.closed.then(
             () => {
                console.log("TCP server socket has been cleanly closed");
             },
             e => console.error("TCP server socket closed due to error: ", e);
           );

         },
         e => console.error("TCP Server Socket on local port 6789 was denied
                            due to error: ", e);
       );
             }
