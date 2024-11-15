document.addEventListener('DOMContentLoaded', function() {
    const staffForm = document.getElementById('staffForm');

    staffForm.addEventListener('submit', function(event) {
        event.preventDefault();  // Prevent the form from submitting the usual way

        // Collect form data
        const staffData = {
            id: document.getElementById('id').value,
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            designation: document.getElementById('designation').value,
            gender: document.getElementById('gender').value,
            joinedDate: document.getElementById('joinedDate').value,
            dob: document.getElementById('dob').value,
            address: {
                roadNumber: document.getElementById('roadNumber').value,
                street: document.getElementById('street').value,
                city: document.getElementById('city').value,
                district: document.getElementById('district').value,
                province: document.getElementById('province').value,
            },
            contactNo: document.getElementById('contactNo').value,
            email: document.getElementById('email').value,
            role: document.getElementById('role').value,
        };

        // Log the collected data (you can remove this or modify it based on your needs)
        console.log(staffData);

        // Example: Send data using fetch (You can replace this with actual API endpoint)
        fetch('YOUR_API_ENDPOINT_HERE', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(staffData),
        })
        .then(response => response.json())
        .then(data => {
            alert('Staff information saved successfully!');
            // Optionally, clear the form after submission
            staffForm.reset();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error saving staff information!');
        });
    });
});
