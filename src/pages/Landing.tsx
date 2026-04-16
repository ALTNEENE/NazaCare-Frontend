
import { Link } from 'react-router-dom';
import {
    Activity,
    CalendarDays,
    Bot,
    ArrowRight,
    Bug,
    Stethoscope,
    ClipboardList,
    Heart,
} from 'lucide-react';
import { useTranslation } from '@/stores/languageStore';
import { useAuthStore } from '@/stores/authStore';

export default function Landing() {
    const { t, direction } = useTranslation();
    const isRTL = direction === 'rtl';
    const { user } = useAuthStore();

    const features = [
        {
            icon: <Bot className="w-7 h-7 text-teal-300" />,
            titleEn: 'AI Symptom Check',
            titleAr: 'فحص الأعراض بالذكاء الاصطناعي',
            descEn: 'Select your Dengue or Malaria symptoms and get an instant AI-powered risk assessment.',
            descAr: 'اختر أعراض حمى الضنك أو الملاريا واحصل على تقييم فوري للمخاطر مدعوم بالذكاء الاصطناعي.',
        },
        {
            icon: <Stethoscope className="w-7 h-7 text-teal-300" />,
            titleEn: 'Book a Doctor',
            titleAr: 'احجز طبيبًا',
            descEn: 'Connect with certified specialists for professional consultation after your assessment.',
            descAr: 'تواصل مع أطباء معتمدين للحصول على استشارة متخصصة بعد تقييمك.',
        },
        {
            icon: <ClipboardList className="w-7 h-7 text-teal-300" />,
            titleEn: 'Track Your History',
            titleAr: 'تتبع سجلك الصحي',
            descEn: 'Review past diagnoses, monitor risk trends and stay in control of your health.',
            descAr: 'راجع التشخيصات السابقة، وتابع اتجاهات المخاطر، وابقَ على اطلاع بحالتك الصحية.',
        },
    ];

    return (
        <div
            className={`h-screen max-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-teal-900 to-cyan-900 flex flex-col ${isRTL ? 'rtl' : 'ltr'}`}
            dir={isRTL ? 'rtl' : 'ltr'}
        >
            {/* ── Subtle animated background blobs ── */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse-slow" />
                <div className="absolute -bottom-24 -right-16 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-teal-600/5 rounded-full blur-3xl" />
            </div>

            {/* ── Background Image: Mosquito (bottom-left, atmospheric) ── */}
            <div className="absolute bottom-0 left-0 w-72 h-72 md:w-96 md:h-96 pointer-events-none select-none overflow-hidden z-0">
                <img
                    src="/images/dengue_mosquito_1772661734333.png"
                    alt=""
                    aria-hidden="true"
                    className="w-full h-full object-cover opacity-10 blur-[2px] scale-110"
                    style={{ maskImage: 'radial-gradient(ellipse at bottom left, black 30%, transparent 75%)' }}
                />
            </div>

            {/* ── Background Image: Dengue Chart (top-right, accent) ── */}
            <div className="absolute top-16 right-0 w-64 h-48 md:w-80 md:h-60 pointer-events-none select-none overflow-hidden z-0">
                <img
                    src="/images/dengue_cases_chart_1772662091404.png"
                    alt=""
                    aria-hidden="true"
                    className="w-full h-full object-cover opacity-8 blur-[1px]"
                    style={{ maskImage: 'radial-gradient(ellipse at top right, black 20%, transparent 70%)' }}
                />
            </div>

            {/* ── Top Nav Bar ── */}
            <header className="relative z-10 flex items-center justify-between px-6 md:px-12 py-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                    <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-teal-500/20 border border-teal-400/30">
                        <Heart className="h-5 w-5 text-teal-300" />
                    </div>
                    <span className="text-xl font-bold text-white tracking-tight">NazaCare</span>
                </div>
                <div className="flex items-center gap-3">
                    {user ? (
                        <Link
                            to="/diagnosis"
                            className="inline-flex items-center gap-1.5 bg-teal-500 hover:bg-teal-400 text-white font-semibold text-sm py-2 px-5 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
                        >
                            {isRTL ? 'شخص الآن' : 'Start Diagnosis'}
                            {isRTL ? <ArrowRight className="h-4 w-4 rotate-180" /> : <ArrowRight className="h-4 w-4" />}
                        </Link>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="text-sm font-medium text-teal-200 hover:text-white transition-colors"
                            >
                                {t('nav.login')}
                            </Link>
                            <Link
                                to="/register"
                                className="inline-flex items-center gap-1.5 bg-teal-500 hover:bg-teal-400 text-white font-semibold text-sm py-2 px-5 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
                            >
                                {t('landing.hero.cta')}
                                {isRTL ? <ArrowRight className="h-4 w-4 rotate-180" /> : <ArrowRight className="h-4 w-4" />}
                            </Link>
                        </>
                    )}
                </div>
            </header>

            {/* ── Main Content ── */}
            <main className="relative z-10 flex-1 flex flex-col md:flex-row items-center justify-center gap-8 px-6 md:px-12 py-6 overflow-hidden">

                {/* Left — Hero Copy */}
                <div className="md:w-5/12 flex flex-col gap-5 animate-fade-in text-center md:text-start rtl:md:text-right">
                    {/* Badge */}
                    <div className="flex justify-center md:justify-start rtl:md:justify-end">
                        <span className="inline-flex items-center gap-1.5 bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-semibold px-3 py-1 rounded-full">
                            <Activity className="h-3.5 w-3.5" />
                            AI-Powered Health Assessment
                        </span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
                        <span className="block">{t('landing.hero.title')}</span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-base md:text-lg text-teal-100/80 leading-relaxed max-w-md">
                        {t('landing.hero.subtitle')}
                    </p>

                    {/* Stats row */}
                    <div className="flex gap-4 flex-wrap justify-center md:justify-start rtl:md:justify-end">
                        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
                            <Bug className="h-5 w-5 text-orange-400" />
                            <div>
                                <p className="text-[11px] text-slate-400 leading-none">Dengue &amp; Malaria</p>
                                <p className="text-sm font-bold text-white">Risk Detection</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
                            <CalendarDays className="h-5 w-5 text-cyan-400" />
                            <div>
                                <p className="text-[11px] text-slate-400 leading-none">Instant</p>
                                <p className="text-sm font-bold text-white">Results</p>
                            </div>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="flex justify-center md:justify-start rtl:md:justify-end">
                        {user ? (
                            <Link
                                to="/diagnosis"
                                className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white font-bold py-3.5 px-8 rounded-full shadow-xl transition-all duration-200 hover:scale-105 text-base"
                            >
                                {t('landing.hero.cta2')}
                                {isRTL ? <ArrowRight className="rotate-180" /> : <ArrowRight />}
                            </Link>
                        ) : (
                            <Link
                                to="/register"
                                className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white font-bold py-3.5 px-8 rounded-full shadow-xl transition-all duration-200 hover:scale-105 text-base"
                            >
                                {t('landing.hero.cta')}
                                {isRTL ? <ArrowRight className="rotate-180" /> : <ArrowRight />}
                            </Link>
                        )}
                    </div>
                </div>

                {/* Right — Doctor Image + Feature Cards */}
                <div className="md:w-7/12 flex flex-col gap-4 w-full animate-slide-up">

                    {/* Doctor Hero Image */}
                    <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-teal-900/40" style={{ height: '220px' }}>
                        {/* Chart image as background layer */}
                        <img
                            src="/images/dengue_cases_chart_1772662091404.png"
                            alt=""
                            aria-hidden="true"
                            className="absolute inset-0 w-full h-full object-cover opacity-20 blur-sm scale-105"
                        />
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-teal-900/50 to-transparent" />
                        {/* Doctor image — positioned to the right */}
                        <img
                            src="/images/doctor_consultation_1772662178431.png"
                            alt="Medical professional"
                            className="absolute right-0 top-0 h-full w-auto object-cover object-top"
                            style={{ maskImage: 'linear-gradient(to left black 60%, transparent 100%)' }}
                        />
                        {/* Text overlay */}
                        <div className="absolute inset-0 flex items-end  flex-col justify-center px-6 gap-1">
                            <p className="text-xs text-teal-300 font-semibold uppercase tracking-widest">Expert Care</p>
                            <p className="text-xl font-bold text-white text-left leading-snug max-w-[55%]">
                                {isRTL ? 'استشر أطباء معتمدين بعد تقييمك' : 'Consult certified doctors after your assessment'}
                            </p>
                        </div>
                    </div>

                    {/* Feature Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 flex flex-col gap-2 hover:bg-white/10 hover:border-teal-400/40 transition-all duration-300 hover:shadow-xl hover:shadow-teal-900/30 hover:-translate-y-1"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                {/* Glow accent */}
                                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-teal-400/40 to-transparent" />

                                <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-teal-500/15 border border-teal-400/20 group-hover:bg-teal-500/25 transition-colors">
                                    {feature.icon}
                                </div>
                                <h3 className="text-sm font-bold text-white">
                                    {isRTL ? feature.titleAr : feature.titleEn}
                                </h3>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    {isRTL ? feature.descAr : feature.descEn}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* ── Footer Strip ── */}
            <footer className="relative z-10 flex items-center justify-between px-6 md:px-12 py-3 border-t border-white/10">
                <p className="text-xs text-slate-500">
                    © {new Date().getFullYear()} NazaCare. {isRTL ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
                </p>
                <p className="text-xs text-slate-500 text-center max-w-xs">
                    {isRTL
                        ? '⚠️ هذا تقييم أولي فقط. استشر طبيبًا للتشخيص الدقيق.'
                        : '⚠️ Preliminary assessment only. Consult a doctor for accurate diagnosis.'}
                </p>
            </footer>
        </div>
    );
}