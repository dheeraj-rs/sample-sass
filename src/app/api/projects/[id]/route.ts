import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/authMiddleware';
import { getConnectionByPlan } from '@/lib/database/connections';
import { getProjectModel } from '@/lib/database/models/Project';

// GET single project
export const GET = requireAuth(async (request: NextRequest, user) => {
  try {
    if (user.plan === 'free') {
      return NextResponse.json(
        { error: 'Upgrade to Pro or Max plan to access projects' },
        { status: 403 }
      );
    }

    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    const connection = await getConnectionByPlan(user.plan, user.accountName);
    const Project = getProjectModel(connection);

    const project = await Project.findOne({ _id: id, owner: user.email });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      project: {
        id: project._id,
        name: project.name,
        description: project.description,
        owner: project.owner,
        status: project.status,
        settings: project.settings,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      },
    });
  } catch (error) {
    console.error('Get project error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});

// PUT update project
export const PUT = requireAuth(async (request: NextRequest, user) => {
  try {
    if (user.plan === 'free') {
      return NextResponse.json(
        { error: 'Upgrade to Pro or Max plan to update projects' },
        { status: 403 }
      );
    }

    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    const body = await request.json();

    const connection = await getConnectionByPlan(user.plan, user.accountName);
    const Project = getProjectModel(connection);

    const project = await Project.findOneAndUpdate(
      { _id: id, owner: user.email },
      {
        ...(body.name && { name: body.name }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.status && { status: body.status }),
        ...(body.settings && { settings: body.settings }),
      },
      { new: true }
    );

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Project updated successfully',
      project: {
        id: project._id,
        name: project.name,
        description: project.description,
        owner: project.owner,
        status: project.status,
        settings: project.settings,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      },
    });
  } catch (error) {
    console.error('Update project error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});

// DELETE project
export const DELETE = requireAuth(async (request: NextRequest, user) => {
  try {
    if (user.plan === 'free') {
      return NextResponse.json(
        { error: 'Upgrade to Pro or Max plan to delete projects' },
        { status: 403 }
      );
    }

    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    const connection = await getConnectionByPlan(user.plan, user.accountName);
    const Project = getProjectModel(connection);

    const project = await Project.findOneAndDelete({ _id: id, owner: user.email });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Project deleted successfully',
    });
  } catch (error) {
    console.error('Delete project error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});
