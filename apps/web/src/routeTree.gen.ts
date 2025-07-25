/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { Route as rootRouteImport } from './routes/__root'
import { Route as TodosRouteImport } from './routes/todos'
import { Route as PendingApprovalRouteImport } from './routes/pending-approval'
import { Route as LoginRouteImport } from './routes/login'
import { Route as DashboardRouteRouteImport } from './routes/dashboard/route'
import { Route as IndexRouteImport } from './routes/index'
import { Route as DashboardIndexRouteImport } from './routes/dashboard/index'
import { Route as JoinInviteCodeRouteImport } from './routes/join/$inviteCode'
import { Route as DashboardWorkspacesWorkspaceIdRouteRouteImport } from './routes/dashboard/workspaces/$workspaceId/route'
import { Route as DashboardWorkspacesWorkspaceIdIndexRouteImport } from './routes/dashboard/workspaces/$workspaceId/index'
import { Route as DashboardWorkspacesWorkspaceIdSettingsRouteImport } from './routes/dashboard/workspaces/$workspaceId/settings'
import { Route as DashboardWorkspacesWorkspaceIdMembersRouteImport } from './routes/dashboard/workspaces/$workspaceId/members'
import { Route as DashboardWorkspacesWorkspaceIdProjectsProjectIdRouteRouteImport } from './routes/dashboard/workspaces/$workspaceId/projects/$projectId/route'
import { Route as DashboardWorkspacesWorkspaceIdProjectsProjectIdIndexRouteImport } from './routes/dashboard/workspaces/$workspaceId/projects/$projectId/index'
import { Route as DashboardWorkspacesWorkspaceIdProjectsProjectIdSettingsRouteImport } from './routes/dashboard/workspaces/$workspaceId/projects/$projectId/settings'

const TodosRoute = TodosRouteImport.update({
  id: '/todos',
  path: '/todos',
  getParentRoute: () => rootRouteImport,
} as any)
const PendingApprovalRoute = PendingApprovalRouteImport.update({
  id: '/pending-approval',
  path: '/pending-approval',
  getParentRoute: () => rootRouteImport,
} as any)
const LoginRoute = LoginRouteImport.update({
  id: '/login',
  path: '/login',
  getParentRoute: () => rootRouteImport,
} as any)
const DashboardRouteRoute = DashboardRouteRouteImport.update({
  id: '/dashboard',
  path: '/dashboard',
  getParentRoute: () => rootRouteImport,
} as any)
const IndexRoute = IndexRouteImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRouteImport,
} as any)
const DashboardIndexRoute = DashboardIndexRouteImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => DashboardRouteRoute,
} as any)
const JoinInviteCodeRoute = JoinInviteCodeRouteImport.update({
  id: '/join/$inviteCode',
  path: '/join/$inviteCode',
  getParentRoute: () => rootRouteImport,
} as any)
const DashboardWorkspacesWorkspaceIdRouteRoute =
  DashboardWorkspacesWorkspaceIdRouteRouteImport.update({
    id: '/workspaces/$workspaceId',
    path: '/workspaces/$workspaceId',
    getParentRoute: () => DashboardRouteRoute,
  } as any)
const DashboardWorkspacesWorkspaceIdIndexRoute =
  DashboardWorkspacesWorkspaceIdIndexRouteImport.update({
    id: '/',
    path: '/',
    getParentRoute: () => DashboardWorkspacesWorkspaceIdRouteRoute,
  } as any)
const DashboardWorkspacesWorkspaceIdSettingsRoute =
  DashboardWorkspacesWorkspaceIdSettingsRouteImport.update({
    id: '/settings',
    path: '/settings',
    getParentRoute: () => DashboardWorkspacesWorkspaceIdRouteRoute,
  } as any)
const DashboardWorkspacesWorkspaceIdMembersRoute =
  DashboardWorkspacesWorkspaceIdMembersRouteImport.update({
    id: '/members',
    path: '/members',
    getParentRoute: () => DashboardWorkspacesWorkspaceIdRouteRoute,
  } as any)
const DashboardWorkspacesWorkspaceIdProjectsProjectIdRouteRoute =
  DashboardWorkspacesWorkspaceIdProjectsProjectIdRouteRouteImport.update({
    id: '/projects/$projectId',
    path: '/projects/$projectId',
    getParentRoute: () => DashboardWorkspacesWorkspaceIdRouteRoute,
  } as any)
const DashboardWorkspacesWorkspaceIdProjectsProjectIdIndexRoute =
  DashboardWorkspacesWorkspaceIdProjectsProjectIdIndexRouteImport.update({
    id: '/',
    path: '/',
    getParentRoute: () =>
      DashboardWorkspacesWorkspaceIdProjectsProjectIdRouteRoute,
  } as any)
