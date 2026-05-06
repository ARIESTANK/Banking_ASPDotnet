# 📘 Banking System (ASP.NET Core MVC)

A full-stack **Banking Management System** built using **ASP.NET Core MVC** that simulates real-world banking operations such as account creation, secure login authentication, balance checking, deposits, withdrawals, and transaction history tracking. The system follows a layered architecture (Controller → Service → Repository → Database) to ensure clean code structure, scalability, and maintainability. It is designed as a learning and portfolio-level project to demonstrate backend development skills using the .NET ecosystem, including CRUD operations, session management, authentication, and financial transaction workflows. Users can register and log in securely, manage their bank accounts, perform transactions, and view their account history, while administrators can oversee user accounts and system data. The project integrates with a relational database (such as SQL Server or similar) to store user and transaction data efficiently and securely. This system also emphasizes basic banking logic such as validation of balances before withdrawals, transaction logging for accountability, and structured data handling for financial records. It is suitable for understanding enterprise-level application design in ASP.NET Core and serves as a strong foundation for building more advanced fintech or banking applications.

## 🚀 Features
- User registration and login system with authentication  
- Secure session-based access control  
- Account balance management (deposit & withdraw)  
- Transaction history tracking  
- Basic banking validation rules (insufficient balance prevention)  
- Admin/user role separation (if implemented)  
- Clean layered architecture design  
- Database integration for persistent storage  

## 🛠️ Tech Stack
- ASP.NET Core MVC  
- C# Programming Language  
- Entity Framework Core  
- SQL Server (or compatible relational database)  
- HTML, CSS, Bootstrap (for UI)  
- Visual Studio / VS Code  

## ⚙️ Installation & Setup
Clone the repository using: `git clone https://github.com/ARIESTANK/Banking_ASPDotnet.git`, then open the solution file in Visual Studio, restore NuGet packages, configure the database connection string in `appsettings.json`, run Entity Framework migrations if required, and start the application using IIS Express or `dotnet run`. Once running, the application will be accessible in your browser where you can register users, log in, and perform banking operations.

## 🎯 Purpose
This project is built to practice real-world backend development concepts in ASP.NET Core, focusing on secure authentication, financial transaction handling, database management, and layered architecture design, making it a strong portfolio project for demonstrating enterprise-level application development skills.

## 👨‍💻 Author
Developed by Aries KKL

## ⭐ Future Improvements
- Role-based admin dashboard  
- Advanced transaction reports and analytics  
- Email/SMS notifications for transactions  
- REST API version using ASP.NET Core Web API  
- Improved UI with modern frontend framework  
