import requester from 'apis'

import { TraderLabelData, TraderNoteData } from 'entities/trader'
import { ProtocolEnum } from 'utils/config/enums'

const SERVICE = 'trader-notes'

// Types for trader notes

export interface CreateTraderNotePayload {
  account: string
  protocol: ProtocolEnum
  note: string
}

export interface UpdateTraderNotePayload {
  note: string
}

export interface CreateTraderLabelPayload {
  account: string
  protocol: ProtocolEnum
  labels?: string[]
  goodMarkets?: string[]
  badMarkets?: string[]
}

export interface UpdateTraderLabelPayload {
  labels: string[]
}

export interface GetTraderNotesParams {
  account?: string
  protocol?: ProtocolEnum
  limit?: number
  offset?: number
}

// Create trader note
export async function createTraderNoteApi(payload: CreateTraderNotePayload): Promise<TraderNoteData> {
  return requester.post(`${SERVICE}/`, payload).then((res: any) => res.data?.data as TraderNoteData)
}

// Update trader note
export async function updateTraderNoteApi(id: string, payload: UpdateTraderNotePayload): Promise<TraderNoteData> {
  return requester.put(`${SERVICE}/${id}`, payload).then((res: any) => res.data?.data as TraderNoteData)
}

// Delete trader note
export async function deleteTraderNoteApi(id: string): Promise<void> {
  return requester.delete(`${SERVICE}/${id}`).then((res: any) => res.data)
}

// Create trader label
export async function createTraderLabelApi(payload: CreateTraderLabelPayload): Promise<TraderLabelData> {
  return requester.post(`${SERVICE}/label`, payload).then((res: any) => res.data?.data as TraderLabelData)
}

// Get trader note list and get trader label. If isLabel = true => get trader label, default get trader note
export async function getTraderNotesApi(params: GetTraderNotesParams): Promise<TraderNoteData[]> {
  return requester.get(`${SERVICE}/list`, { params: { ...params, isLabel: false } }).then((res: any) => res.data)
}

// Get trader note list and get trader label. If isLabel = true => get trader label, default get trader note
export async function getTraderLabelsApi(params: GetTraderNotesParams): Promise<TraderLabelData[]> {
  return requester.get(`${SERVICE}/list`, { params: { ...params, isLabel: true } }).then((res: any) => res.data)
}

export async function getAllNoteLabelsApi(): Promise<string[]> {
  return requester.get(`${SERVICE}/label/all`).then((res: any) => res.data)
}

export async function getTraderNoteCountApi(params: { account: string; protocol: ProtocolEnum }): Promise<number> {
  return requester.get(`${SERVICE}/count`, { params }).then((res: any) => res.data)
}
