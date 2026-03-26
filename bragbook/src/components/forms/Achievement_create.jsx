import { color } from "motion";
import { h2, title } from "motion/react-client";                 // motion could be used for the notif popup after submitting (IDK but not implementing for MVP)
import { useState } from "react";
// import { useNavigate } from "react-router-dom";             // Later we'll use this to redirect to Usr_Portfolio after submission is completed

export default function create_achievement_entry_form() {
    // State variables to hold the form data (for now one state object for all fields just to make sure it works lol)
    const [createFormData, setCreateData] = useState({
        // Fields for the achievement entry form
        title: "",
        company: "",
        description: "",
        dateStarted: { month: "", year: "" },                // will have two dropdown fields for month and year 
        dateCompleted: { month: "", year: "" },             //will have a 'Present' toggle and two dropdown fields for month and year 
        isPresent: false,                                  // for the 'Present' toggle (when toggled, the completed fields would not be required)   
    });

    // handler for all inputs (for now, just one handler for all fields to make sure it works)
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;                   // Destructuring the name, val, type, and checked from the event target
        // Handling the nested fields (like dropdowns)
        if (name.includes(".")) {
            const [parent, child] = name.split(".");
            setCreateData((prevData) => ({
                ...prevData, 
                [parent]: {
                    ...prevData[parent],
                    [child]: type === "checkbox" ? checked : value,     // For handling the checkbox input (present toggle)
                }
            }));
        } else {
            setCreateData((prevData) => ({
                ...prevData,                                    // Spreading the previous state to maintain unchanged fields
                [name]: value,                                  // Updating the specific fields that changed
            }));
        }
    }

    const [isToggled, setisToggled] = useState(false);        // State for tracking the toggle status
    const [showNotification, setShowNotification] = useState(false); // State for triggering a  notif. popup after submission 

    // handler for the toggle
    const ToggleHandler = () => {
        setisToggled(!isToggled);       // Toggling the state between true and false when the usr clicks the button
    };

    // Function to handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();                                 // Preventing the default submission behavior (page refresh)
        // THIS IS WHERE THE FORM DATA FOR FIREBASE WOULD EXISTS


        setShowNotification(true);                         // Triggering the notification popup 
        setTimeout(() => {                                // Setting a timeout to hide the notification after 3 seconds
            setShowNotification(false);
        }, 3000);

        console.log("Form data:", createFormData);

        // Resetting the form after submission (Just until we add redirect to Usr_Portfolio and firebase functionality)
        setCreateData({
            title: "",
            company: "", 
            description: "",
            dateStarted: { month: "", year: "" },
            dateCompleted: { month: "", year: "" },
            isPresent: false,
        });
        setisToggled(false);                    // fix: gotta reset the present toggle too
    }

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const years = [];                                           // array to hold the years for the dropdown
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1930; year--) {        //  Populating years from the current year back to 1930
        years.push(year);
    }

    // Now the UI for the form
    return (
        // s = styles cost for styling the form

        <div style={s.pageWrapper}>
            <div style = {s.container}>
                <h2 style={s.h2}> Create a New Achievement Entry</h2>
                <form onSubmit={handleSubmit} style = {s.form}>
                    {/* Form fields will go here */}

                    {/* Field 1: Name / Title Field (REQUIRED) */}
                    <label style = {s.label}> Name / Title of Entry <span style={s.requiredsymbol}>*</span> </label>
                    <input type="text" name="title" value={createFormData.title} onChange={handleInputChange} placeholder="e.g. Software Development Intern" required style={s.input} />

                    {/* Field 2: Company/Organization Field (REQUIRED) */}
                    <label style={s.label}> Company/Organization <span style={s.requiredsymbol}>*</span> </label>
                    <input type="text" name="company" value={createFormData.company} onChange={handleInputChange} placeholder="e.g. Tech Inc." required style={s.input} />

                    {/* Field 3: Description Field */}
                    <label style={s.label}> Description </label>
                    <textarea name="description" value={createFormData.description} onChange={handleInputChange} placeholder="Describe your accomplishment, your role / responsibilities, and impact..." style={s.textarea} />

                    {/* Field 4: Date Started Field w/dropdowns (BOTH DROPDOWNS REQUIRED)*/}
                    <label style={s.label}> Date Started <span style={s.requiredsymbol}>*</span> </label>
                    <div style={s.dateContainer}>

                    { /* dropdown 4 month select (date started) */ }
                        <select name="dateStarted.month" value={createFormData.dateStarted.month} onChange={handleInputChange} style={s.select}>
                            <option value=""> Select Month </option>
                            {months.map((m) => (
                                <option key={m} value={m} > {m}</option>
                            ))}
                        </select>

                        { /* dropdown 4 year select (date started) */ }
                        <select name="dateStarted.year" value={createFormData.dateStarted.year} onChange={handleInputChange} style={s.select}>
                            <option value=""> Select Year</option>
                            {years.map((y) => (
                                <option key={y} value={y} > {y} </option>
                            ))}
                        </select>

                    </div>

                    {/* Field 5: Date Completed Field w/dropdowns and 'Present' toggle (IDT DROPDOWNS NEED TO BE REQUIRED HERE)
                    May change Later?? IDK */}
                    <label style={s.label}> Date Completed </label>
                    <div style={s.dateContainer}>

                    { /* dropdown 4 month select (date completed) */ }
                        <select name="dateCompleted.month" value={createFormData.dateCompleted.month} onChange={handleInputChange} style={s.select}>
                            <option value=""> Select Month </option>
                            {months.map((m) => (
                                <option key={m} value={m} > {m}</option>
                            ))}
                        </select>

                        { /* dropdown 4 year select (date Completed) */ }
                        <select name="dateCompleted.year" value={createFormData.dateCompleted.year} onChange={handleInputChange} style={s.select}>
                            <option value=""> Select Year</option>
                            {years.map((y) => (
                                <option key={y} value={y} > {y} </option>
                            ))}
                        </select>

                        { /* Present toggle 
                        <label style={s.presentlabel}> Present 
                            <input type="Checkbox" name="isPresent" checked={createFormData.isPresent} onChange={handleInputChange} style={s.checked} />
                        </label>  */ }

                        <div style={s.presentToggleContainer}>
                            <label style={s.presentlabel}> Present </label>
                            <button type="button" onClick={ToggleHandler} style={s.toggled}>          {/* Check if the achievement is marked as present/currently active*/}
                                <span> {isToggled ? "True" : "False"} </span>  
                            </button>
                        </div>
                        

                    </div>

                    <button type="submit" style={s.submitButton}> Create Entry </button>
                </form>
            </div>
                {/* Notification Popup (can be improved with motion for animation effects later) */}
                {showNotification && (
                    <div style={s.notif}>
                        ✔ Achievement Entry Successfully Created!
                    </div>
                )}
        </div>      
    );
}

