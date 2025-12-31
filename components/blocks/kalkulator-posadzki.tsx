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
        
        // Log errors in development for debugging
        if (process.env.NODE_ENV === 'development') {
            if (!surfaceTypesResult.success) {
                console.warn('Failed to load surface types from Supabase:', surfaceTypesResult.error)
            }
            if (!colorsResult.success) {
                console.warn('Failed to load colors from Supabase:', colorsResult.error)
            }
            if (!servicesResult.success) {
                console.warn('Failed to load services from Supabase:', servicesResult.error)
            }
        }
        
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
