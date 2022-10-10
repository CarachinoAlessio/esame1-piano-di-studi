const {sortByCourseName} = require("./courses_utils");

/**
 *
 * @description It sets both the persistent copy and the local copy of the study plan with all properties of the course objects
 * @param planItems
 * @param courses
 * @param setPlanItems
 * @param setPlanItemsInContext
 */
function attachCourseDetails(planItems, courses, setPlanItems, setPlanItemsInContext){
    let tempPlanItems = []
    planItems.forEach((item) => {
        tempPlanItems.push(courses.find((c) => c.code === item.code))
    })
    setPlanItems(() => sortByCourseName([...tempPlanItems]))
    setPlanItemsInContext(() => sortByCourseName([...tempPlanItems]))
}

module.exports = {attachCourseDetails}
