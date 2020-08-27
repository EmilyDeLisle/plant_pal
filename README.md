# Plant Pal
(Take two)

This application is a redesign of my previous JavaScript- and [jQuery](https://jquery.com/)-based plant-watering app, **Plant Pal**. For this project, I wanted to utilize the skills I'd gained and technologies I've learned thus far in the Computer Systems Technology program at BCIT as well as what I'd learned during co-op as a junior frontend engineer at [Grow Technologies](https://www.linkedin.com/company/poweredbygrow) (acquired by [ATB Financial](https://www.atb.com/)).

The problem I ran into with the first version of **Plant Pal** was that as I acquired more and more plants (that didn't die!), I found it difficult to find them in the long list of plants, as there was no way to sort or search for them. I ended up switching over to using a spreadsheet, as I could then sort by name and date last watered. This still wasn't ideal, as while I could sort the plants by the amount of days since I last watered them, some plants, like succulents, really didn't need to be watered as often as, say, my *very* needy peace lily.

Enter **Plant Pal (version 2)**. This version of **Plant Pal** is completely rebuilt and uses almost the entire suite of products from [Firebase](https://firebase.google.com/), including [Cloud Firestore](https://firebase.google.com/products/firestore), [Cloud Functions](https://firebase.google.com/products/functions), [Authentication](https://firebase.google.com/products/auth), [Storage](https://firebase.google.com/products/storage), and [Hosting](https://firebase.google.com/products/hosting). This time, I built the frontend in [TypeScript](https://www.typescriptlang.org/) using [React](https://reactjs.org/) and [Material-UI](https://material-ui.com/) for the user interface and [MobX](https://mobx.js.org/) for state management. I also used [Moment.js](https://momentjs.com/) to help with formatting some of the dates and to calculate time differences. Firebase provides the API to interact with the database in Cloud Firestore, and I added a couple Cloud Functions to do some additional backend work, like calculating watering and fertilizing intervals.

The new-and-improved **Plant Pal** now calculates watering *and* fertilizing dates and intervals. Plants can be searched for and sorted in several different ways. The app sorts, by default, plants that require water most urgently based on their specific watering needs (using their average watering interval), rather than just by time since last watered. It can also sort the list of plants by name or date last fertilized or watered.

Users can upload images of their plants, as well as edit all the plant's details, including the name, image, and watering and fertlizing events. The app is fully responsive, and will accept images taken on a user's phone as well as uploaded from their computer.

Building **Plant Pal 2** has been especilly rewarding as I can really see how far I've come since I built the first version. It's also made a huge difference in my plant-watering routine!

--

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
