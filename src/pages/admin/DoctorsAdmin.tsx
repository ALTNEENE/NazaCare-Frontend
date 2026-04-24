import { useEffect, useState } from "react";
import { adminApi } from "@/api/admin";

export function DoctorsAdmin() {
    const [doctors, setDoctors] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        specialization: "",
        email: "",
        phone: "",
        gender: "male",
        hospital: "",
    });

    const loadDoctors = async () => {
        try {
            const data = await adminApi.getDoctors();
            setDoctors(data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadDoctors();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await adminApi.createDoctor(formData);
            setIsFormOpen(false);
            setFormData({ fullName: "", specialization: "", email: "", phone: "", gender: "male", hospital: "" });
            loadDoctors();
        } catch (err) {
            console.error(err);
        }
    };

    const deleteDoctor = async (id: string) => {
        if (!confirm("Are you sure you want to delete this doctor?")) return;
        try {
            await adminApi.deleteDoctor(id);
            setDoctors(doctors.filter((d) => d._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    if (isLoading) return <div className="text-white">Loading doctors...</div>;

    return (
        <div className="space-y-6 text-white">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Doctors Directory</h1>
                <button 
                    onClick={() => setIsFormOpen(!isFormOpen)}
                    className="bg-teal-500 hover:bg-teal-400 text-neutral-950 font-semibold py-2 px-4 rounded-xl transition"
                >
                    {isFormOpen ? "Cancel" : "Add Doctor"}
                </button>
            </div>

            {isFormOpen && (
                <form onSubmit={handleSubmit} className="bg-neutral-800/80 p-6 rounded-2xl border border-neutral-700 grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-neutral-400 mb-1">Full Name</label>
                        <input name="fullName" required value={formData.fullName} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-700 p-2 rounded-lg" />
                    </div>
                    <div>
                        <label className="block text-sm text-neutral-400 mb-1">Specialization</label>
                        <input name="specialization" required value={formData.specialization} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-700 p-2 rounded-lg" />
                    </div>
                    <div>
                        <label className="block text-sm text-neutral-400 mb-1">Email</label>
                        <input name="email" type="email" required value={formData.email} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-700 p-2 rounded-lg" />
                    </div>
                    <div>
                        <label className="block text-sm text-neutral-400 mb-1">Phone</label>
                        <input name="phone" required value={formData.phone} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-700 p-2 rounded-lg" />
                    </div>
                    <div>
                        <label className="block text-sm text-neutral-400 mb-1">Gender</label>
                        <select name="gender" required value={formData.gender} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-700 p-2 rounded-lg">
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-neutral-400 mb-1">Hospital</label>
                        <input name="hospital" required value={formData.hospital} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-700 p-2 rounded-lg" />
                    </div>
                    <div className="col-span-2 pt-4">
                        <button type="submit" className="w-full bg-teal-500 hover:bg-teal-400 text-neutral-950 font-semibold py-3 rounded-xl transition">
                            Save Doctor
                        </button>
                    </div>
                </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.map((doc) => (
                    <div key={doc._id} className="bg-neutral-800/50 border border-neutral-700 rounded-2xl p-6 relative">
                        <button 
                            onClick={() => deleteDoctor(doc._id)}
                            className="absolute top-4 right-4 text-rose-400 hover:text-rose-300 text-sm"
                        >
                            Remove
                        </button>
                        <h3 className="text-xl font-bold">{doc.fullName}</h3>
                        <p className="text-teal-400 text-sm font-medium mb-3">{doc.specialization}</p>
                        <div className="text-sm text-neutral-400 space-y-1">
                            <p>🏥 {doc.hospital}</p>
                            <p>📞 {doc.phone}</p>
                            <p>✉️ {doc.email}</p>
                        </div>
                    </div>
                ))}
            </div>
            {doctors.length === 0 && !isFormOpen && (
                <div className="p-8 text-center text-neutral-500">No doctors registered.</div>
            )}
        </div>
    );
}
