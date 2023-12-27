let list_container = document.getElementsByClassName("students-list-item-container")[0];
let list_container_good = document.getElementsByClassName("students-list-item-container")[1];

function spawnDiv(name, major, class_id, req, ele, target_div) {
    let outDiv = document.createElement('div');
    outDiv.setAttribute('class', 'students-list-item');

    let insideDiv_name = document.createElement('div');
    insideDiv_name.setAttribute('class', 'student-list-item-info');
    insideDiv_name.innerText = name;
    
    let insideDiv_major = document.createElement('div');
    insideDiv_major.setAttribute('class', 'student-list-item-info');
    insideDiv_major.innerText = major;
    
    let insideDiv_class = document.createElement('div');
    insideDiv_class.setAttribute('class', 'student-list-item-info');
    insideDiv_class.innerText = class_id;
    
    let insideDiv_req = document.createElement('div');
    insideDiv_req.setAttribute('class', 'student-list-item-info');
    insideDiv_req.innerText = req;
    
    let insideDiv_ele = document.createElement('div');
    insideDiv_ele.setAttribute('class', 'student-list-item-info');
    insideDiv_ele.innerText = ele;

    outDiv.appendChild(insideDiv_name);
    outDiv.appendChild(insideDiv_major);
    outDiv.appendChild(insideDiv_class);
    outDiv.appendChild(insideDiv_req);
    outDiv.appendChild(insideDiv_ele);

    target_div.appendChild(outDiv);

}

function getTeachers() {
    fetch('http://127.0.0.1:5000/dangerous', {
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
        list_container_good.innerHTML = '';
        let bHavBad = false;
        let bHavGood = false;
        for(i = 0; i < Object.keys(data).length; i++) {
            if((10 - data[i].failing_credits_required) < 3 || (15 - data[i].failing_credits_elective) < 3) {
                bHavBad = true;
                spawnDiv(data[i].student_name, data[i].major_name, data[i].class_id, data[i].failing_credits_required, data[i].failing_credits_elective, list_container);
            }
            else {
                bHavGood = true;
                spawnDiv(data[i].student_name, data[i].major_name, data[i].class_id, data[i].failing_credits_required, data[i].failing_credits_elective, list_container_good);
            }
        }
        if(!bHavBad) {
            list_container.innerHTML = "<div style='width: 100%; text-align: center; font-weight: lighter; font-size: 20px; margin-top: 10px; '>无危险学生</div>";
        }
        if(!bHavGood) {
            list_container.innerHTML = "<div style='width: 100%; text-align: center; font-weight: lighter; font-size: 20px; margin-top: 10px; '>无其他学生</div>";
        }
    })
}

setTimeout("getTeachers()", 500);