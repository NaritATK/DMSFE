import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { apiT } from '@/libs/api-i18n'

// PATCH /api/users/[id] - deprecated in this architecture
export async function PATCH(request: NextRequest) {
  return NextResponse.json(
    {
      error: apiT('notImplemented', request),
      details: apiT('userUpdatesViaRoleAccess', request)
    },
    { status: 501 }
  )
}

// DELETE /api/users/[id] - deprecated in this architecture
export async function DELETE(request: NextRequest) {
  return NextResponse.json(
    {
      error: apiT('notImplemented', request),
      details: apiT('userDeletionViaRoleAccess', request)
    },
    { status: 501 }
  )
}