// Basic styling for the form (can be improved l8tr (is this the abbreviation 4 later lol))
const s = {
    pageWrapper: {display: "flex", justifyContent: "center", alignItems: "flex-start", minHeight: "100vh", backgroundColor: "#1a1a2e", padding: "40px 16px"},
    h2: {position: "relative", left: "10px", color: "#003C61", fontSize: "24px", fontWeight: "700", marginBottom: "20px"},  // Dark blue color for the Heading (just to see how this looks with the rest of the site)
    container: {backgroundColor: "#F5F5F5", borderRadius: "16px", padding: "32px 36px 28px", maxWidth: "580px", width: "100%", boxShadow:"0 8px 40px rgba(0, 0, 0, 0, 0.18)", fontFamily: " 'Segoe UI', sans-serif", maxHeight: "90vh", overflowY: "auto"}, // Light background for the container, centered w/ some padding and rounded corners
    label:{fontSize: "14px", fontWeight: "600", color: "#003C61", display: "block", marginBottom: "6px", marginTop: "16px" },
    requiredsymbol: {color: "#e63946"}, // Red color for the asterisk to indicate required fields
    input: {width: "100%", padding: "12px 14px", border: "1.5px solid #e5e7eb", borderRadius: "10px", fontSize: "14px", color: "#111827", backgroundColor: "#ffffff", outline: "none", boxSizing: "border-box", fontFamily: "inherit"}, 
    select: {width: "100%", padding: "12px 14px", border: "1.5px solid #e5e7eb", borderRadius: "10px", fontSize: "14px", color: "#374151", backgroundColor: "#ffffff", outline: "none", cursor: "pointer", boxSizing: "border-box", fontFamily: "inherit"}, 
    textarea: {width: "100%", padding: "12px 14px", border: "1.5px solid #e5e7eb", borderRadius: "10px", fontSize: "14px", color: "#111827", backgroundColor: "#ffffff", outline: "none", resize: "vertical", minHeight: "110px", boxSizing: "border-box", fontFamily: "inherit"},
    dateContainer: {display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "8px", alignItems: "center"}, // Container for the date dropdowns and present toggle, using CSS grid to layout the fields
    presentToggleContainer: {display: "flex", alignItems: "center", gap: "8px"},            // Container for the present toggle
    presentlabel: {fontSize: "14px", display: "flex", alignItems: "center", gap: "5px"},
    toggled: {width: "50px", height: "30px", backgroundColor: "#007C77", borderRadius: "15px", position: "relative", border: "none", cursor: "pointer", transition: "background-color 0.3s ease"},
    form: {display: "flex", flexDirection: "column"},
    submitButton: {marginTop: "24px", backgroundColor: "#007C77", color: "#ffffff", border: "none", borderRadius: "10px", padding: "13px 36px", fontSize: "15px", fontWeight: "600", cursor: "pointer", display: "block", marginLeft: "auto"},
    notif: { position: "fixed", bottom: "32px", right: "32px", backgroundColor: "#007C77", color: "#ffffff", padding: "14px 24px", borderRadius: "10px", fontSize: "15px", fontWeight: "600", boxShadow: "0 4px 20px rgba(0,0,0,0.2)", zIndex: "1000" },
}