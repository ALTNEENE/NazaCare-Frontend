import { useState, useEffect } from "react";
import { useTranslation } from "@/stores/languageStore";
import { Button } from "@/components/ui/button";
import { X, Phone, Building2, Stethoscope, Mail } from "lucide-react";
import apiClient from "@/api/client";

interface Doctor {
    _id: string;
    fullName: string;
    specialization: string;
    email: string;
    phone: string;
    gender: "male" | "female";
    hospital: string;
}

interface DoctorModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function DoctorModal({ isOpen, onClose }: DoctorModalProps) {
    const { language } = useTranslation();
    const isRTL = language === "ar";
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            fetchDoctors();
        }
    }, [isOpen]);

    const fetchDoctors = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.get("/doctors");
            setDoctors(response.data);
        } catch (err) {
            console.error("Error fetching doctors:", err);
            setError(isRTL ? "حدث خطأ أثناء تحميل الأطباء" : "Error loading doctors");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in text-left" dir={isRTL ? "rtl" : "ltr"}>
            <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="text-xl font-semibold text-slate-800">
                        {isRTL ? "الأطباء المتاحين" : "Available Doctors"}
                    </h2>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 rounded-full hover:bg-slate-200"
                        onClick={onClose}
                    >
                        <X className="h-4 w-4 text-slate-500" />
                    </Button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto justify-end p-5 space-y-4">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-3">
                            <div className="h-8 w-8 rounded-full border-2 border-primary-200 border-t-primary-500 animate-spin" />
                            <p className="text-sm text-slate-500">
                                {isRTL ? "جاري التحميل..." : "Loading doctors..."}
                            </p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8 text-red-500 bg-red-50 rounded-lg">
                            {error}
                        </div>
                    ) : doctors.length === 0 ? (
                        <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-xl">
                            {isRTL ? "لا يوجد أطباء متاحين حالياً" : "No doctors available at the moment."}
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {doctors.map((doctor) => (
                                <div
                                    key={doctor._id}
                                    className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-slate-200 bg-white hover:border-primary-200 hover:shadow-md transition-all sm:items-center"
                                >
                                    {/* Avatar placeholder */}
                                    <div className="h-16 w-16 shrink-0 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 font-semibold text-xl self-start sm:self-auto border border-primary-100">
                                        {doctor.fullName.charAt(0).toUpperCase()}
                                    </div>

                                    <div className="flex-1 space-y-1">
                                        <h3 className="font-semibold text-slate-900 text-right text-lg">
                                            {doctor.fullName}
                                        </h3>
                                        <div className="flex items-center text-sm text-primary-600 font-medium">
                                            <Stethoscope className="h-3.5 w-3.5 mr-1 rtl:ml-1 rtl:mr-0" />
                                            {doctor.specialization}
                                        </div>
                                    </div>

                                    {/* Contact info */}
                                    <div className="flex flex-col gap-2 text-sm text-slate-600 sm:text-right sm:items-end">
                                        <div className="flex items-center gap-1.5">
                                            <Building2 className="h-3.5 w-3.5" />
                                            <a
                                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(doctor.hospital + " Sudan")}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:text-primary-600 transition-colors cursor-pointer"
                                            >
                                                {doctor.hospital}
                                            </a>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Phone className="h-3.5 w-3.5" />
                                            <a href={`tel:${doctor.phone}`} className="hover:text-primary-600 transition-colors" dir="ltr">{doctor.phone}</a>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Mail className="h-3.5 w-3.5" />
                                            <a href={`mailto:${doctor.email}`} className="hover:text-primary-600 transition-colors">{doctor.email}</a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
