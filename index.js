let userUrl = "https://database-9164f-default-rtdb.firebaseio.com/users.json";
let apiUrl = "https://dummyjson.com/products";

let signbtn = document.getElementById("signbtn");
let loginbtn = document.getElementById("loginbtn");

function showToast(message, type = "success") {
    const container = document.querySelector('.toast-container');
    const toast = document.createElement('div');
    toast.className = `toast show text-white bg-${type}`;
    toast.innerHTML = `
        <div class="d-flex">
        <div class="toast-body"><strong>${message}</strong></div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    container.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

async function getUsers() {
    var res = await fetch(userUrl);
    var users = await res.json();
    return users;
}

signbtn.addEventListener("click", async () => {
    let signuser = document.getElementById("signuser").value;
    let signpwd = document.getElementById("signpwd").value;
    let users = await getUsers();
    let dataAdded = false;
    let user = users.filter(obj => obj.user == signuser.trim().toLowerCase());
    if (signuser == '' || signpwd == '') {
        showToast("Enter valid Data", "warning");
        return;
    }
    else if (user.length == 1) {
        showToast("User already exists", "danger");
        return;
    }

    var options = {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json"
        },
        "body": JSON.stringify({
            "user": signuser,
            "pwd": signpwd
        })
    }
    let res = await fetch(userUrl, options);
    if (res.ok) {
        showToast("Account created successfully");
    }

})

loginbtn.addEventListener("click", async (event) => {
    var loguser = document.getElementById("loguser").value;
    var logpwd = document.getElementById("logpwd").value;
    if (loguser == '' || logpwd == '') {
        event.preventDefault();
        showToast("Enter valid Username or password", "danger");
    }
    else {
        let status = false;
        let res = await fetch(userUrl);
        let users = await res.json();
        users.forEach(obj => {
            if ((obj.user == loguser) && (obj.pwd == logpwd)) {
                status = true;
                showToast("Login Successful", "success");
                setTimeout(()=>{
                    location.href = `loginSuccess.html?id=${obj.id}`;
                },500)
            }
        })
        if (status == false) {
            showToast("Invalid credentials", "danger");
        }
    }
})