/**
 * All the API calls
 */

const URL = 'http://localhost:3001/api'

async function logIn(credentials) {
    let response = await fetch(URL + '/sessions', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });
    if (response.ok) {
        const student = await response.json();
        return student;
    } else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}
async function logOut() {
    await fetch(URL+"/sessions/current", { method: 'DELETE', credentials: 'include' });
}

async function getStudentInfo() {
    return new Promise( async (resolve, reject) => {
        const response = await fetch(URL + '/sessions/current', { method: 'GET', credentials: 'include'});
        const studentInfo = await response.json();
        if (response.ok) {
            resolve(studentInfo);
        } else {
            reject(studentInfo);  // an object with the error coming from the server
        }
    })
}
async function getCourses(){
    return new Promise(async(resolve, reject) => {
        const response = await fetch(URL + '/courses', {method: 'GET'});
        const courses = await response.json();
        if (response.ok) {
            resolve(courses);
        } else {
            reject(courses);  // an object with the error coming from the server
        }
    })
}

async function getPlanIfExists() {
    return new Promise( async (resolve, reject) => {
        const response = await fetch(URL + '/studyplan', {method: 'GET', credentials: 'include'});
        const planItems = await response.json();
        if (response.ok) {
            resolve(planItems);
        } else {
            reject(planItems);
        }
    })
}

async function confirmStudyPlan(planItemsCodes, isFulltime){
    return new Promise((resolve, reject) => {
        fetch(URL + '/confirmStudyPlan', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({planItems: [...planItemsCodes.map((item) => item.code)], isFulltime: isFulltime})
        }).then((response) => {
            if (response.ok)
                resolve(null)
            else {
                response.json()
                    .then((message) => {
                        reject(message);
                    })
                    .catch(() => {
                        reject({ error: "Cannot parse server response." })
                    });
            }
        }).catch(() => {
            reject({ error: "Cannot communicate with the server." })
        })
    })
}

async function deletePersistentStudyPlan(){
    return new Promise((resolve, reject) => {
        fetch(URL + '/deleteStudyPlan', {
            method: 'DELETE',
            credentials : 'include'
        })
            .then((res) => resolve(res))
            .catch(function (error) {
                reject(error)
            });
    })
}


const API = { logIn, logOut, getStudentInfo, getCourses, getPlanIfExists, confirmStudyPlan, deletePersistentStudyPlan };
export default API;
