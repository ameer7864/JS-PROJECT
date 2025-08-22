let userUrl = "https://database-9164f-default-rtdb.firebaseio.com/users.json";
let apiUrl = "https://dummyjson.com/products";

let signbtn = document.getElementById("signbtn");
let loginbtn = document.getElementById("loginbtn");
let forgotpwdbtn = document.getElementById("forgotpwdbtn");

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
    // let user = users.filter(obj => obj.user == signuser.trim().toLowerCase());
    for(var obj in users){
        if(users[obj].user == signuser.trim().toLowerCase()){
            var user = users[obj];
        }
    }
    if (signuser == '' || signpwd == '') {
        showToast("Enter valid Data", "warning");
        return;
    }
    else if (user) {
        showToast("User already exists", "danger");
        return;
    }
    var options = {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json"
        },
        "body": JSON.stringify({
            "user": signuser.trim().toLowerCase(),
            "pwd": signpwd.trim().toLowerCase()
        })
    }
    let res = await fetch(userUrl, options);
    document.getElementById("signuser").value = '';
    document.getElementById("signpwd").value = '';
    if (res.ok) {
        showToast("Account created successfully");
    }
})

loginbtn.addEventListener("click", async (event) => {
    let loguser = document.getElementById("loguser").value;
    let logpwd = document.getElementById("logpwd").value;
    if (loguser == '' || logpwd == '') {
        event.preventDefault();
        showToast("Enter valid Username or password", "danger");
    }
    else {
        let status = false;
        let res = await fetch(userUrl);
        let users = await res.json();
        for(var obj in users){
            if ((users[obj].user.toLowerCase() == loguser.toLowerCase()) && (users[obj].pwd.toLowerCase() == logpwd.toLowerCase())) {
                status = true;
                document.getElementById("loguser").value = '';
                document.getElementById("logpwd").value = '';
                showToast("Login Successful", "success");

                var id = obj;
                setTimeout(()=>{
                    location.href = `loginSuccess.html?id=${id}`;
                },500)
            }
        }
        if (status == false) {
            showToast("Invalid credentials", "danger");
        }
    }
})

forgotpwdbtn.addEventListener("click" ,async () => {
    let forgotuser = document.getElementById("forgotuser").value;
    let forgotpwd = document.getElementById("forgotpwd").value;
    let users = await getUsers();
    let status = false;
    if(forgotuser == '' && forgotpwd == ''){
        showToast("Enter Data Properly", "warning");
        return;
    }
    if(forgotuser == ''){
        showToast("Username should not be empty" , "danger");
        return;
    }
    for(let obj in users){
        if(users[obj].user == forgotuser){
            var id = obj;
            status = true;
        }
    }
    if(!status && forgotuser != '' && forgotpwd != ''){
        showToast("User doesn't exists","warning");
        return;
    }
    let mainUrl = `https://database-9164f-default-rtdb.firebaseio.com/users/${id}.json`
    var options = {
        "method" : "PATCH",
        "headers" : {
            "Content-Type" : "application/json"
        },
        "body" : JSON.stringify({
            "pwd" : forgotpwd.trim().toLowerCase()
        })
    }
    if(forgotpwd == ''){
        showToast("Password should not be empty" , "danger");
        return;
    }
    else{
        let res = await fetch(mainUrl , options);
        document.getElementById("forgotuser").value = '';
        document.getElementById("forgotpwd").value = '';
        if(res.ok){
            showToast("Password changed successfully" , "success");
        }
    }
})

function clearLogData(){
    document.getElementById("loguser").value = '';
    document.getElementById("logpwd").value = '';
}


function clearSignData(){
    document.getElementById("signuser").value = '';
    document.getElementById("signpwd").value = '';
}

function clearForgotData(){
    document.getElementById("forgotuser").value = '';
    document.getElementById("forgotpwd").value = '';
}