This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

-You will need to install npm with npm install.
-Use npm start to run the development server and view the project.

This was a project created during my time at AT&T using React.js. 

The purpose of the project was to make it easier for field managers to create attendance documents.
Before this tool, no standard system or tool was in place to create these documents that were required
each time an employee missed a day of work. 

The app pulls data from JSON APIs in the background when the user enters a userid. This will not work in this
version because that is proprietary data behind the AT&T firewall. 

As the user enters information, a 'document' is generated on the opposite side of the page. Once complete,
the user then downloads all of the entered information into a formatted PDF that is then printed and covered
with the employee. 