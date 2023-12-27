let list_container = document.getElementsByClassName("students-list-item-container")[0];

function spawnDiv(id, num, name, gender, birth, class_id, target_div) {
    let outDiv = document.createElement('div');
    outDiv.setAttribute('class', 'students-list-item');
    outDiv.setAttribute('id', id);

    let insideDiv_num = document.createElement('div');
    insideDiv_num.setAttribute('class', 'student-list-item-info');
    insideDiv_num.innerText = num;

    let insideDiv_name = document.createElement('div');
    insideDiv_name.setAttribute('class', 'student-list-item-info');
    insideDiv_name.innerText = name;

    let insideDiv_gender = document.createElement('div');
    insideDiv_gender.setAttribute('class', 'student-list-item-info');
    insideDiv_gender.innerText = gender;
    
    let insideDiv_birth = document.createElement('div');
    insideDiv_birth.setAttribute('class', 'student-list-item-info');
    insideDiv_birth.innerText = birth;
    
    let insideDiv_class = document.createElement('div');
    insideDiv_class.setAttribute('class', 'student-list-item-info');
    insideDiv_class.innerText = class_id;

    let insideDiv_Ctrl = document.createElement('div');
    insideDiv_Ctrl.setAttribute('class', 'student-list-item-info');

    let insideBtn_Edit = document.createElement('button');
    insideBtn_Edit.setAttribute('class', 'student-list-btn btn-edit');
    insideBtn_Edit.setAttribute('id', "btn_e" + id);
    insideBtn_Edit.innerText = "编辑"

    let insideBtn_Del = document.createElement('button');
    insideBtn_Del.setAttribute('class', 'student-list-btn btn-del');
    insideBtn_Del.setAttribute('id', "btn_d" + id);
    insideBtn_Del.innerText = "删除"

    insideDiv_Ctrl.appendChild(insideBtn_Edit);
    insideDiv_Ctrl.appendChild(insideBtn_Del);

    outDiv.appendChild(insideDiv_num);
    outDiv.appendChild(insideDiv_name);
    outDiv.appendChild(insideDiv_gender);
    outDiv.appendChild(insideDiv_birth);
    outDiv.appendChild(insideDiv_class);
    outDiv.appendChild(insideDiv_Ctrl);

    target_div.appendChild(outDiv);
}

function getStudents() {
    fetch('http://127.0.0.1:5000/students', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
    })
    .catch(() => {
        list_container.innerHTML = "<div style='width: 100%; text-align: center; font-weight: lighter; font-size: 20px; margin-top: 10px; color: red;'>获取学生列表失败</div>";
    })
    .then(response => response.json())
    .then(data => {
        list_container.innerHTML = '';
        for(i = 0; i < Object.keys(data).length; i++) {
            spawnDiv(data[i].student_id, data[i].student_number, data[i].name, data[i].gender, data[i].birth, data[i].class_id, list_container);
        }
        addCtrlBtns();
    })
}

function delStudent(student_id) {
    fetch('http://127.0.0.1:5000/students/' + student_id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('删除失败:', data.error);
            } else {
                console.log('删除成功');
            }
        });
}

setTimeout("getStudents()", 500);

function addCtrlBtns() {
    let editBtns = document.getElementsByClassName('btn-edit');
    let delBtns = document.getElementsByClassName('btn-del');

    for(i = 0; i < editBtns.length; i++) {
        editBtns[i].addEventListener('click', (e) => {
            window.location.href='edit-students.html?id=' + e.target.id.slice(5);
        })
    }

    for(i = 0; i < delBtns.length; i++) {
        delBtns[i].addEventListener('click', (e) => {
            delStudent(e.target.id.slice(5));
            list_container.removeChild(document.getElementById(e.target.id.slice(5)));
        })
    }
}

document.getElementById('addStudentBTN').addEventListener('click', () => {
    window.location.href='add-students.html';
})