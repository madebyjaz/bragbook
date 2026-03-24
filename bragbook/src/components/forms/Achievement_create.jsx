import { title } from "motion/react-client";                // motion could be used for the notif popup after submitting (IDK but not implementing for MVP)
import { useState } from "react";
import { useNavigate } from "react-router-dom";             // Later we'll use this to redirect to Usr_Portfolio after submission is completed

export default function create_achievement_entry_form() {
    // State variables to hold the form data (for now one state object for all fields just to make sure it works lol)
    const [createFormData, setCreateData] = useState({
        // Fields for the achievement entry form
        title: "",
        company: "",
        description: "",
        dateStarted: { month: "", year: "" },                // will have two dropdown fields for month and year 
        dateCompleted: { month: "", year: "" },             //will have a 'Present' toggle and two dropdown fields for month and year 
    });

    // handler for all inputs (for now, just one handler for all fields to make sure it works)
    const handleInputChange = (e) => {
        const { name, value } = e.target;                   // Destructuring the name and value from the event target
        setCreateData((prevData) => ({
            ...prevData,                                    // Spreading the previous state to maintain unchanged fields
            [name]: value,                                  // Updating the specific fields that changed
        }));
    }

    // Function to handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();                                 // Preventing the default submission behavior (page refresh)


        // THIS IS WHERE THE FORM DATA FOR FIREBASE WOULD EXISTS

        // Notification Popup for a successful entry
        console.log(`Success! You made an achievement entry for ${createFormData.title}!`); // For now, I'm just logging the form data
    }

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const years = [];                                           // array to hold the years for the dropdown
    const currentYear = new Date().getFullYear();
    for (let year = 1930; year <= currentYear; year++) {        //  Populating years from 1930 to the current year
        years.push(year);
    }

    // Now the UI for the form
    return (
    // s = styles cost for styling the form
        <div style = {s.container}>
            <form onSubmit={handleSubmit} style = {styles.form}>
                {/* Form fields will go here */}

                {/* Field 1: Name / Title Field (REQUIRED) */}
                <label style = {s.label}> Name/Title of Entry </label>
                <input type="text" name="title" value={createFormData.title} onChange={handleInputChange} placeholder="e.g. Software Development Intern" required style={s.input} />

                {/* Field 2: Company/Organization Field (REQUIRED) */}
                <label style={s.label}> Company/Organization </label>
                <input type="text" name="company" value={createFormData.company} onChange={handleInputChange} placeholder="e.g. Tech Inc." required style={s.input} />

                {/* Field 3: Description Field */}
                <label style={s.label}> Description </label>
                <textarea name="description" value={createFormData.description} onChange={handleInputChange} placeholder="Describe your accomplishment, your role / responsibilities, and impact..." style={s.textarea} />

                {/* Field 4: Date Started Field w/dropdowns (BOTH DROPDOWNS REQUIRED)*/}
                <label style={s.label}> Date Started </label>
                <div style={s.dateContainer}>

                   { /* dropdown 4 month select (date started) */ }
                    <select name="dateStarted.month" value={createFormData.dateStarted.month} onChange={handleInputChange} required style={s.select}>
                        <option value=""> Select Month </option>
                        {months.map((m) => (
                            <option key={m} value={m} > {m}</option>
                        ))}
                    </select>

                    { /* dropdown 4 year select (date started) */ }
                    <select name="dateStarted.year" value={createFormData.dateStarted.year} onChange={handleInputChange} required style={s.select}>
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
                </div>

                <button type="Submit" style={s.submitButton}> Create Entry </button>
            </form>
        </div>
    );
}

// Basic styling for the form (can be improved l8tr (is this the abbreviation 4 later lol))