const DashboardWorkspacesWorkspaceIdProjectsProjectIdSettingsRoute =
  DashboardWorkspacesWorkspaceIdProjectsProjectIdSettingsRouteImport.update({
    id: '/settings',
    path: '/settings',
    getParentRoute: () =>
      DashboardWorkspacesWorkspaceIdProjectsProjectIdRouteRoute,
  } as any)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/dashboard': typeof DashboardRouteRouteWithChildren
  '/login': typeof LoginRoute
  '/pending-approval': typeof PendingApprovalRoute
  '/todos': typeof TodosRoute
  '/join/$inviteCode': typeof JoinInviteCodeRoute
  '/dashboard/': typeof DashboardIndexRoute
  '/dashboard/workspaces/$workspaceId': typeof DashboardWorkspacesWorkspaceIdRouteRouteWithChildren
  '/dashboard/workspaces/$workspaceId/members': typeof DashboardWorkspacesWorkspaceIdMembersRoute
  '/dashboard/workspaces/$workspaceId/settings': typeof DashboardWorkspacesWorkspaceIdSettingsRoute
  '/dashboard/workspaces/$workspaceId/': typeof DashboardWorkspacesWorkspaceIdIndexRoute
  '/dashboard/workspaces/$workspaceId/projects/$projectId': typeof DashboardWorkspacesWorkspaceIdProjectsProjectIdRouteRouteWithChildren
  '/dashboard/workspaces/$workspaceId/projects/$projectId/settings': typeof DashboardWorkspacesWorkspaceIdProjectsProjectIdSettingsRoute
  '/dashboard/workspaces/$workspaceId/projects/$projectId/': typeof DashboardWorkspacesWorkspaceIdProjectsProjectIdIndexRoute
}
export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/login': typeof LoginRoute
  '/pending-approval': typeof PendingApprovalRoute
  '/todos': typeof TodosRoute
  '/join/$inviteCode': typeof JoinInviteCodeRoute
  '/dashboard': typeof DashboardIndexRoute
  '/dashboard/workspaces/$workspaceId/members': typeof DashboardWorkspacesWorkspaceIdMembersRoute
  '/dashboard/workspaces/$workspaceId/settings': typeof DashboardWorkspacesWorkspaceIdSettingsRoute
  '/dashboard/workspaces/$workspaceId': typeof DashboardWorkspacesWorkspaceIdIndexRoute
  '/dashboard/workspaces/$workspaceId/projects/$projectId/settings': typeof DashboardWorkspacesWorkspaceIdProjectsProjectIdSettingsRoute
  '/dashboard/workspaces/$workspaceId/projects/$projectId': typeof DashboardWorkspacesWorkspaceIdProjectsProjectIdIndexRoute
}
export interface FileRoutesById {
  __root__: typeof rootRouteImport
  '/': typeof IndexRoute
  '/dashboard': typeof DashboardRouteRouteWithChildren
  '/login': typeof LoginRoute
  '/pending-approval': typeof PendingApprovalRoute
  '/todos': typeof TodosRoute
  '/join/$inviteCode': typeof JoinInviteCodeRoute
  '/dashboard/': typeof DashboardIndexRoute
  '/dashboard/workspaces/$workspaceId': typeof DashboardWorkspacesWorkspaceIdRouteRouteWithChildren
  '/dashboard/workspaces/$workspaceId/members': typeof DashboardWorkspacesWorkspaceIdMembersRoute
  '/dashboard/workspaces/$workspaceId/settings': typeof DashboardWorkspacesWorkspaceIdSettingsRoute
  '/dashboard/workspaces/$workspaceId/': typeof DashboardWorkspacesWorkspaceIdIndexRoute
  '/dashboard/workspaces/$workspaceId/projects/$projectId': typeof DashboardWorkspacesWorkspaceIdProjectsProjectIdRouteRouteWithChildren
  '/dashboard/workspaces/$workspaceId/projects/$projectId/settings': typeof DashboardWorkspacesWorkspaceIdProjectsProjectIdSettingsRoute
  '/dashboard/workspaces/$workspaceId/projects/$projectId/': typeof DashboardWorkspacesWorkspaceIdProjectsProjectIdIndexRoute
}
export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/dashboard'
    | '/login'
    | '/pending-approval'
    | '/todos'
    | '/join/$inviteCode'
    | '/dashboard/'
    | '/dashboard/workspaces/$workspaceId'
    | '/dashboard/workspaces/$workspaceId/members'
    | '/dashboard/workspaces/$workspaceId/settings'
    | '/dashboard/workspaces/$workspaceId/'
    | '/dashboard/workspaces/$workspaceId/projects/$projectId'
    | '/dashboard/workspaces/$workspaceId/projects/$projectId/settings'
    | '/dashboard/workspaces/$workspaceId/projects/$projectId/'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/login'
    | '/pending-approval'
    | '/todos'
    | '/join/$inviteCode'
    | '/dashboard'
    | '/dashboard/workspaces/$workspaceId/members'
    | '/dashboard/workspaces/$workspaceId/settings'
    | '/dashboard/workspaces/$workspaceId'
    | '/dashboard/workspaces/$workspaceId/projects/$projectId/settings'
    | '/dashboard/workspaces/$workspaceId/projects/$projectId'
  id:
    | '__root__'
    | '/'
    | '/dashboard'
    | '/login'
    | '/pending-approval'
    | '/todos'
    | '/join/$inviteCode'
    | '/dashboard/'
    | '/dashboard/workspaces/$workspaceId'
    | '/dashboard/workspaces/$workspaceId/members'
    | '/dashboard/workspaces/$workspaceId/settings'
    | '/dashboard/workspaces/$workspaceId/'
    | '/dashboard/workspaces/$workspaceId/projects/$projectId'
    | '/dashboard/workspaces/$workspaceId/projects/$projectId/settings'
    | '/dashboard/workspaces/$workspaceId/projects/$projectId/'
  fileRoutesById: FileRoutesById
}
export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  DashboardRouteRoute: typeof DashboardRouteRouteWithChildren
  LoginRoute: typeof LoginRoute
  PendingApprovalRoute: typeof PendingApprovalRoute
  TodosRoute: typeof TodosRoute
  JoinInviteCodeRoute: typeof JoinInviteCodeRoute
}

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/todos': {
      id: '/todos'
      path: '/todos'
      fullPath: '/todos'
      preLoaderRoute: typeof TodosRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/pending-approval': {
      id: '/pending-approval'
      path: '/pending-approval'
      fullPath: '/pending-approval'
      preLoaderRoute: typeof PendingApprovalRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/login': {
      id: '/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof LoginRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/dashboard': {
      id: '/dashboard'
      path: '/dashboard'
      fullPath: '/dashboard'
      preLoaderRoute: typeof DashboardRouteRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/dashboard/': {
      id: '/dashboard/'
      path: '/'
      fullPath: '/dashboard/'
      preLoaderRoute: typeof DashboardIndexRouteImport
      parentRoute: typeof DashboardRouteRoute
    }
    '/join/$inviteCode': {
      id: '/join/$inviteCode'
      path: '/join/$inviteCode'
      fullPath: '/join/$inviteCode'
      preLoaderRoute: typeof JoinInviteCodeRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/dashboard/workspaces/$workspaceId': {
      id: '/dashboard/workspaces/$workspaceId'
      path: '/workspaces/$workspaceId'
      fullPath: '/dashboard/workspaces/$workspaceId'
      preLoaderRoute: typeof DashboardWorkspacesWorkspaceIdRouteRouteImport
      parentRoute: typeof DashboardRouteRoute
    }
    '/dashboard/workspaces/$workspaceId/': {
      id: '/dashboard/workspaces/$workspaceId/'
      path: '/'
      fullPath: '/dashboard/workspaces/$workspaceId/'
      preLoaderRoute: typeof DashboardWorkspacesWorkspaceIdIndexRouteImport
      parentRoute: typeof DashboardWorkspacesWorkspaceIdRouteRoute
    }
    '/dashboard/workspaces/$workspaceId/settings': {
      id: '/dashboard/workspaces/$workspaceId/settings'
      path: '/settings'
      fullPath: '/dashboard/workspaces/$workspaceId/settings'
      preLoaderRoute: typeof DashboardWorkspacesWorkspaceIdSettingsRouteImport
      parentRoute: typeof DashboardWorkspacesWorkspaceIdRouteRoute
    }
    '/dashboard/workspaces/$workspaceId/members': {
      id: '/dashboard/workspaces/$workspaceId/members'
      path: '/members'
      fullPath: '/dashboard/workspaces/$workspaceId/members'
      preLoaderRoute: typeof DashboardWorkspacesWorkspaceIdMembersRouteImport
      parentRoute: typeof DashboardWorkspacesWorkspaceIdRouteRoute
    }
    '/dashboard/workspaces/$workspaceId/projects/$projectId': {
      id: '/dashboard/workspaces/$workspaceId/projects/$projectId'
      path: '/projects/$projectId'
      fullPath: '/dashboard/workspaces/$workspaceId/projects/$projectId'
      preLoaderRoute: typeof DashboardWorkspacesWorkspaceIdProjectsProjectIdRouteRouteImport
      parentRoute: typeof DashboardWorkspacesWorkspaceIdRouteRoute
    }
    '/dashboard/workspaces/$workspaceId/projects/$projectId/': {
      id: '/dashboard/workspaces/$workspaceId/projects/$projectId/'
      path: '/'
      fullPath: '/dashboard/workspaces/$workspaceId/projects/$projectId/'
      preLoaderRoute: typeof DashboardWorkspacesWorkspaceIdProjectsProjectIdIndexRouteImport
      parentRoute: typeof DashboardWorkspacesWorkspaceIdProjectsProjectIdRouteRoute
    }
    '/dashboard/workspaces/$workspaceId/projects/$projectId/settings': {
      id: '/dashboard/workspaces/$workspaceId/projects/$projectId/settings'
      path: '/settings'
      fullPath: '/dashboard/workspaces/$workspaceId/projects/$projectId/settings'
      preLoaderRoute: typeof DashboardWorkspacesWorkspaceIdProjectsProjectIdSettingsRouteImport
      parentRoute: typeof DashboardWorkspacesWorkspaceIdProjectsProjectIdRouteRoute
    }
  }
}

