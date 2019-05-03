This folder contains all the SERVER side code.

This half of the project is a Node.js REST API accessing
a Microsoft SQL Server Express DataBase on the same physical server (port 8080).

The API is nothing more than a wrapper for making Database calls,
the API does *NOT* serve the client code (e.g the index.html, css, and JS downloaded
the users browser upon navigating to our site, http://listed.ddns.net), 
it serves DATA as JSON (data on demand)

For serving client FILES we are using a simple IIS Webserver (port 80)
 - this could be done with Apache, Nginx etc. Serving simple static HTML,CSS
and JS files is easy, and could even be done with an Amazon S3 bucket these days.

Please reference Architecture_Flow.txt for a high level idea of flow