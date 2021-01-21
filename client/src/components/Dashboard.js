import React, { Fragment ,useEffect,useState} from "react";

const Dashboard = ({setAuth})=>{
    const[name,setName] = useState("");
    // const[email,setEmail] = useState("");

    async function getName(){
        try {
            const response = await fetch("http://localhost:5000/dashboard/",{
                method:"GET",
                headers: {"token": localStorage.token}
            });

            const parseRes = await response.json();
            // console.log(parseRes);

            setName(parseRes.user_name)
            // setEmail(parseRes.user_email)
        } catch (error) {
            console.error(error.message)
        }
    }

    useEffect(() => {
        getName();
    },[]);

    const logout = (e) => {
        e.preventDefault();
        localStorage.removeItem("token");
        setAuth(false);
    }
    return(
        <Fragment>
        <h1>Dashboard</h1>
        <h2>{name}</h2>
        {/* <h3>{email}</h3> */}
        <button className="btn btn-primary" onClick={e=> logout(e)}>Logout</button>

        </Fragment>
    );
};

export default Dashboard;
