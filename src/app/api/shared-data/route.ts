import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/authMiddleware';
import { getSharedDataModel } from '@/lib/database/models/SharedData';

// GET shared data (read-only for free users)
export const GET = requireAuth(async (request: NextRequest, user) => {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const SharedData = await getSharedDataModel();

    const query = category ? { category } : {};
    const data = await SharedData.find(query).sort({ createdAt: -1 }).limit(100);

    return NextResponse.json({
      data: data.map(d => ({
        id: d._id,
        key: d.key,
        value: d.value,
        category: d.category,
        description: d.description,
        createdAt: d.createdAt,
      })),
    });
  } catch (error) {
    console.error('Get shared data error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});
