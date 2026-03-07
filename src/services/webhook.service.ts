import apiClient from '@/libs/axios'

export interface Webhook {
  webhookId: string
  department: string
  webhookUrl: string
  enabled: boolean
  isActive: boolean
  events?: string[]
  headers?: Record<string, string>
  description?: string
  lastTriggered?: string
  createdAt: string
  updatedAt: string
}

export interface CreateWebhookDto {
  department: string
  webhookUrl: string
  events?: string[]
  headers?: Record<string, string>
  description?: string
  enabled?: boolean
}

export interface UpdateWebhookDto extends Partial<CreateWebhookDto> {
  isActive?: boolean
}

export interface TestWebhookResponse {
  message: string
  status: number
  statusText: string
  success: boolean
}

class WebhookService {
  // token arg kept for backward compatibility with existing call sites
  async getWebhooks(_token?: string): Promise<Webhook[]> {
    void _token

    const response = await apiClient.get<Webhook[]>('/webhooks')

    return response.data
  }

  async getWebhookById(_token: string, id: string): Promise<Webhook> {
    void _token

    const response = await apiClient.get<Webhook>(`/webhooks/${id}`)

    return response.data
  }

  async createWebhook(_token: string, data: CreateWebhookDto): Promise<Webhook> {
    void _token

    const response = await apiClient.post<Webhook>('/webhooks', data)

    return response.data
  }

  async updateWebhook(_token: string, id: string, data: UpdateWebhookDto): Promise<Webhook> {
    void _token

    const response = await apiClient.patch<Webhook>(`/webhooks/${id}`, data)

    return response.data
  }

  async deleteWebhook(_token: string, id: string): Promise<void> {
    void _token

    await apiClient.delete(`/webhooks/${id}`)
  }

  async testWebhook(_token: string, id: string, testPayload?: unknown): Promise<TestWebhookResponse> {
    void _token

    const response = await apiClient.post<TestWebhookResponse>(`/webhooks/${id}/test`, { testPayload })

    return response.data
  }
}

export const webhookService = new WebhookService()
