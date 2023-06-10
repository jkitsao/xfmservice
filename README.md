## Online Radio with Node.js Streams

This project demonstrates how to build an online radio using Node.js streams. It utilizes various modules and libraries to handle streaming, random song selection, and broadcasting to multiple listeners.

### Features

- Random Song Selection: The application randomly selects songs from a catalog, which includes both regular and alternative songs, and plays them in a loop.
- Streaming to Listeners: Listeners can connect to the server and stream the currently playing song in real-time.
- Throttling: The streaming is throttled based on the bitrate of the song to ensure smooth playback and efficient data transfer.
- Now Playing Information: The server provides an endpoint to retrieve the currently playing song, along with the number of current listeners.

### Prerequisites

- Node.js and npm should be installed on your system.

### Installation

1.  Clone the repository: `git clone [<repository-url>](https://github.com/jkitsao/xfmservice.git)`
2.  Navigate to the project directory: `cd online-radio-nodejs-streams`
3.  Install the dependencies: `yarn add`

### Usage

1.  Start the server: `node server.js`
2.  Open a web browser and visit `http://localhost:8080` to confirm that the server is up and running.
3.  Connect to the online radio by opening the streaming URL `http://localhost:8080/listen` in a media player that supports streaming.

### API Endpoints

- `GET /listen`: Connect to the streaming endpoint to listen to the currently playing song.
- `GET /playing`: Retrieve information about the currently playing song, including the number of current listeners.

### Customization

- Catalogue: You can customize the songs in the `DB.catalogue` and `alt_catalogue` arrays in the `db/db.js` and `db/alternative.js` files, respectively.
- Port: The server runs on port 8080 by default. You can modify the `PORT` variable in the `server.js` file to use a different port.

### License

This project is licensed under the [MIT License](https://choosealicense.com/licenses/mit/).

### Acknowledgements

This project utilizes various open-source libraries and modules, including Express, underscore, Throttle, and more. Special thanks to the developers and contributors of these tools.

### Contributing

Contributions are welcome! If you find any issues or have suggestions for improvement, please feel free to open an issue or submit a pull request.

### Authors
Jackson Kitsao

