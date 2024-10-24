
<body>
    <h1>ExpenseTracker</h1>

   <p>Welcome to the ExpenseTracker application. This project is built using the MERN stack with Context API for state management and styled with Tailwind CSS. The application allows users to manage their expenses efficiently with authentication and profile management features.</p>

  <h2>Features</h2>
    <div class="section">
        <h3>User Authentication</h3>
        <ul>
            <li>Signup: New users can create an account.</li>
            <li>Login: Registered users can log in with their credentials.</li>
            <li>Forgot Password: Users can request a password reset link if they forget their password.</li>
            <li>Reset Password: Users can reset their password using the reset link sent via email.</li>
        </ul>
   </div>

  <div class="section">
        <h3>Expense Management</h3>
        <ul>
            <li>Add Expense: Users can add a new expense by providing a description, amount, category, and payment method.</li>
            <li>Edit Expense: Users can edit the details of an existing expense.</li>
            <li>Delete Expense: Users can remove an expense from their list.</li>
            <li>View Expenses: Users can view a list of their expenses, categorized by what they spent on.</li>
        </ul>
    </div>

  <div class="section">
        <h3>Profile Management</h3>
        <ul>
            <li>Update Profile: Users can update their profile information such as name, email, and profile picture.</li>
            <li>Update Password: Users can change their password from the profile settings.</li>
            <li>Delete Profile: Users have the option to delete their account permanently.</li>
        </ul>
    </div>

  <h2>Tech Stack</h2>

   <ul>
        <li><strong>MERN Stack:</strong> MongoDB, Express.js, React.js, Node.js</li>
        <li><strong>Context API:</strong> For state management across the application</li>
        <li><strong>Tailwind CSS:</strong> For responsive and modern UI styling</li>
    </ul>

   <h2>How to Run the Project</h2>

  <div class="section">
        <p>To run the project locally, follow these steps:</p>
        <pre>
1. Clone the repository:
   <code>git clone https://github.com/your-repo/ExpenseTracker.git</code>

2. Install dependencies for both client and server:
   <code>cd client && npm install</code>
   <code>cd ../server && npm install</code>

3. Create a <code>.env</code> file in the server directory with the following variables:
   <code>MONGO_URI, JWT_SECRET, EMAIL_API_KEY</code>

4. Run both the client and server:
   <code>npm run dev</code>

5. Open your browser and navigate to <code>http://localhost:3000</code>
        </pre>
    </div>

    <h2>License</h2>
    <p>This project is licensed under the MIT License.</p>

</body>
</html>
