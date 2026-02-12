import KalkulatorPosadzkiClient from "./kalkulator-posadzki-client"
import {
    getAllSurfaceTypes,
    getAllColors,
    getAllServices,
    getAllRoomTypes,
    getAllConcreteStates,
    getAllStepConfigs,
} from "@/lib/supabase-calculator"

interface CalculatorData {
    surfaceTypes: any[]
    colors: any[]
    services: any[]
    roomTypes: any[]
    concreteStates: any[]
    stepConfigs: any[]
}

async function getCalculatorConfig(): Promise<CalculatorData> {
    try {
        // Fetch directly from Supabase in server component (no HTTP request needed)
        const [surfaceTypesResult, colorsResult, servicesResult, roomTypesResult, concreteStatesResult, stepConfigsResult] = await Promise.all([
            getAllSurfaceTypes(),
            getAllColors(),
            getAllServices(),
            getAllRoomTypes(),
            getAllConcreteStates(),
            getAllStepConfigs(),
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
            if (!roomTypesResult.success) {
                console.warn('Failed to load room types from Supabase:', roomTypesResult.error)
            }
            if (!concreteStatesResult.success) {
                console.warn('Failed to load concrete states from Supabase:', concreteStatesResult.error)
            }
            if (!stepConfigsResult.success) {
                console.warn('Failed to load step configs from Supabase:', stepConfigsResult.error)
            }
        }
        
        return {
            surfaceTypes: surfaceTypesResult.success ? surfaceTypesResult.data || [] : [],
            colors: colorsResult.success ? colorsResult.data || [] : [],
            services: servicesResult.success ? servicesResult.data || [] : [],
            roomTypes: roomTypesResult.success ? roomTypesResult.data || [] : [],
            concreteStates: concreteStatesResult.success ? concreteStatesResult.data || [] : [],
            stepConfigs: stepConfigsResult.success ? stepConfigsResult.data || [] : [],
        }
    } catch (error) {
        console.error('Error loading calculator config:', error)
        
        // Return empty data structure if fetch fails
        return {
            surfaceTypes: [],
            colors: [],
            services: [],
            roomTypes: [],
            concreteStates: [],
            stepConfigs: [],
        }
    }
}

export default async function KalkulatorPosadzki() {
    const calculatorData = await getCalculatorConfig()
    
    return <KalkulatorPosadzkiClient initialData={calculatorData} />
}
