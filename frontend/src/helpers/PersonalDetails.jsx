import { useState } from "react";
import { Pen } from "lucide-react";

const PersonalDetails = ({ admin }) => {
    const googleAccount = [
        { id: "userId", title: "Acccount Id", value: admin.id },
        { id: "firstName", title: "First name", value: admin.first_name },
        { id: "lastName", title: "Last name", value: admin.last_name },
        { id: "email", title: "Email", value: admin.email },
    ];

    const manualAccount = [
        { id: "userId", title: "Account Id", value: admin.id },
        { id: "firstName", title: "First name", value: admin.first_name },
        { id: "lastName", title: "Last name", value: admin.last_name },
        { id: "username", title: "Username", value: admin.username },
    ];

    const isGoogleAdmin = !!admin.googleId;

    const fields = isGoogleAdmin ? googleAccount : manualAccount;

    const initialValues = fields.reduce(
        (obj, field) => ({ ...obj, [field.id]: field.value }),
        {}
    );

    const [formValues, setFormValues] = useState(initialValues);
    const [disabled, setDisabled] = useState(true);

    const handleChange = (e) => {
        setFormValues({
            ...formValues,
            [e.target.id]: e.target.value,
        });
    };

    return (
        <section className="flex flex-col gap-6 mt-4">
            <div className={`bg-white border border-gray-200 rounded-lg shadow-sm p-6 w-full max-w-3xl ${
                isGoogleAdmin ? "opacity-50 pointer-events-none" : ""
            }`}>

                <form className="grid grid-cols-2 gap-4" autoComplete="off">
                    {isGoogleAdmin && (
                        <div className="col-span-2 text-sm text-gray-700 italic mb-2 bg-yellow-50 border-l-4 border-yellow-400 p-2 rounded">
                            This account was created using Google sign-in. Certain personal
                            information cannot be manually edited.
                        </div>
                    )}

                    {fields.map((item) => (
                        <div key={item.id} className="col-span-2 md:col-span-1">
                            <label htmlFor={item.id} className="text-sm font-medium text-gray-700">
                                {item.title}
                            </label>

                            <div className="relative mt-1">
                                <input
                                    id={item.id}
                                    type="text"
                                    disabled={isGoogleAdmin || disabled}
                                    value={formValues[item.id]}
                                    onChange={handleChange}
                                    className="
                                        border p-2 rounded-md w-full text-sm
                                        placeholder-[#002868]
                                        focus:outline-none focus:ring-2 pr-10
                                        border-gray-300 text-[#002868] focus:ring-[#002868]/60

                                        disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
                                        disabled:pointer-events-none
                                    "
                                />
                            </div>
                        </div>
                    ))}
                </form>

                <div className="flex justify-end mt-4">
                    <button
                        type="button"
                        disabled={isGoogleAdmin}
                        onClick={() => setDisabled(!disabled)}
                        className={`
                            bg-[#002868] text-white text-sm font-medium px-5 py-2 rounded-md 
                            hover:bg-[#001b4d] transition-colors flex items-center gap-2
                            ${isGoogleAdmin ? "opacity-70 cursor-not-allowed" : ""}
                        `}
                    >
                        <Pen size={14} className="text-white" />
                        {isGoogleAdmin
                            ? "Managed by Google"
                            : disabled
                            ? "Edit Personal Information"
                            : "Save Changes"
                        }
                    </button>
                </div>

            </div>
        </section>
    );
};

export default PersonalDetails;
