It looks like you’ve laid out a comprehensive setup guide for your project. Here's a condensed version with all the steps in order:

1. **Install Wamp Server**
   - Download and install Wamp Server from [WampServer's official website](https://www.wampserver.com/en/).

2. **Install VS Code**
   - Download and install Visual Studio Code from [Visual Studio Code's official website](https://code.visualstudio.com/).

3. **Install Node.js and Add to PATH**
   - Download and install Node.js from [Node.js's official website](https://nodejs.org/).
   - Ensure Node.js is added to your system PATH (this usually happens automatically).

4. **Start Wamp Server**
   - Launch Wamp Server from your Start Menu or desktop shortcut.

5. **Access phpMyAdmin**
   - Open a web browser and go to: [http://localhost/phpmyadmin/](http://localhost/phpmyadmin/)
   - Log in with username: `root` and leave the password field empty.

6. **Manage Databases in phpMyAdmin**
   - On the left side, you’ll see options like "list of databases" and "new".
   - If a database named "medsched" exists, select it, go to the "Operations" tab, and delete it.
   - Create a new database named "medsched".

7. **Import Database**
   - Select the newly created "medsched" database.
   - Import the database from your project directory.

8. **Open Project in VS Code**
   - Open Visual Studio Code.
   - Open your project folder in VS Code.

9. **Setup Backend**
   - Open a new terminal in VS Code (Ctrl + `).
   - Change directory to the backend folder: `cd backend`.
   - Install dependencies: `yarn install`.

10. **Setup Frontend**
    - Open a new terminal in VS Code.
    - Change directory to the frontend folder: `cd frontend`.
    - Install dependencies: `yarn install`.

11. **Start Backend and Frontend Concurrently**
    - Open a new terminal in VS Code.
    - Change directory to the backend folder: `cd backend`.
    - Start the backend: `yarn run dev`.

12. **Access Your Project**
    - Open a web browser and go to: [http://localhost:3000](http://localhost:3000).

This should set up your development environment with both backend and frontend running concurrently. If you encounter any issues, let me know via whatsapp +254745566505

git remote add origin https://github.com/felixomundi/medsched.git


git rm --cached Comprehend.docx
git rm --cached Backups/Comprehend.docx
