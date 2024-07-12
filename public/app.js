// Database Paths
var passwordPath = 'password';
var uidPath = 'validCard';

// Get a database reference
const databasePassword = firebase.database().ref(passwordPath);
const databaseUID = firebase.database().ref(uidPath);

// Variables to save database current values
var doorPassword;
var validUIDs = [];

// Attach an asynchronous callback to read the data
databasePassword.on('value', (snapshot) => {
    doorPassword = snapshot.val();
    console.log("password: " + doorPassword);
    document.getElementById("door-password").innerHTML = doorPassword;
}, (errorObject) => {
    console.log('The read failed: ' + errorObject.name);
});

databaseUID.on('value', (snapshot) => {
    validUIDs = []; // Clear the array before updating
    snapshot.forEach((childSnapshot) => {
        var key = parseInt(childSnapshot.key);
        var value = childSnapshot.val();
        validUIDs[key] = value;
    });
    console.log(validUIDs);
    updateValidUIDListUI();
}, (errorObject) => {
    console.log('The read failed: ' + errorObject.name);
});

// Function to update the door password in Firebase
function updatePassword() {
    var newPassword = prompt("Enter the new password:");
    if (newPassword) {
        databasePassword.set(newPassword)
            .then(() => {
                console.log("Password updated successfully");
                doorPassword = newPassword;
                document.getElementById("door-password").innerHTML = doorPassword;
            })
            .catch((error) => {
                console.error("Error updating password: ", error);
            });
    }
}

// Function to add a new UID to the valid card list in Firebase
function addUID() {
    var newUID = document.getElementById("new-uid").value.trim();
    if (newUID) {
        // Find the next available index
        var newIndex = validUIDs.length;
        databaseUID.child(newIndex).set(newUID)
            .then(() => {
                console.log("New UID added successfully");
                validUIDs[newIndex] = newUID;
                updateValidUIDListUI();
                document.getElementById("new-uid").value = ""; // Clear input field
            })
            .catch((error) => {
                console.error("Error adding new UID: ", error);
            });
    }
}

// Function to remove a UID from the valid card list in Firebase
// Function to remove a UID from the valid card list in Firebase
// Function to remove a UID from the valid card list in Firebase
// Function to remove a UID from the valid card list in Firebase
function removeUID(indexToRemove) {
    if (confirm("Are you sure you want to remove this UID?")) {
        // Remove the UID from Firebase
        databaseUID.child(indexToRemove).remove()
            .then(() => {
                console.log("UID removed successfully");

                // Remove the UID from the local array and shift elements
                validUIDs.splice(indexToRemove, 1); // Remove element at indexToRemove
                console.log("Local array after removal:", validUIDs);

                // Update Firebase to reorder keys using transaction
                databaseUID.set(validUIDs)
                    .then(() => {
                        console.log("Firebase keys reordered successfully");
                        updateValidUIDListUI(); // Update UI with the modified validUIDs array
                    })
                    .catch((error) => {
                        console.error("Error reordering Firebase keys: ", error);
                    });
            })
            .catch((error) => {
                console.error("Error removing UID from Firebase: ", error);
            });
    }
}

// Function to update the UI with the current valid UID list
function updateValidUIDListUI() {
    var uidTableBody = document.getElementById("uid-table-body");
    uidTableBody.innerHTML = ""; // Clear existing table rows

    validUIDs.forEach((uid, index) => {
        var row = "<tr>";
        row += "<td>" + index + "</td>";
        row += "<td>" + uid + "</td>";
        row += "<td><button onclick='removeUID(" + index + ")'>Delete</button></td>";
        row += "</tr>";
        uidTableBody.innerHTML += row;
    });
}
