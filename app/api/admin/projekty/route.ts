import { NextRequest, NextResponse } from 'next/server';
import { addProjectMaterialUsage, listProjectMaterialUsage } from '@/lib/supabase-magazyn-projekty';

export async function GET() {
  const result = await listProjectMaterialUsage();
  if (!result.success) {
    return NextResponse.json({ error: result.error || 'Błąd pobierania wpisów' }, { status: 500 });
  }
  return NextResponse.json({ success: true, usage: result.data || [] });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.project_name || !body.material_id || !body.quantity_used) {
      return NextResponse.json(
        { error: 'Wymagane pola: project_name, material_id, quantity_used' },
        { status: 400 }
      );
    }

    const result = await addProjectMaterialUsage({
      project_name: body.project_name,
      material_id: body.material_id,
      quantity_used: Number(body.quantity_used),
      usage_date: body.usage_date,
      notes: body.notes,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Błąd zapisu zużycia' }, { status: 400 });
    }

    return NextResponse.json({ success: true, usageId: result.usageId });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Błąd zapisu zużycia' }, { status: 500 });
  }
}
