type ErrorLike = {
  message?: string
  response?: {
    data?: {
      error?: string
    }
  }
}

export const getErrorMessage = (error: unknown, fallback: string) => {
  const err = error as ErrorLike

  return err.response?.data?.error || err.message || fallback
}
