import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../../firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import {getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage";

export default function create_achievement_entry_form() {

    // form state and nav
    const navigate = useNavigate();
    const [createFormData, setCreateData] = useState({
        title: "",
        company: "",
        description: "",
        dateStarted: { month: "", year: "" },                // will have two dropdown fields for month and year 
        dateCompleted: { month: "", year: "" },             //will have a 'Present' toggle and two dropdown fields for month and year 
        isPresent: false,                                  // for the 'Present' toggle (when toggled, the completed fields would not be required)   
    });

    // notif and toggle state
    const [isToggled, setisToggled] = useState(false);
    const [showNotif, setshowNotif] = useState(false);

    // handler for all inputs (for now, just one handler for all fields to make sure it works)
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.includes(".")) {
            const [parent, child] = name.split(".");
            setCreateData((prevData) => ({
                ...prevData,
                [parent]: {
                    ...prevData[parent],
                    [child]: type === "checkbox" ? checked : value,
                },
            }));
        } else {
            setCreateData((prevData) => ({
                ...prevData,
                [name]: type === "checkbox" ? checked : value,
            }));
        }
    };

    // handler for toggling Present (for date completed)
    const ToggleHandler = () => setisToggled(!isToggled);

    const [proofType, setProofType] = useState("none");
    const [proofFile, setProofFile] = useState(null);
    const [proofValue, setProofValue] = useState("");

    let proof = null;
    if (proofType === "url" && proofValue) {
        proof = {type: "url", value:proofValue};
    } else if (proofType === "file" && proofFile) {
        const storage = getStorage();
        const storageRef = ref(storage, `proofs/${auth.currentUser.uid}/${Date.now()}_${proofFile.name}`);
        await uploadBytes(storageRef, proofFile);
        const downloadURL = await getDownloadURL(storageRef);
        proof = {type: "file", value: downloadURL, fileName: proofFile.name};
    }

    // submission handler w/ Firebase logic (used ai to help with the firebase logic)
    const handleSubmit = async (e) => {
        e.preventDefault();

        
        try {
            await addDoc(collection(db, "users", auth.currentUser.uid, "achievements"), {
                ...createFormData,
                isPresent: isToggled,
                proof, 
                createdAt: serverTimestamp(),
            });
        } catch (error) {
            console.error("Error saving entry:", error);
            return;
        }



        // (For debugging purposes) notif/ nav back
        console.log("Entry has been created:", createFormData);
        setshowNotif(true);
        setTimeout(() => setshowNotif(false), 3000);
        // reset form and toggle, then nav back 
        setCreateData({
            title: "",
            company: "",
            description: "",
            dateStarted: { month: "", year: "" },
            dateCompleted: { month: "", year: "" },
            isPresent: false,
        });
        setisToggled(false);
        navigate("/portfolio");
    };

    // handler for going back
    const handleBack = () => {
        console.log("Back to portfolio");
        navigate("/portfolio");
    };

    // Dropdown options for months/ years 
    const months = [
        "January","February","March","April","May","June",
        "July","August","September","October","November","December",
    ];

    const years = [];
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1930; year--) years.push(year);

    // Shared input classes for styling
    const inputClass = "w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 bg-white outline-none focus:border-[#007C77] focus:ring-2 focus:ring-[#007C77]/20 transition-all";
    const selectClass = "w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-600 bg-white outline-none cursor-pointer focus:border-[#007C77] focus:ring-2 focus:ring-[#007C77]/20 transition-all";
    const labelClass = "text-sm font-semibold text-[#003C61]";

    return (
        <div className="min-h-screen bg-[#1a1a2e] flex items-start justify-center py-10 px-4">

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="bg-[#F5F5F5] rounded-2xl shadow-2xl w-full max-w-xl p-8 max-h-[90vh] overflow-y-auto"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-[#003C61]">+ New Achievement </h2>
                    <button type="button" onClick={handleBack}
                        className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg px-2 py-1 text-lg transition-colors">
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                    {/* Field 1: Title REQUIRED */}
                    <div className="flex flex-col gap-1">
                        <label className={labelClass}>
                            Name / Title of Entry <span className="text-[#e63946]">*</span>
                        </label>
                        <input type="text" name="title" value={createFormData.title}
                            onChange={handleInputChange} placeholder="e.g. Software Development Intern"
                            required className={inputClass} />
                    </div>

                    {/* Field 2: Company REQUIRED */}
                    <div className="flex flex-col gap-1">
                        <label className={labelClass}>
                            Company/Organization <span className="text-[#e63946]">*</span>
                        </label>
                        <input type="text" name="company" value={createFormData.company}
                            onChange={handleInputChange} placeholder="e.g. Tech Inc."
                            required className={inputClass} />
                    </div>

                    {/* Field 3: Description */}
                    <div className="flex flex-col gap-1">
                        <label className={labelClass}>Description</label>
                        <textarea name="description" value={createFormData.description}
                            onChange={handleInputChange} rows={5}
                            placeholder="Describe your accomplishment, your role / responsibilities, and impact..."
                            className={`${inputClass} resize-y min-h-[110px] font-sans`} />
                    </div>

                    {/* Field 4: Date Started REQUIRED */}
                    <div className="flex flex-col gap-1">
                        <label className={labelClass}>
                            Date Started <span className="text-[#e63946]">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <select name="dateStarted.month" value={createFormData.dateStarted.month}
                                onChange={handleInputChange} className={selectClass}>
                                <option value="">Select Month</option>
                                {months.map((m) => <option key={m} value={m}>{m}</option>)}
                            </select>
                            <select name="dateStarted.year" value={createFormData.dateStarted.year}
                                onChange={handleInputChange} className={selectClass}>
                                <option value="">Select Year</option>
                                {years.map((y) => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Field 5: Date Completed */}
                    <div className="flex flex-col gap-1">
                        <label className={labelClass}>Date Completed</label>

                        {/* Present toggle */}
                        <div className="flex items-center gap-3 mb-2 mt-1">
                            <span className="text-sm text-gray-600 font-medium">Present</span>
                            <button type="button" onClick={ToggleHandler}
                                className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${isToggled ? "bg-[#007C77]" : "bg-gray-300"}`}>
                                <motion.span
                                    animate={{ x: isToggled ? 24 : 2 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow block"
                                    style={{ left: 0 }}
                                />
                            </button>
                            <AnimatePresence>
                                {isToggled && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -8 }}
                                        className="text-xs text-[#007C77] font-medium"
                                    >
                                        Currently active
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Date completed dropdowns — hidden when Present is on */}
                        <AnimatePresence>
                            {!isToggled && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="grid grid-cols-2 gap-3 overflow-hidden"
                                >
                                    <select name="dateCompleted.month" value={createFormData.dateCompleted.month}
                                        onChange={handleInputChange} className={selectClass}>
                                        <option value="">Select Month</option>
                                        {months.map((m) => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                    <select name="dateCompleted.year" value={createFormData.dateCompleted.year}
                                        onChange={handleInputChange} className={selectClass}>
                                        <option value="">Select Year</option>
                                        {years.map((y) => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className={labelClass}> Proof of Achievement </label>
                        {/* type selector */}
                        <div className="flex gap-2">
                            {["none", "url", "file"].map((type) => (
                                <button key={type} type="button"
                                onClick={() => {setProofType(type); setProofValue(""); setProofFile(null); }}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${proofType === type ? "bg-[#007C77] text-white border-[#007C77]" : "bg-white text-gray-500 border-gray-200 hover:border-[#007C77]"}`}>
                                    {type === "none" ? "None" : type === "url" ? "URL" : "File"} 
                                </button>
                            ))}
                        </div>
                        {/* input for url */}
                        {proofType === "url" && (
                            <input type="url" name="proofValue" value={proofValue} onChange={(e) => setProofValue(e.target.value)} placeholder="Enter the URL link for your achievement proof (e.g. certificate, news article, screenshot of nonconfidential managerial email, etc.)" className={inputClass} />
                        )}
                        {/*input for file */}
                        {proofType === "file" && (
                            <input type="file" accept=".pdf, .png, .jpg, .jpeg, .doc, .docx"  onChange={(e) => setProofFile(e.target.files[0])} placeholder="Upload the achievement proof. Supported files: .pdf, .png, .jpg, .jpeg, .doc, .docx" className="text-sm text-gray-600" />
                        )}
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end mt-2">
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            className="bg-[#007C77] hover:bg-[#005f5b] text-white font-semibold px-10 py-3 rounded-xl text-sm transition-colors"
                        >
                            Create Entry
                        </motion.button>
                    </div>

                </form>
            </motion.div>

           {/* Toast notification */}
            <AnimatePresence>
                {showNotif && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed bottom-8 right-8 bg-[#007C77] text-white px-6 py-4 rounded-xl text-sm font-semibold shadow-xl z-50"
                    >
                        ✔ Achievement Entry Successfully Created!
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
} 