# Wiki Map

Wiki Map is a single-page application where users can create, edit, share, and favorite maps. They can categorize a map and place descriptive pins on their favorite locations. Users can also collaborate and add/edit pins on maps they didn't creat themselves.

This project was made using:
  - Front end:
    - HTML5, EJS, CSS3, SASS, JavaScript, jQuery, and AJAX.
  - Back end:
    - Node.js, Express.js, PostgreSQL

## Purpose

BEWARE: This project was built for learning purposes. It is not intended for use in production-grade software.

This project was created and published for our midterm project as part of our learnings at Lighthouse Labs.

## Dependencies

- Node
- npm 
- pg
- pg-native
- cookie-session
- dotenv
- body-parser
- chalk
- express
- ejs
- morgan
- node-sass-middleware

## Getting started

- Install all dependecies using the `npm install` command.
- Reset your local database using the `npm run db:reset` command.
- Run the development web server using the `npm run local` command.
- Head over to http://localhost:8080/ to get started!

## Features

- Non-logged in user can:
  - Browse maps created by other people.
- Logged-in user can:
  - Create, edit, share, and favorite maps.
  - Place pins on a map with a title, description, and image.
  - Edit and delete pins.
  - Collaborate on maps created by other users by placing, editing, or deleting pins.

## Future Goals

- Add a collaboration moderation system.
  - If a user edits a map they didn't create, the change can remain pending until the creator of that map accepts/rejects the change.
- Add a filter by location feature for maps.
- Add a favorited counter for each map.

## Final Product
