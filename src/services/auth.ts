'use client'

import axiosInstance from "./axios"

interface ChangePasswordPayload {
  currentPassword: string
  newPassword: string
}

interface ChangePasswordResponse {
  message: string
}

export const changePassword = async (payload: ChangePasswordPayload) => {
  return await axiosInstance.post<ChangePasswordPayload, ChangePasswordResponse>(
    `/admin/auth/change-password`,
    payload
  )
}

