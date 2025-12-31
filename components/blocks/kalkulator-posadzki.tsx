import KalkulatorPosadzkiClient from "./kalkulator-posadzki-client"
import { getAllSurfaceTypes, getAllColors, getAllServices } from "@/lib/supabase-calculator"

interface CalculatorData {
    surfaceTypes: any[]
    colors: any[]
    services: any[]
}

async function getCalculatorConfig(): Promise<CalculatorData> {
    try {
        // Fetch directly from Supabase in server component (no HTTP request needed)
        const [surfaceTypesResult, colorsResult, servicesResult] = await Promise.all([
            getAllSurfaceTypes(),
            getAllColors(),
            getAllServices()
        ])
        
        return {
            surfaceTypes: surfaceTypesResult.success ? surfaceTypesResult.data || [] : [],
            colors: colorsResult.success ? colorsResult.data || [] : [],
            services: servicesResult.success ? servicesResult.data || [] : []
        }
    } catch (error) {
        console.error('Error loading calculator config:', error)
        
        // Return empty data structure if fetch fails
        return {
            surfaceTypes: [],
            colors: [],
            services: []
        }
    }
}

export default async function KalkulatorPosadzki() {
    const calculatorData = await getCalculatorConfig()
    
    return <KalkulatorPosadzkiClient initialData={calculatorData} />
}
