Razz Fox
razzfox.me

## Development Assumptions

- Using React development web server for convenience (not a production solution).
- Using NPM to manage dependencies and to run the development server.
- Not using a database or back end API to persist or fetch data.
- Not using Redux, but larger projects benefit from a state management library.
- Not using PropTypes, but it is useful to guarantee correct data types.

## Functionality Notes

- App auto-selects the first company in the list.
- Shows the Dashboard by default.
- Changing company maintains the view (dashboard or robots).
- Gets the company ID from the route (URL).
- App can be loaded directly to a particular route (e.g. /c2/robots); this works on the development server because it loads the app unconditionally (on all URL paths), but a web server configured to serve static files would not serve the app at any route by default.
- Back and forward navigation buttons work correctly.
- Add Robot Tray location is a drop-down selector with a few predefined locations.
- The dashboard and robot lists scroll when content is long, and the nav stays fixed.
- First input is focuses when the Add Robot Tray is opened, so entering data is faster.

## Running the Demo

- Navigate to the unzipped project directory in a terminal.
- Make sure that dependencies are installed, `npm install`.
- Run `npm start`, which should open a browser to: [http://localhost:3000](http://localhost:3000)
