import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/authMiddleware';
import { getConnectionByPlan } from '@/lib/database/connections';
import { getProjectModel } from '@/lib/database/models/Project';

// GET all projects for authenticated user
export const GET = requireAuth(async (request: NextRequest, user) => {
  try {
    // Free users can't create projects
    if (user.plan === 'free') {
      return NextResponse.json({
        projects: [],
        message: 'Upgrade to Pro or Max plan to create projects',
      });
    }

    const connection = await getConnectionByPlan(user.plan, user.accountName);
    const Project = getProjectModel(connection);

    const projects = await Project.find({ owner: user.email }).sort({ createdAt: -1 });

    return NextResponse.json({
      projects: projects.map(p => ({
        id: p._id,
        name: p.name,
        description: p.description,
        owner: p.owner,
        status: p.status,
        settings: p.settings,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      })),
    });
  } catch (error) {
    console.error('Get projects error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});

// POST create new project
export const POST = requireAuth(async (request: NextRequest, user) => {
  try {
    // Free users can't create projects
    if (user.plan === 'free') {
      return NextResponse.json(
        { error: 'Upgrade to Pro or Max plan to create projects' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, description, settings } = body;

    // Validation
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Project name is required' },
        { status: 400 }
      );
    }

    const connection = await getConnectionByPlan(user.plan, user.accountName);
    const Project = getProjectModel(connection);

    // Check project limits based on plan
    const projectCount = await Project.countDocuments({ owner: user.email });
    const maxProjects = user.plan === 'pro' ? 10 : 100; // Pro: 10, Max: 100

    if (projectCount >= maxProjects) {
      return NextResponse.json(
        { error: `You've reached the maximum number of projects for your ${user.plan} plan` },
        { status: 403 }
      );
    }

    // Create project
    const project = await Project.create({
      name: name.trim(),
      description: description?.trim() || '',
      owner: user.email,
      status: 'active',
      settings: settings || {},
    });

    return NextResponse.json(
      {
        message: 'Project created successfully',
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
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create project error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});
