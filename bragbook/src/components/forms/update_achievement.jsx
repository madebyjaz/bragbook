import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db, auth } from "../../firebaseConfig";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";

export default function UpdateAchievement() {
    // entry ID from URL and set up nav
    const { entryId } = useParams();
    const navigate = useNavigate();

    // form state for update populated w/ current data
    const [updateFormData, setUpdateFormData] = useState({
        title: "",
        company: "",
        description: "",
        dateStarted: { month: "", year: "" },
        dateCompleted: { month: "", year: "" },
        isPresent: false,
    });
    // form and notif states
    const [loading, setLoading] = useState(true);
    const [isToggled, setisToggled] = useState(false);
    const [showNotif, setshowNotif] = useState(false);

    // Used ai to help make the firebase fetching logic
    useEffect(() => {
        if (!auth.currentUser) return;
        const fetchEntry = async () => {
            const docSnap = await getDoc(doc(db, "users", auth.currentUser.uid, "achievements", entryId));
            if (docSnap.exists()) {
                const data = docSnap.data();
                setUpdateFormData(data);
                setisToggled(data.isPresent);
                setLoading(false);
            }
        };
        fetchEntry();
    }, [entryId]);

    // handler for changing inputs
    const handlerChangInput = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.includes(".")) {
            const [parent, child] = name.split(".");
            setUpdateFormData((prev) => ({ ...prev, [parent]: { ...prev[parent], [child]: type === "checkbox" ? checked : value } }));
        } else {
            setUpdateFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
        }
    };

    // handler for toggling present/ active state
    const ToggleHandler = () => setisToggled(!isToggled);

    // handler for going back
    const handleBack = () => {
        navigate("/portfolio");
        console.log("Back to portfolio");
    };

    //submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Used ai to help make the firebase update logic
        try {
            await updateDoc(doc(db, "users", auth.currentUser.uid, "achievements", entryId), {
                ...updateFormData,
                isPresent: isToggled,
                updatedAt: serverTimestamp(),
            });
        } catch (error) {
            console.error("Error updating achievement:", error);
            return;
        }

        console.log("Achievement has been updated!", updateFormData);
        setshowNotif(true);
        setTimeout(() => {
            setshowNotif(false);
            navigate("/portfolio");
        }, 3000);
    };

    // options for month and year dropdown selects
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const years = [];
    for (let y = new Date().getFullYear(); y >= 1930; y--) years.push(y);

    // shared input classes for styling
    const inputClass = "w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 bg-white outline-none focus:border-[#007C77] focus:ring-2 focus:ring-[#007C77]/20 transition-all";
    const selectClass = "w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-600 bg-white outline-none cursor-pointer focus:border-[#007C77] focus:ring-2 focus:ring-[#007C77]/20 transition-all";

    // show loading state while the firebase is being fetched
    if (loading) return (
        <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center">
            <p className="text-white text-sm">Loading...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#1a1a2e] flex items-start justify-center py-10 px-4">
            <div className="bg-[#F5F5F5] rounded-2xl shadow-2xl w-full max-w-xl p-8 max-h-[90vh] overflow-y-auto">

                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-[#003C61]">Edit Achievement Entry</h2>
                    <button type="button" onClick={handleBack}
                        className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg px-2 py-1 text-lg transition-colors">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                {/* Field 1: Title REQUIRED */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-[#003C61]">Name / Title of Entry <span className="text-[#e63946]">*</span></label>
                        <input type="text" name="title" value={updateFormData.title} onChange={handlerChangInput}
                            placeholder="e.g. Software Development Intern" required className={inputClass} />
                    </div>

                    {/* Field 2: Company REQUIRED */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-[#003C61]">Company/Organization <span className="text-[#e63946]">*</span></label>
                        <input type="text" name="company" value={updateFormData.company} onChange={handlerChangInput}
                            placeholder="e.g. Tech Inc." required className={inputClass} />
                    </div>

                    {/* Field 3: Description */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-[#003C61]">Description</label>
                        <textarea name="description" value={updateFormData.description} onChange={handlerChangInput} rows={5}
                            placeholder="Describe your accomplishment..."
                            className={`${inputClass} resize-y min-h-[110px] font-sans`} />
                    </div>

                    {/* Field 4: Date Started REQUIRED */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-[#003C61]">Date Started <span className="text-[#e63946]">*</span></label>
                        <div className="grid grid-cols-2 gap-3">
                            <select name="dateStarted.month" value={updateFormData.dateStarted.month} onChange={handlerChangInput} className={selectClass}>
                                <option value="">Select Month</option>
                                {months.map((m) => <option key={m} value={m}>{m}</option>)}
                            </select>
                            <select name="dateStarted.year" value={updateFormData.dateStarted.year} onChange={handlerChangInput} className={selectClass}>
                                <option value="">Select Year</option>
                                {years.map((y) => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Field 5: Date Completed */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-[#003C61]">Date Completed</label>
                        <div className="flex items-center gap-3 mb-2 mt-1">
                            <span className="text-sm text-gray-600 font-medium">Present</span>
                            <button type="button" onClick={ToggleHandler}
                                className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${isToggled ? "bg-[#007C77]" : "bg-gray-300"}`}>
                                <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow block transition-transform duration-300"
                                    style={{ left: 0, transform: isToggled ? "translateX(24px)" : "translateX(2px)" }} />
                            </button>
                            {isToggled && <span className="text-xs text-[#007C77] font-medium">Currently active</span>}
                        </div>
                        {!isToggled && (
                            <div className="grid grid-cols-2 gap-3">
                                <select name="dateCompleted.month" value={updateFormData.dateCompleted?.month} onChange={handlerChangInput} className={selectClass}>
                                    <option value="">Select Month</option>
                                    {months.map((m) => <option key={m} value={m}>{m}</option>)}
                                </select>
                                <select name="dateCompleted.year" value={updateFormData.dateCompleted?.year} onChange={handlerChangInput} className={selectClass}>
                                    <option value="">Select Year</option>
                                    {years.map((y) => <option key={y} value={y}>{y}</option>)}
                                </select>
                            </div>
                        )}
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end gap-3 mt-2">
                        <button type="button" onClick={handleBack}
                            className="border border-gray-200 text-gray-500 hover:bg-gray-100 font-semibold px-6 py-3 rounded-xl text-sm transition-colors">
                            Cancel
                        </button>
                        <button type="submit"
                            className="bg-[#007C77] hover:bg-[#005f5b] active:scale-95 text-white font-semibold px-10 py-3 rounded-xl text-sm transition-all">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>

            {showNotif && (
                <div className="fixed bottom-8 right-8 bg-[#007C77] text-white px-6 py-4 rounded-xl text-sm font-semibold shadow-xl z-50">
                    ✔ Achievement Updated Successfully!
                </div>
            )}
        </div>
    );
}