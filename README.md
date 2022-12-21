# if all requirements are already met - run the follwoing commands from the project folder -

npm install - this is will install node modules in both server and client

npm start - this is will start server for both backend and frontend

# Server runs on -
http://localhost:8000/

# Client runs on -
http://localhost:3000/

# MongoDB - (ATLAS) uri -

serverUrl - mongodb+srv://web2project:5Kh4usBMnmzZPFvj@cluster0.eqpuwlr.mongodb.net/?retryWrites=true&w=majority
database - cs_554_web_project

(DATA has already been fed into ATLAS for testing)

# Testing - 
LOGIN CREDENTIALS

username - rgundam@stevens.edu

password - Rohit123


username - apala1@stevens.edu

password - Anudeep123


username - dparikh7@stevens.edu

password - Devshree123


username - cgoyal@stevens.edu

password - Chetan123

username - jdias@stevens.edu

password - Jefferson123


----------------------------------------------------------

# Mandatory Requirements - 

Node version 18.11.0

MongoDB

Redis

# Optional Requirements -(To test python selenium on local device which is also hosted on heroku) 

Python

Python selenium, flask Dependencies

Chromedriver (version compatible with chrome browser version)

----------------------------------------------------------

# Installation of Mandatory Requirements - 

## Xcode installation -

sudo xcode-select –install

## Home brew installation -

/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

## Node installation - version 18.11.0

brew install node

## Redis installation -

brew install redis

## MongoDB installation - (if not present already)
### If you still have the old mongodb installed from homebrew-core

brew services stop mongodb

brew uninstall homebrew/core/mongodb

### Use the migrated distribution from custom tap

brew tap mongodb/brew

brew install mongodb-community

brew services start mongodb-community

## Start mongodb server-

brew services start mongodb-community

## Start Redis -

brew services start redis

----------------------------------------------------------

# Installation of Optional Requirements - (To test python selenium on local device which is also hosted on heroku)

## pip installation 
brew install brew-pip

## Python

brew install python3

## install python dependencies 

Go into the python-selenium-heroku folder and execute the below command 
pip install -r requirements.txt

## Chrome driver installation -

Download the appropriate chromedriver version from below link based on chrome browser version
https://chromedriver.chromium.org/downloads

## Changes to be made in python-selenium-heroku folder to run on local machine

Step 1- Downgrade my.stevens.edu account from okta verify to google authenticator

Step 2- When logging in first time after downgrading extract the secret key from the Google authenticator QR code

In app.py

Step 3 - Change the path in line number 40 and 41 to the chromedriver downloaded earlier

Step 4- Replace the secret key on line number 61 with your extracted on step 2

Step 5- Provide your stevens username and password on line 22 and 23 

Run using the command flask run app.py

----------------------------------------------------------


### Note - The above commands are to be executed in terminal app on Mac OS only for windows please google the equivalent commands or download from the links provided of websites below

Redis - https://redis.io/download/

MongoDB -https://www.mongodb.com/try/download/community

Node download -https://nodejs.org/en/download/

Python download -https://www.python.org/downloads/

Chrome Driver - https://chromedriver.chromium.org/downloads