interface DashboardWorkspacesWorkspaceIdProjectsProjectIdRouteRouteChildren {
  DashboardWorkspacesWorkspaceIdProjectsProjectIdSettingsRoute: typeof DashboardWorkspacesWorkspaceIdProjectsProjectIdSettingsRoute
  DashboardWorkspacesWorkspaceIdProjectsProjectIdIndexRoute: typeof DashboardWorkspacesWorkspaceIdProjectsProjectIdIndexRoute
}

const DashboardWorkspacesWorkspaceIdProjectsProjectIdRouteRouteChildren: DashboardWorkspacesWorkspaceIdProjectsProjectIdRouteRouteChildren =
  {
    DashboardWorkspacesWorkspaceIdProjectsProjectIdSettingsRoute:
      DashboardWorkspacesWorkspaceIdProjectsProjectIdSettingsRoute,
    DashboardWorkspacesWorkspaceIdProjectsProjectIdIndexRoute:
      DashboardWorkspacesWorkspaceIdProjectsProjectIdIndexRoute,
  }

const DashboardWorkspacesWorkspaceIdProjectsProjectIdRouteRouteWithChildren =
  DashboardWorkspacesWorkspaceIdProjectsProjectIdRouteRoute._addFileChildren(
    DashboardWorkspacesWorkspaceIdProjectsProjectIdRouteRouteChildren,
  )

