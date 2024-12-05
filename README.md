# Crop Monitoring System

**Green Shadow (Pvt) Ltd**  
Station Road, Matale, Sri Lanka  

---

## Overview
The **Crop Monitoring System** is a comprehensive solution developed for **Green Shadow (Pvt) Ltd**, a mid-scale farm specializing in root crops and cereals. The system is designed to manage the company's growth by systemizing key areas, including fields, crops, staff, equipment, vehicles, and monitoring logs.  

The frontend is implemented using **HTML**, **CSS**, **Bootstrap**, **JavaScript**, and **jQuery**, while the backend is connected via **AJAX** with **JWT** (JSON Web Token) authentication for secure user validation. The system ensures seamless interaction between users and the database with role-based access control.

---

## Features

### User Access
- **User Roles**:
  - **Manager**: Full CRUD access to all entities.
  - **Administrative**: Restricted from editing crop, field, and monitoring log details.
  - **Scientist**: Restricted from modifying staff, vehicle, and equipment data.
- **Sign-in and Sign-up Pages**: Secure login system using JWT.
- **Role-Based Dashboard**:
  - Includes data analytics and a pie chart.
  - Displays sections for crops, vehicles, fields, equipment, logs, and staff.

### Core Functionalities
1. **Field Management**:  
   - Manage land allocated for specific crops.  
   - Add, edit, view, and delete field details.

2. **Crop Management**:  
   - Track crop type, growth stages, total extent, and field observations.  
   - Perform spatial and temporal data analysis.

3. **Staff Management**:  
   - CRUD operations for staff details like designation, roles, and contact.  
   - Assign staff to monitoring operations.

4. **Monitoring Logs**:  
   - Log observations and activities for fields and crops.  
   - View detailed logs in a read-only format.

5. **Equipment and Vehicle Management**:  
   - Manage and track vehicles and agricultural equipment.  
   - Perform relational analysis for labor and driver allocations.

6. **Search and View Features**:  
   - Use the search bar to filter database records.  
   - Load all data dynamically into interactive cards.  
   - Cards provide buttons to view, edit, and delete records.

### Additional Functionalities
- **Input Validation**:
  - Implemented using **Regex** for fields such as email, contact numbers, and names.
  - Provides real-time feedback to users on invalid input.
- **Form Pop-Ups**:
  - Intuitive form pop-ups for adding or editing details on relevant pages.
  - Ensures seamless and user-friendly interaction.

---

## Technologies Used

### Frontend:
- **HTML5**: For creating the structure of web pages.
- **CSS3**: For styling and responsive design.
- **Bootstrap**: A CSS framework for designing responsive and mobile-first pages efficiently.
- **JavaScript**: For dynamic content and user interaction.
- **jQuery**: A JavaScript library simplifying DOM manipulation, event handling, and AJAX integration.

### Backend:
- **AJAX**: For asynchronous communication between the frontend and backend.
- **JWT**: Ensures secure user authentication and session management.

---

## How It Works

1. **AJAX Integration**:
   - All frontend requests to the backend are made using AJAX.
   - URL endpoints support CRUD operations and secure JWT-based authentication.
   
2. **Role-Based Access**:
   - Users are assigned roles during sign-up or by an administrator.
   - Permissions are dynamically enforced based on the user's role.

3. **Dynamic Data Loading**:
   - Backend data is loaded into cards on the frontend.
   - Cards allow easy access to view, edit, and delete functionalities.

4. **Input Validation**:
   - Real-time validation ensures data integrity using Regex patterns.
   - Examples:
     - Email: `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`
     - Contact Number: `^\d{10}$`
     - Name: `^[a-zA-Z\s]{2,50}$`

5. **Form Pop-Ups**:
   - Forms appear in modals when triggered by buttons such as "Add" or "Edit."
   - Ensures a smooth user experience by staying on the same page.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.
