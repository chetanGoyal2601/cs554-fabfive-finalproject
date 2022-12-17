from pyotp import *
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import os
import json
from flask import Flask, request, jsonify
app = Flask(__name__)


prod = False

@app.route('/', methods=["POST"])
def testpost():
    input_json = request.get_json(force=True)
    dictToReturn = {'username':input_json['username']}
    data = dictToReturn['username']
    mamba=0
    usernameStr = 'rgundam'
    passwordStr = 'contactrohitforpassword'


    email = data
    # production code

    if prod:
        chrome_options = webdriver.ChromeOptions()
        chrome_options.binary_location = os.environ.get("GOOGLE_CHROME_BIN")
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--no-sandbox")
        browser = webdriver.Chrome(executable_path=os.environ.get("CHROMEDRIVER_PATH"), options=chrome_options)
    else:
        options = Options()
        options.add_argument('--headless')
        options.add_argument('--disable-gpu')
        browser = webdriver.Chrome('/Users/rohit_gundam/Downloads/chromedriver-2',options=options)
        browser = webdriver.Chrome('/Users/rohit_gundam/Downloads/chromedriver-2')

    browser.get(('https://web.stevens.edu/peoplefinder/'))

    username = browser.find_element_by_id('okta-signin-username')
    username.send_keys(usernameStr)

    password = browser.find_element_by_id('okta-signin-password')
    password.send_keys(passwordStr)


    signInButton = browser.find_element_by_id('okta-signin-submit')
    signInButton.click()

    time.sleep(3)


    inputElement = browser.find_element_by_id("input67").find_element_by_xpath("//input[@type='tel']")


    totp = TOTP("AUACFZ27LHXRIFGS")
    token = totp.now()


    inputElement.send_keys(token)

    browser.find_element_by_css_selector(".button-primary[value='Verify']").click()

    time.sleep(3)

    inputElement = browser.find_element_by_id("people-finder").find_element_by_xpath("//input[@type='text']")

    inputElement.send_keys(email)


    inputElement.submit()

    time.sleep(3)
    table_header = browser.find_elements(By.XPATH,"//table[not(@id)]//th")

    header_row = []
    for header in table_header:
        header_row.append(header.text)



    table_data = browser.find_elements(By.XPATH,"//table[@id]/tbody/tr")
    table_row = []
    for row in table_data:

        columns = row.find_elements(By.XPATH,"./td")

        for column in columns:
            table_row.append(column.text)

    names = table_row[::4]
    emails = table_row[3::4]

    print('input: '+email)
    print(names)
    print(emails)
    mamba = "User validation has been failed"
    for i, emailString in enumerate(emails):
        m = emailString.split("\n")
        l = ""
        for j in range(len(m)):
            if m[j].startswith("E"):
                l = m[j]
                break
        print(i, l)
        if l[7:] == email:
            print(l[7:])
            #print("Welcome ",table_row[0])
            mamba = "Welcome " + names[i]
            #print("You have been validated")
            break
    return jsonify(mamba)

