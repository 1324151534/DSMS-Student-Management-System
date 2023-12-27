let list_container = document.getElementsByClassName("students-list-item-container")[0];

function spawnDiv(id, name, classname, major, class_id, target_div) {
    let outDiv = document.createElement('div');
    outDiv.setAttribute('class', 'students-list-item');
    outDiv.setAttribute('id', id);

    let insideDiv_id = document.createElement('div');
    insideDiv_id.setAttribute('class', 'student-list-item-info');
    insideDiv_id.innerText = id;

    let insideDiv_name = document.createElement('div');
    insideDiv_name.setAttribute('class', 'student-list-item-info');
    insideDiv_name.innerText = name;

    let insideDiv_classname = document.createElement('div');
    insideDiv_classname.setAttribute('class', 'student-list-item-info');
    insideDiv_classname.innerText = classname;
    
    let insideDiv_major = document.createElement('div');
    insideDiv_major.setAttribute('class', 'student-list-item-info');
    insideDiv_major.innerText = major;
    
    let insideDiv_class = document.createElement('div');
    insideDiv_class.setAttribute('class', 'student-list-item-info');
    insideDiv_class.innerText = class_id;

    outDiv.appendChild(insideDiv_id);
    outDiv.appendChild(insideDiv_name);
    outDiv.appendChild(insideDiv_classname);
    outDiv.appendChild(insideDiv_major);
    outDiv.appendChild(insideDiv_class);

    target_div.appendChild(outDiv);
}

function getTeachers() {
    fetch('http://127.0.0.1:5000/teachers', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
    })
    .catch(() => {
        list_container.innerHTML = "<div style='width: 100%; text-align: center; font-weight: lighter; font-size: 20px; margin-top: 10px; color: red;'>获取教师列表失败</div>";
    })
    .then(response => response.json())
    .then(data => {
        list_container.innerHTML = '';
        for(i = 0; i < Object.keys(data).length; i++) {
            spawnDiv(data[i].teacher_id, data[i].teacher_name, data[i].course_name, data[i].major_name, data[i].class_id, list_container);
        }
    })
}

setTimeout("getTeachers()", 500);