import { type NextRequest, NextResponse } from "next/server"
import {
  getAllSurfaceTypes,
  getAllColors,
  getAllServices,
  getAllRoomTypes,
  getAllConcreteStates,
  updateSurfaceType,
  updateColor,
  updateService,
  updateRoomType,
  updateConcreteState,
  createSurfaceType,
  createColor,
  createService,
  createRoomType,
  createConcreteState,
} from "@/lib/supabase-calculator"

// GET - Fetch all calculator settings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")

    if (type === "surface-types") {
      const result = await getAllSurfaceTypes()
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 500 })
      }
      return NextResponse.json({ data: result.data })
    }

    if (type === "colors") {
      const result = await getAllColors()
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 500 })
      }
      return NextResponse.json({ data: result.data })
    }

    if (type === "services") {
      const result = await getAllServices()
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 500 })
      }
      return NextResponse.json({ data: result.data })
    }

    if (type === "room-types") {
      const result = await getAllRoomTypes()
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 500 })
      }
      return NextResponse.json({ data: result.data })
    }

    if (type === "concrete-states") {
      const result = await getAllConcreteStates()
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 500 })
      }
      return NextResponse.json({ data: result.data })
    }

    // Get all settings
    const [surfaceTypes, colors, services, roomTypes, concreteStates] = await Promise.all([
      getAllSurfaceTypes(),
      getAllColors(),
      getAllServices(),
      getAllRoomTypes(),
      getAllConcreteStates(),
    ])

    return NextResponse.json({
      surfaceTypes: surfaceTypes.data || [],
      colors: colors.data || [],
      services: services.data || [],
      roomTypes: roomTypes.data || [],
      concreteStates: concreteStates.data || [],
    })
  } catch (error) {
    console.error("Error fetching calculator settings:", error)
    return NextResponse.json({ error: "Failed to fetch calculator settings" }, { status: 500 })
  }
}

// PUT - Update calculator settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, id, updates } = body

    if (!type || !id || !updates) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    let result
    switch (type) {
      case "surface-type":
        result = await updateSurfaceType(id, updates)
        break
      case "color":
        result = await updateColor(id, updates)
        break
      case "service":
        result = await updateService(id, updates)
        break
      case "room-type":
        result = await updateRoomType(id, updates)
        break
      case "concrete-state":
        result = await updateConcreteState(id, updates)
        break
      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 })
    }

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: result.data })
  } catch (error) {
    console.error("Error updating calculator settings:", error)
    return NextResponse.json({ error: "Failed to update calculator settings" }, { status: 500 })
  }
}

// POST - Create new calculator settings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, data } = body

    if (!type || !data) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    let result
    switch (type) {
      case "surface-type":
        result = await createSurfaceType(data)
        break
      case "color":
        result = await createColor(data)
        break
      case "service":
        result = await createService(data)
        break
      case "room-type":
        result = await createRoomType(data)
        break
      case "concrete-state":
        result = await createConcreteState(data)
        break
      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 })
    }

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: result.data })
  } catch (error) {
    console.error("Error creating calculator settings:", error)
    return NextResponse.json({ error: "Failed to create calculator settings" }, { status: 500 })
  }
}
