import { NextRequest, NextResponse } from 'next/server';
import {
  createMagazynMaterial,
  deleteMagazynMaterial,
  listMagazynMaterials,
  updateMagazynMaterial,
} from '@/lib/supabase-magazyn-projekty';

export async function GET() {
  const result = await listMagazynMaterials();
  if (!result.success) {
    return NextResponse.json({ error: result.error || 'Błąd pobierania materiałów' }, { status: 500 });
  }
  return NextResponse.json({ success: true, materials: result.data || [] });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await createMagazynMaterial(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Błąd tworzenia materiału' }, { status: 400 });
    }
    return NextResponse.json({ success: true, material: result.data });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Błąd tworzenia materiału' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: 'Brak id materiału' }, { status: 400 });
    }

    const result = await updateMagazynMaterial(body.id, {
      name: body.name,
      unit: body.unit,
      quantity_available: body.quantity_available,
      is_active: body.is_active,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Błąd aktualizacji materiału' }, { status: 400 });
    }

    return NextResponse.json({ success: true, material: result.data });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Błąd aktualizacji materiału' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Brak id materiału' }, { status: 400 });
    }

    const result = await deleteMagazynMaterial(id);
    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Błąd usuwania materiału' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Błąd usuwania materiału' }, { status: 500 });
  }
}
