import './App.css';
import {theme} from "./theme";
import {useEffect, useState} from 'react'
import {Container, ThemeProvider} from "@mui/material";
import {BrowserRouter as Router, Routes, Route, useParams} from 'react-router-dom';
import {Outlet} from 'react-router-dom';
import {useNavigate} from 'react-router-dom';
import NavbarComp from "./layout/NavbarComp";
import {LoginComp} from "./components/LoginComp";
import HomePageComp from "./layout/HomePageComp";
import API from "./API";
import {attachClientInfo, sortByCourseName} from "./utils/courses_utils";
import {DataContext} from "./DataContext";
import {attachCourseDetails} from "./utils/planItems_utils";
import {Navigate} from "react-router";
import {CoursesTableReadOnlyComp} from "./components/CoursesTableReadOnlyComp";


function App() {
    return (
        <Router>
            <App2/>
        </Router>
    )
}

function App2() {
    const [courses, setCourses] = useState([]);
    const [coursesInContext, setCoursesInContext] = useState(courses)
    const [planItems, setPlanItems] = useState([])
    const [planItemsInContext, setPlanItemsInContext] = useState([])
    const [persistentIsFulltime, setPersistentIsFulltime] = useState(undefined)

    const [enableSelectCourses, setEnableSelectCourses] = useState(false)
    const [searchingPlan, setSearchingPlan] = useState(true)
    const [loggedIn, setLoggedIn] = useState(false);
    const [student, setStudent] = useState({});
    const [dirtyCourses, setDirtyCourses] = useState(false)
    const navigate = useNavigate();

    useEffect(() => {
        const response = API.getCourses()
        response.then((res) => {
            setCourses(sortByCourseName(res))
        })
            .catch((err) => console.log(err))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (loggedIn && courses.length > 0) {
            const response = API.getPlanIfExists()
            response.then((res) => {
                if (res.planItems.length === 0)
                    setSearchingPlan(false)
                setPersistentIsFulltime(res.isFulltime === 1)
                attachCourseDetails(res.planItems, courses, setPlanItems, setPlanItemsInContext)
                attachClientInfo(courses, setCourses, res.planItems, setCoursesInContext)
            })
                .catch((err) => console.log(err))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loggedIn, courses.length]);

    useEffect(() => {
        if (dirtyCourses) {
            setDirtyCourses(false)
            const response = API.getCourses()
            response.then((resCourses) => {
                setCourses(sortByCourseName(resCourses))
                const response = API.getPlanIfExists()
                response.then((res) => {
                    setPersistentIsFulltime(res.isFulltime === 1)
                    attachCourseDetails(res.planItems, resCourses, setPlanItems, setPlanItemsInContext)
                    attachClientInfo(resCourses, setCourses, res.planItems, setCoursesInContext)
                })
                    .catch((err) => console.log(err))
            })
                .catch((err) => console.log(err))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dirtyCourses])

    useEffect(() => {
        const checkStudent = API.getStudentInfo()
        checkStudent.then((student) => {
            setLoggedIn(true);
            setStudent(student);
            navigate('/home')
        }).catch((err) => {
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const doLogout = async () => {
        await API.logOut();
        setEnableSelectCourses(false)
        setLoggedIn(false);
        setStudent({});
        navigate('/');
    }

    return (
        <ThemeProvider theme={theme}>
            <DataContext.Provider value={{
                coursesInContext: coursesInContext, setCoursesInContext: setCoursesInContext,
                planItemsInContext: planItemsInContext, setPlanItemsInContext: setPlanItemsInContext,
                persistentIsFulltime: persistentIsFulltime, setPersistentIsFulltime: setPersistentIsFulltime
            }}>
                <Routes>

                    <Route path='/' element={<><Layout loggedIn={loggedIn} student={student} setStudent={setStudent}
                                                       setEnableSelectCourses={setEnableSelectCourses}
                                                       doLogout={doLogout}></Layout></>}>
                        <Route path='/' element={!loggedIn ? <><CoursesTableReadOnlyComp
                            courses={courses}></CoursesTableReadOnlyComp>
                            <div style={{paddingTop: '50px'}}></div>
                        </> : <Navigate to='/home'/>}></Route>
                        <Route path='/home' element={loggedIn ? <HomePageComp loggedIn={loggedIn} courses={courses}
                                                                              enableSelectCourses={enableSelectCourses}
                                                                              setEnableSelectCourses={setEnableSelectCourses}
                                                                              setCourses={setCourses}
                                                                              planItems={planItems}
                                                                              setPlanItems={setPlanItems}
                                                                              searchingPlan={searchingPlan}
                                                                              setDirtyCourses={setDirtyCourses}
                                                                              setSearchingPlan={setSearchingPlan}></HomePageComp> :
                            <Navigate to='/login'/>}/>
                        <Route path='/login' element={<LoginComp loggedIn={loggedIn} setLoggedIn={setLoggedIn}
                                                                 setStudent={setStudent}
                                                                 setSearchingPlan={setSearchingPlan}></LoginComp>}></Route>
                    </Route>

                    <Route path='*' element={<h1>Error 404, Page Not Found</h1>}/>
                </Routes>
            </DataContext.Provider>
        </ThemeProvider>


    );
}

function Layout(props) {

    let {param} = useParams();

    let {student, setStudent, loggedIn} = props

    if (param !== undefined && param !== 'login')
        return <h1>404 Page not found</h1>

    return (
        <div>
            <header>
                <NavbarComp loggedIn={loggedIn} student={student} setStudent={setStudent}
                            doLogout={props.doLogout}></NavbarComp>
            </header>
            <Container maxWidth="lg" sx={{marginTop: '30px'}}>
                <main>
                    {
                        <Outlet/>
                    }

                </main>
            </Container>

        </div>
    );


}

export default App;
