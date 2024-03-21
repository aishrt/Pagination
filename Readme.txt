Description:
This project is a Task creation application designed for handling and managing tasks.
The project is connected with Mongodb for database. 

When project start it shows the landing  page  ,Task list page is accessible from header  ,
You can create tasks  , also  can Edit and Delete by options available on task list page  ,you can alos search  tasks by Title or Author's name  , 
Only 6 items are rendered through backend on task list page you can change then from input field on top left side Item per page , if more then 6 or entered blogs are added pagination will automatically start.


If you try to go to invalid Url it will shows an error page , with refresh option to redirect to landing page


Steps to install and run project :

1-> Clone the repository: git clone https://github.com/aishrt/Pagination.git
2-> Create env file same as env.example in both server and frontend
3-> Navigate to the project directory and install dependecy for backend: npm install --legacy-peer 
4-> Start the server using : npm start
5-> Navigate to the project frontend: cd frontend 
6-> Now install dependecy for frontend: npm install --legacy-peer 
7-> Run the frontend app using : npm start

Backend Dependencies:
axios: ^1.6.2 - HTTP client for making requests.
body-parser: ^1.20.1 - Middleware to parse HTTP request body.
cors: ^2.8.5 - Middleware for handling Cross-Origin Resource Sharing.
dotenv: ^16.3.1 - Module to load environment variables from a .env file.
express: ^4.18.2 - Web application framework for Node.js.
http-status: ^1.7.3 - HTTP status codes.
moment: ^2.29.4 - Library for handling dates and times.
mongodb: ^4.12.1 - Official MongoDB driver for Node.js.
mongoose: ^6.7.3 - MongoDB object modeling for Node.js.
nodemon: ^2.0.22 - Utility that monitors for changes and automatically restarts the server.

Frontend Dependencies : 
axios: ^1.6.2 - HTTP client for making requests.
bootstrap: ^5.2.2 - CSS framework.
dayjs: ^1.11.10 - Library for handling dates and times.
react: ^18.2.0 - JavaScript library for building user interfaces.
react-dom: ^18.2.0 - DOM-specific methods for React.
react-helmet-async: ^2.0.1 - Asynchronous version of React Helmet for managing document head.
react-hook-form: ^7.48.2 - Library for managing forms in React.
react-router-dom: ^6.20.0 - Declarative routing for React.js.
react-scripts: 5.0.1 - Configuration and scripts for Create React App.
react-toastify: ^9.1.3 - Notification library for React.
typescript: ^4.9.5 - Superset of JavaScript with static typing.



Author:
Aishwarya Raj Tyagi
#art

