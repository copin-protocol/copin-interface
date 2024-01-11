import { DataTypeEnum, UserActionEnum } from 'utils/config/enums'

export interface UserLogData {
  id: string
  userId: string
  username: string
  action: UserActionEnum
  dataType: DataTypeEnum
  oldData: Record<string, any>
  newData: Record<string, any>
  changeFields: string[]
  label: string
  isSuccess: boolean
  errorMsg?: string
  createdAt: string
  updatedAt: string
}
