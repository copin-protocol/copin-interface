import requester from 'apis'

import { PermissionData } from '../entities/permission'

const SERVICE = 'permissions'

export async function getPermissionsApi() {
  return requester.get(`${SERVICE}/all`).then((res: any) => res.data as PermissionData)
}
