import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Award, ClipboardCheck, CheckCircle2 } from "lucide-react";

const certificates = [
    {
        icon: ShieldCheck,
        name: "HACCP",
        fullName: "Hazard Analysis and Critical Control Points",
        description:
            "System zarządzania bezpieczeństwem żywności wymagany w każdym zakładzie produkcji i przetwarzania żywności w UE. Nasze posadzki bezszwowe eliminują CCP (Krytyczne Punkty Kontroli) związane z podłogami.",
        color: "bg-blue-50 border-blue-200",
        iconColor: "text-blue-600",
        badgeClass: "bg-blue-100 text-blue-700",
    },
    {
        icon: Award,
        name: "ISO 22000",
        fullName: "Food Safety Management Systems",
        description:
            "Międzynarodowa norma systemów zarządzania bezpieczeństwem żywności. Stosowane przez nas materiały spełniają wymagania stawiane infrastrukturze produkcyjnej w ramach tej normy.",
        color: "bg-green-50 border-green-200",
        iconColor: "text-green-600",
        badgeClass: "bg-green-100 text-green-700",
    },
    {
        icon: ClipboardCheck,
        name: "Atest PZH",
        fullName: "Państwowy Zakład Higieny",
        description:
            "Polska certyfikacja higieniczna dopuszczająca materiały do stosowania w obiektach przemysłu spożywczego. Wymagana przez Sanepid oraz audyty BRC i IFS Food. Dostarczamy pełną dokumentację.",
        color: "bg-orange-50 border-orange-200",
        iconColor: "text-orange-600",
        badgeClass: "bg-orange-100 text-orange-700",
    },
    {
        icon: CheckCircle2,
        name: "BRC / IFS Food",
        fullName: "Global Standards for Food Safety",
        description:
            "Standardy audytowe stosowane przez globalnych detalistów (BRC) i sieci handlowe (IFS Food). Posadzki żywiczne spełniają wymagania dla podłóg w strefach wysokiego ryzyka, w tym wymagania antypoślizgowe R11/R12.",
        color: "bg-purple-50 border-purple-200",
        iconColor: "text-purple-600",
        badgeClass: "bg-purple-100 text-purple-700",
    },
];

const sectors = [
    "Kuchnie przemysłowe i restauracyjne",
    "Zakłady przetwórstwa mięsnego",
    "Piekarnie i cukiernie produkcyjne",
    "Mleczarnie i serowarnie",
    "Browary i rozlewnie",
    "Zakłady przetwórstwa rybnego",
    "Produkcja napojów i soków",
    "Chłodnie i mroźnie",
    "Laboratoria i pomieszczenia sterylne",
    "Szpitale i gabinety medyczne",
];

export default function CertificatesSection() {
    return (
        <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
                {/* Nagłówek */}
                <div className="flex flex-col items-center space-y-4 text-center mb-12">
                    <Badge variant="outline">Certyfikaty</Badge>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl max-w-3xl">
                        Posadzki certyfikowane dla branży spożywczej
                    </h2>
                    <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                        Dostarczamy pełną dokumentację wymaganą przez inspekcję sanitarną, audyty jakościowe i normy bezpieczeństwa żywności — abyś mógł przejść każdy audyt bez stresu.
                    </p>
                </div>

                {/* Karty certyfikatów */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                    {certificates.map((cert, index) => (
                        <div
                            key={index}
                            className={`flex flex-col gap-4 p-6 rounded-xl border-2 ${cert.color}`}
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-full bg-white shadow-sm shrink-0">
                                    <cert.icon className={`w-6 h-6 ${cert.iconColor}`} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="text-xl font-bold">{cert.name}</h3>
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cert.badgeClass}`}>
                                            {cert.fullName}
                                        </span>
                                    </div>
                                    <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                        {cert.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sektory */}
                <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
                    <div className="flex flex-col items-center text-center mb-8">
                        <h3 className="text-2xl font-bold tracking-tighter mb-3">
                            Dla jakich obiektów wykonujemy posadzki?
                        </h3>
                        <p className="text-gray-500 max-w-xl">
                            Realizujemy projekty w całej Polsce dla obiektów z branży spożywczej, gastronomicznej i medycznej
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl mx-auto">
                        {sectors.map((sector, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-2 bg-white rounded-lg px-4 py-3 shadow-sm"
                            >
                                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                                <span className="text-sm font-medium">{sector}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
