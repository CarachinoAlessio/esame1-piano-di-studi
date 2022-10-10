function sortByCourseName(courses){
    if (courses !== undefined && courses.length !== undefined)
        return courses.sort((c1, c2) => {
            if (c1.name.toUpperCase() < c2.name.toUpperCase())
                return -1;
            else return 1
        });
}

/**
 * @description It return true if a course has reached the maximum limit of students. If the course is in the persistent copy of the study plan, it returns 'false' even if it has reached the maximum for other students.
 * @param row
 * @param planItemsInContext
 * @returns {boolean}
 */
function hasReachedMax(row, planItemsInContext){
    if(planItemsInContext === undefined)
        return row.max_students !== null && (row.pickedBy >= row.max_students)
    else{
        return row.max_students !== null && (row.pickedBy >= row.max_students) && !planItemsInContext.find((i) => i.code === row.code)
    }
}

/**
 * @description It attaches to each course object, an additional property called 'state' which describes if the course is already in the study plan, or if it is in conflict with others courses
 * @param courses
 * @param setCourses
 * @param planItems
 * @param setCoursesInContext
 */
function attachClientInfo(courses, setCourses, planItems, setCoursesInContext){
    let tempCourses = []
    courses.forEach((course) => {
        let temp = {...course, state: {inPlan: false, errors: []}}
            if (temp.mandatory){
                let found = planItems.find((planItem) => temp.mandatory === planItem.code)
                if (!found)
                    temp.state.errors.push('Prima inserire il corso propedeutico ' + temp.mandatory)
            }
        tempCourses.push(temp)
    })

    planItems.forEach((planItem) => {

        let course = tempCourses.find((c) => c.code === planItem.code || planItem.course_code)
        course.state.inPlan = true
        if (course.incompatibility){
            course.incompatibility.forEach((incompatibleCourse) => {
                let c = tempCourses.find((c) => c.code === incompatibleCourse)
                if (c.state.errors.find((e) => e === 'Incompatibile con ' + planItem.code) === undefined)
                    c.state.errors.push('Incompatibile con ' + planItem.code)
            })
        }

    })
    setCourses(() => sortByCourseName([...tempCourses]))
    if (setCoursesInContext)
        setCoursesInContext(() => sortByCourseName([...tempCourses]))
}

function refreshCoursesErrorsOnNewSelected(courses, setCourses, lastAddedCode){
    let tempCourses = [...courses]
    let course = tempCourses.find((c) => c.code === lastAddedCode)
    if (course.incompatibility){
        tempCourses.filter((t) => course.incompatibility.find((i) => i === t.code) !== undefined)
            .map((t) => {
                if (t.state.errors.find((e) => e === 'Incompatibile con ' + course.code) === undefined)
                    t.state.errors.push('Incompatibile con ' + course.code)
                return t
            })
    }
    tempCourses
        .filter((t) => t.mandatory)
        .map((t) => {
            if (t.mandatory === course.code){
                t.state.errors = t.state.errors.filter((e) => e !== 'Prima inserire il corso propedeutico ' + course.code)
            }
            return t
        })
    setCourses(() => [...tempCourses])
}

function refreshCoursesErrorsOnRemovedSelected(courses, setCourses, lastRemovedCode){
    let tempCourses = [...courses]
    let course = tempCourses.find((c) => c.code === lastRemovedCode)
    if (course.incompatibility){
        tempCourses
            .filter((t) => course.incompatibility.find((i) => i === t.code) !== undefined)
            .map((t) => {
                t.state.errors = t.state.errors.filter((e) => e !== 'Incompatibile con ' + course.code)
                return t
            })
    }
    let mandatoriesForUnselectedCode = getMandatoriesForCode(tempCourses, lastRemovedCode)
    tempCourses
        .filter((t) => mandatoriesForUnselectedCode.find((m) => t.code === m.code) !== undefined)
        .map((t) => {
            t.state.errors.push('Prima inserire il corso propedeutico ' + t.mandatory)
            return t
        })
    setCourses(() => [...tempCourses])
}

