# Medi-Flow Frontend

This README file will guide you through the steps to run the Medi-Flow frontend project and test its functionality.

## Prerequisites

- Node.js and npm installed on your machine
- JSON Server installed globally (`npm install -g json-server`)

## Steps to Run the Project


1. **Install Dependencies**
  ```bash
  npm install
  ```

2. **Start the JSON Server**
  ```bash
  json-server --watch db.json --port 3001
  ```

3. **Start the Frontend Application**
  ```bash
  npm start
  ```

4. **Access the Application**
  Open your web browser and navigate to `http://localhost:3000`. Note that the port number may vary depending on your configuration.

5. **Login to the Application**
  - Go to the login page.
  - Use the following credentials to log in:

  *Doctor*
    - **Username:** `doctor@gmail.com`
    - **Password:** `123`

  *Pharmacist*
    - **Username:** `pharmacist@gmail.com`
    - **Password:** `456`