interface DashboardWorkspacesWorkspaceIdRouteRouteChildren {
  DashboardWorkspacesWorkspaceIdMembersRoute: typeof DashboardWorkspacesWorkspaceIdMembersRoute
  DashboardWorkspacesWorkspaceIdSettingsRoute: typeof DashboardWorkspacesWorkspaceIdSettingsRoute
  DashboardWorkspacesWorkspaceIdIndexRoute: typeof DashboardWorkspacesWorkspaceIdIndexRoute
  DashboardWorkspacesWorkspaceIdProjectsProjectIdRouteRoute: typeof DashboardWorkspacesWorkspaceIdProjectsProjectIdRouteRouteWithChildren
}

const DashboardWorkspacesWorkspaceIdRouteRouteChildren: DashboardWorkspacesWorkspaceIdRouteRouteChildren =
  {
    DashboardWorkspacesWorkspaceIdMembersRoute:
      DashboardWorkspacesWorkspaceIdMembersRoute,
    DashboardWorkspacesWorkspaceIdSettingsRoute:
      DashboardWorkspacesWorkspaceIdSettingsRoute,
    DashboardWorkspacesWorkspaceIdIndexRoute:
      DashboardWorkspacesWorkspaceIdIndexRoute,
    DashboardWorkspacesWorkspaceIdProjectsProjectIdRouteRoute:
      DashboardWorkspacesWorkspaceIdProjectsProjectIdRouteRouteWithChildren,
  }

const DashboardWorkspacesWorkspaceIdRouteRouteWithChildren =
  DashboardWorkspacesWorkspaceIdRouteRoute._addFileChildren(
    DashboardWorkspacesWorkspaceIdRouteRouteChildren,
  )

interface DashboardRouteRouteChildren {
  DashboardIndexRoute: typeof DashboardIndexRoute
  DashboardWorkspacesWorkspaceIdRouteRoute: typeof DashboardWorkspacesWorkspaceIdRouteRouteWithChildren
}

const DashboardRouteRouteChildren: DashboardRouteRouteChildren = {
  DashboardIndexRoute: DashboardIndexRoute,
  DashboardWorkspacesWorkspaceIdRouteRoute:
    DashboardWorkspacesWorkspaceIdRouteRouteWithChildren,
}

const DashboardRouteRouteWithChildren = DashboardRouteRoute._addFileChildren(
  DashboardRouteRouteChildren,
)

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  DashboardRouteRoute: DashboardRouteRouteWithChildren,
  LoginRoute: LoginRoute,
  PendingApprovalRoute: PendingApprovalRoute,
  TodosRoute: TodosRoute,
  JoinInviteCodeRoute: JoinInviteCodeRoute,
}
export const routeTree = rootRouteImport
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()
