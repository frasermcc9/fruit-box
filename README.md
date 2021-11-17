# Fruit Box
Welcome to Fruit Box! This is a game where you match apples to sums of 10.

The game can be played [here](https://amogusapple.web.app/)

## Running Locally
Requirements:
- Node.js 12 or above

### Building the app

Navigate into the `fruitbox` directory and run the following commands:
```bash
# Install dependencies
npm ci
# Build the app
npm run build
```

This will create the 'build' directory. This contains all the static files needed. You then need to serve this directory. One way of doing this is by using the simple `serve` command. 

```bash
npm i -g serve
serve ./build
```

This will serve the app on port 5000.

### Building the API
Requirements:
- Node.js 12 or above
- MongoDB
- Questionable sanity

Navigate into the 'server' directory. This contains the code for a Node server that will serve the api requests. It can be build with the following commands:
```bash
# Install dependencies
npm ci
# Build and run the API
npm run clean-deploy
```

For the database connection to be running, the MongoDB service must be running. The `mongod` command can be used to start the database in the foreground of a terminal.

## Hosting guide
This will contain the instructions needed to host the app on a VPS.

### Static Hosting
The app is static and therefore can be hosted for free, such as with Firebase hosting or Github pages.

The steps for using Firebase hosting are roughly as follows:
- Create a Firebase project in the firebase console
- Enable hosting in the Firebase project
- Install the `Firebase CLI` package from `npm`
- Login to Firebase via the CLI
- Use `firebase init hosting` inside the app directory
  - Use an existing project and select the one you created
  - Use `build` as your public directory
  - Select `yes` for rewriting URLS
- You can now run `firebase deploy` to deploy the static context to firebase hosting.

### Hosting the API
This will contain the instructions needed to host the API on a VPS, such as a DigitalOcean droplet.

I recommend following the [guide here](https://coderrocketfuel.com/article/deploy-a-nodejs-application-to-digital-ocean-with-https) to deploy the API, up until the 'Create Application' step.

Note on the step where you run `sudo apt install python-certbot-nginx`, the package should actually be `python3-certbot-nginx`.

Once at the step where you need to create the application, first install MongoDB. Follow the instructions [here](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/) to install MongoDB (steps 1-4) and then scroll down and follow steps 1 and 2 in the run MongoDB section.

Once MongoDB is installed and running, download and build the API source code with the instructions below:

```bash
cd ~
```
```bash
git clone https://github.com/frasermcc9/fruit-box.git
```
```bash
cd server
```
```bash
npm ci
```
```bash
npm run build
```
This will create the files to serve inside the ./build directory. Next we need to run it. Using PM2 will ensure the server is running in the background, and will restart if it crashes.

```bash
sudo npm i -g pm2
```

To run with PM2, use the following:
```bash
NODE_ENV=production pm2 start ./build/index.js
```

For the rest of the deployment steps, continue on from the above tutorial in the `Start Application` section, from the `pm2 startup systemd` command.
