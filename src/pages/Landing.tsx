
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
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export default function Landing() {
    const { t, direction } = useTranslation();
    const isRTL = direction === 'rtl';
    const { user } = useAuthStore();

    const features = [
        {
            icon: <Bot className="w-7 h-7 xl:w-8 xl:h-8 text-teal-300" />,
            titleEn: 'AI Symptom Check',
            titleAr: 'فحص الأعراض بالذكاء الاصطناعي',
            descEn: 'Select your Dengue or Malaria symptoms and get an instant AI-powered risk assessment.',
            descAr: 'اختر أعراض حمى الضنك أو الملاريا واحصل على تقييم فوري للمخاطر مدعوم بالذكاء الاصطناعي.',
        },
        {
            icon: <Stethoscope className="w-7 h-7 xl:w-8 xl:h-8 text-teal-300" />,
            titleEn: 'Book a Doctor',
            titleAr: 'احجز طبيبًا',
            descEn: 'Connect with certified specialists for professional consultation after your assessment.',
            descAr: 'تواصل مع أطباء معتمدين للحصول على استشارة متخصصة بعد تقييمك.',
        },
        {
            icon: <ClipboardList className="w-7 h-7 xl:w-8 xl:h-8 text-teal-300" />,
            titleEn: 'Track Your History',
            titleAr: 'تتبع سجلك الصحي',
            descEn: 'Review past diagnoses, monitor risk trends and stay in control of your health.',
            descAr: 'راجع التشخيصات السابقة، وتابع اتجاهات المخاطر، وابقَ على اطلاع بحالتك الصحية.',
        },
    ];

    return (
        <div
            className={`min-h-screen w-full relative overflow-x-hidden bg-gradient-to-br from-slate-900 via-teal-900 to-cyan-900 flex flex-col ${isRTL ? 'rtl' : 'ltr'}`}
            dir={isRTL ? 'rtl' : 'ltr'}
        >
            {/* ── Subtle animated background blobs ── */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-32 -left-32 w-[20rem] h-[20rem] lg:w-[30rem] lg:h-[30rem] bg-teal-500/10 rounded-full blur-3xl animate-pulse-slow object-cover" />
                <div className="absolute top-1/2 right-0 w-[15rem] h-[15rem] lg:w-[20rem] lg:h-[20rem] bg-cyan-400/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[30rem] h-[15rem] lg:w-[40rem] lg:h-[20rem] bg-teal-600/5 rounded-full blur-3xl" />
            </div>

            {/* ── Background Image: Mosquito (bottom-left, atmospheric) ── */}
            <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-64 sm:h-64 lg:w-96 lg:h-96 pointer-events-none select-none overflow-hidden z-0">
                <img
                    src="/images/dengue_mosquito_1772661734333.png"
                    alt=""
                    aria-hidden="true"
                    className="w-full h-full object-cover opacity-10 blur-[2px] scale-110"
                    style={{ maskImage: 'radial-gradient(ellipse at bottom left, black 30%, transparent 75%)' }}
                />
            </div>

            {/* ── Background Image: Dengue Chart (top-right, accent) ── */}
            <div className="absolute top-16 right-0 w-48 h-32 sm:w-56 sm:h-40 lg:w-80 lg:h-60 pointer-events-none select-none overflow-hidden z-0 hidden sm:block">
                <img
                    src="/images/dengue_cases_chart_1772662091404.png"
                    alt=""
                    aria-hidden="true"
                    className="w-full h-full object-cover opacity-8 blur-[1px]"
                    style={{ maskImage: 'radial-gradient(ellipse at top right, black 20%, transparent 70%)' }}
                />
            </div>

            {/* ── Top Nav Bar ── */}
            <header className={`relative z-10 flex flex-wrap items-center justify-between px-4 sm:px-6 lg:px-12 py-3 lg:py-4 border-b border-white/10 gap-3 ${isRTL ? 'rtl' : 'ltr'}`}>
                <div className="flex items-center gap-2.5">


                    <div className="flex items-center justify-center h-8 w-8 sm:h-9 sm:w-9 xl:h-10 xl:w-10 rounded-xl bg-teal-500/20 border border-teal-400/30">
                        <Heart className="h-4 w-4 sm:h-5 sm:w-5 xl:h-6 xl:w-6 text-teal-300" />
                    </div>
                    <span className="text-lg sm:text-xl xl:text-2xl font-bold text-white tracking-tight">NazaCare</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <LanguageSwitcher />
                    {user ? (
                        <Link
                            to="/diagnosis"
                            className="inline-flex items-center gap-1.5 bg-teal-500 hover:bg-teal-400 text-white font-semibold text-xs sm:text-sm xl:text-base py-1.5 sm:py-2 px-3 sm:px-4 xl:px-6 rounded-full shadow-lg transition-all duration-200 hover:scale-105 whitespace-nowrap"
                        >
                            {isRTL ? 'شخص الآن' : 'Start Diagnosis'}
                            {isRTL ? <ArrowRight className="h-4 w-4 rotate-180" /> : <ArrowRight className="h-4 w-4" />}
                        </Link>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="text-xs sm:text-sm xl:text-base font-medium text-teal-200 hover:text-white transition-colors px-1 sm:px-2 whitespace-nowrap"
                            >
                                {t('nav.login')}
                            </Link>
                            <Link
                                to="/register"
                                className="inline-flex items-center gap-1.5 bg-teal-500 hover:bg-teal-400 text-white font-semibold text-xs sm:text-sm xl:text-base py-1.5 sm:py-2 px-3 sm:px-4 xl:px-6 rounded-full shadow-lg transition-all duration-200 hover:scale-105 whitespace-nowrap"
                            >
                                <span className="hidden sm:inline">{t('landing.hero.cta')}</span>
                                <span className="sm:hidden">{t('nav.signup', 'Sign Up')}</span>
                                {isRTL ? <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 rotate-180" /> : <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                            </Link>
                        </>


                    )}
                </div>
            </header>

            {/* ── Main Content ── */}
            <main className="relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-10 xl:gap-16 px-4 sm:px-6 lg:px-12 py-8 sm:py-12 w-full max-w-7xl mx-auto overflow-hidden">

                {/* Left — Hero Copy */}
                <div className="w-full lg:flex-[5] flex flex-col gap-6 lg:gap-8 animate-fade-in text-center lg:text-start px-2 lg:px-0 z-10">
                    {/* Badge */}
                    <div className="flex justify-center lg:justify-start">
                        <span className="inline-flex items-center gap-1.5 bg-teal-500/20 border border-teal-400/30 text-teal-300 text-[11px] sm:text-xs xl:text-sm font-semibold px-3 py-1.5 rounded-full">
                            <Activity className="h-3.5 w-3.5 xl:h-4 xl:w-4" />
                            {isRTL ? 'تقييم صحي مدعوم بالذكاء الاصطناعي' : 'AI-Powered Health Assessment'}
                        </span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-tight tracking-tight">
                        <span className="block">{t('landing.hero.title')}</span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-sm sm:text-base xl:text-xl text-teal-100/80 leading-relaxed max-w-lg mx-auto lg:mx-0">
                        {t('landing.hero.subtitle')}
                    </p>

                    {/* Stats row */}
                    <div className="flex gap-3 sm:gap-4 flex-wrap justify-center lg:justify-start">
                        <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 w-[140px] sm:min-w-[150px] xl:min-w-[160px]">
                            <Bug className="h-5 w-5 sm:h-6 sm:w-6 xl:h-7 xl:w-7 text-orange-400" />
                            <div className="text-start">
                                <p className="text-[10px] sm:text-[11px] xl:text-xs text-slate-400 leading-none mb-1">Dengue &amp; Malaria</p>
                                <p className="text-xs sm:text-sm xl:text-base font-bold text-white">Risk Detection</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 w-[140px] sm:min-w-[150px] xl:min-w-[160px]">
                            <CalendarDays className="h-5 w-5 sm:h-6 sm:w-6 xl:h-7 xl:w-7 text-cyan-400" />
                            <div className="text-start">
                                <p className="text-[10px] sm:text-[11px] xl:text-xs text-slate-400 leading-none mb-1">Instant</p>
                                <p className="text-xs sm:text-sm xl:text-base font-bold text-white">Results</p>
                            </div>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="flex justify-center lg:justify-start pt-2">
                        {user ? (
                            <Link
                                to="/diagnosis"
                                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-teal-500 hover:bg-teal-400 text-white font-bold py-3.5 sm:py-3.5 xl:py-4 px-8 xl:px-10 rounded-full shadow-xl shadow-teal-500/20 transition-all duration-200 hover:scale-105 text-sm sm:text-base xl:text-lg"
                            >
                                {t('landing.hero.cta2', 'Start Diagnosis')}
                                {isRTL ? <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 rotate-180" /> : <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />}
                            </Link>
                        ) : (
                            <Link
                                to="/register"
                                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-teal-500 hover:bg-teal-400 text-white font-bold py-3.5 sm:py-3.5 xl:py-4 px-8 xl:px-10 rounded-full shadow-xl shadow-teal-500/20 transition-all duration-200 hover:scale-105 text-sm sm:text-base xl:text-lg"
                            >
                                {t('landing.hero.cta')}
                                {isRTL ? <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 rotate-180" /> : <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />}
                            </Link>
                        )}
                    </div>
                </div>

                {/* Right — Doctor Image + Feature Cards */}
                <div className="w-full lg:flex-[7] flex flex-col gap-6 lg:gap-8 animate-slide-up z-10 w-full min-w-0">

                    {/* Doctor Hero Image */}
                    <div className="relative w-full overflow-hidden rounded-3xl border border-white/10 justify-start shadow-2xl shadow-teal-900/40 h-44 sm:h-64 lg:h-[240px] xl:h-[280px]">
                        {/* Chart image as background layer */}
                        <img
                            src="/images/dengue_cases_chart_1772662091404.png"
                            alt=""
                            aria-hidden="true"
                            className="absolute inset-0 w-full h-full object-cover opacity-20 blur-sm scale-110"
                        />
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-teal-900/60 to-transparent">
                            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 sm:px-10 lg:px-12 gap-2 w-full lg:w-3/4 pointer-events-none">
                                <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-[10px] sm:text-xs xl:text-sm text-teal-300 font-semibold uppercase tracking-widest w-max mb-0.5 sm:mb-1">
                                    Expert Care
                                </span>
                                <p className="text-lg sm:text-2xl xl:text-3xl font-bold text-white text-center leading-snug w-[65%] sm:w-[50%] lg:w-[65%]">
                                    {isRTL ? 'استشر أطباء معتمدين بعد المعاينة' : 'Consult certified doctors after assessment'}
                                </p>
                            </div>
                        </div>
                        {/* Doctor image — positioned to the right */}
                        <img
                            src="/images/doctor_consultation_1772662178431.png"
                            alt="Medical professional"
                            className="absolute right-0 top-0 h-full w-auto object-cover object-top"
                            style={{ maskImage: 'linear-gradient(to left, black 60%, transparent 100%)' }}
                        />
                        {/* Text overlay */}
                    </div>

                    {/* Feature Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-5 w-full">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 sm:p-5 xl:p-6 flex flex-row sm:flex-col items-start gap-3 sm:gap-4 hover:bg-white/10 hover:border-teal-400/40 transition-all duration-300 hover:shadow-xl hover:shadow-teal-900/40 hover:-translate-y-1.5"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                {/* Glow accent */}
                                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-teal-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 sm:h-10 sm:w-10 xl:h-12 xl:w-12 rounded-xl bg-teal-500/15 border border-teal-400/20 group-hover:bg-teal-500/25 group-hover:scale-110 transition-all duration-300">
                                    {feature.icon}
                                </div>
                                <div className="flex flex-col gap-1 sm:gap-1.5 xl:gap-2">
                                    <h3 className="text-sm sm:text-[13px] lg:text-sm xl:text-base font-bold text-white">
                                        {isRTL ? feature.titleAr : feature.titleEn}
                                    </h3>
                                    <p className="text-[13px] sm:text-[11px] lg:text-xs xl:text-sm text-slate-400 leading-relaxed">
                                        {isRTL ? feature.descAr : feature.descEn}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* ── Footer Strip ── */}
            <footer className="relative z-10 w-full mt-auto flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 lg:px-12 py-4 border-t border-white/10 gap-3 bg-slate-900/30 backdrop-blur-md">
                <p className="text-[11px] sm:text-xs xl:text-sm text-slate-500 order-2 sm:order-1 text-center sm:text-start">
                    © {new Date().getFullYear()} NazaCare. {isRTL ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
                </p>
                <p className="text-[11px] sm:text-xs xl:text-sm text-yellow-200/80 text-center sm:max-w-md order-1 sm:order-2 bg-yellow-500/10 px-3 py-1.5 rounded-full border border-yellow-500/20">
                    {isRTL
                        ? '⚠️ هذا تقييم أولي فقط. استشر طبيبًا للتشخيص الدقيق.'
                        : '⚠️ Preliminary assessment only. Consult a doctor for accurate diagnosis.'}
                </p>
            </footer>
        </div>
    );
}