function refreshCoursesErrorsOnRemovedFromPlan(courses, lastRemovedCode){
    let tempCourses = [...courses]
    tempCourses = tempCourses.map((t) => {
        if (t.code === lastRemovedCode){
            t.state.inPlan = false
        }
        return t
    })
    let course = tempCourses.find((c) => c.code === lastRemovedCode)

    if (course.incompatibility){
        tempCourses = tempCourses.map((t) => {
            if (course.incompatibility.find((i) => i === t.code) !== undefined){
                t.state.errors = t.state.errors.filter((e) => e !== 'Incompatibile con ' + course.code)
            }
            return t
        })
    }
    let mandatoriesForRemovedCode = getMandatoriesForCode(tempCourses, lastRemovedCode)
    tempCourses
        .filter((t) => mandatoriesForRemovedCode.find((m) => t.code === m.code) !== undefined)
        .map((t) => {
            if (t.state.errors.find((e) => e === 'Prima inserire il corso propedeutico ' + t.mandatory) === undefined)
                t.state.errors.push('Prima inserire il corso propedeutico ' + t.mandatory)
            return t
        })

    return [...tempCourses]
}

/**
 *
 * @description
 * It returns all course codes which the unselected course is preparatory (even not directly)
 * EX: Math 1 is mandatory for Geometry and Math 2 which is mandatory for Math 3
 * when Math 1 is unselected, this function returns Geometry, Math 2 and Math 3 codes
 */
function getMandatoriesForCode(courses, code){
    let temp = []
    let x = {}
    let tempPar = [{code: code, mandatory: 'null'}]
    while (tempPar.length !== 0){
        x = tempPar.pop()
        if (x)
            temp.push(x)
        // eslint-disable-next-line
        tempPar = [...tempPar, ...courses.filter((c) => {
            return c.mandatory !== undefined && c.mandatory === x.code
        })]
    }
    temp = temp.filter((t) => t.code !== code)
    return temp
}

function validatePlan(planItems, planItemsInContext, isFulltime){
    let validationResult = ''

    let totCredits = planItems.reduce((acc, p) => acc + p.credits, 0)
    if (isFulltime && (totCredits<60 || totCredits>80)){
        return 'Il numero di crediti non è in regola con il piano full-time'

    }else if (!isFulltime && (totCredits<20 || totCredits>40 )){
        return 'Il numero di crediti non è in regola con il piano part-time'
    }

    planItems.forEach((item) => {
        if (validationResult === '' && item.mandatory){
            if (planItems.find((i) => i.code === item.mandatory) === undefined)
                validationResult = 'Corso ' + item.code + ' non inseribile. Non è stato inserito il suo corso propedeutico'
        }
    })
    if(validationResult !== '')
        return validationResult

    planItems.forEach((i) => {
        if (validationResult === '' && i.incompatibility){
            i.incompatibility.forEach((incompatibleCode) => {
                if (planItems.find((item) => item.code === incompatibleCode) !== undefined)
                    validationResult = 'Corso ' + i.code + ' non inseribile. È stato inserito il corso incompatibile ' + incompatibleCode
            })
        }
    })

    if(validationResult !== '')
        return validationResult

    planItems.forEach((item) => {
        if (validationResult === '' && item.max_students !== null) {
            if (hasReachedMax(item, planItemsInContext))
                validationResult = 'Corso ' + item.code + ' non inseribile. Ha raggiunto il limite delle iscrizioni'
        }

    })

    if(validationResult !== '')
        return validationResult


    return validationResult
}

/**
 * @description return true if local copy and persistent copy are equal
 * @param planItems
 * @param planItemsInContext
 * @returns {boolean}
 */
function hasChanged(planItems, planItemsInContext){
    return JSON.stringify(
        sortByCourseName([...planItems].map((item) => {delete item.state; return item;})))
        !==
    JSON.stringify(
        sortByCourseName([...planItemsInContext]))
}





module.exports = {sortByCourseName, attachClientInfo, hasReachedMax, refreshCoursesErrorsOnNewSelected, refreshCoursesErrorsOnRemovedSelected, getMandatoriesForCode, refreshCoursesErrorsOnRemovedFromPlan, validatePlan, hasChanged}
