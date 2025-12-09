import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { payloadService } from '../api/payloadService'
import { useFlowChartStore } from '../stores/flowChartStore'

export function usePayloadQuery() {
  const store = useFlowChartStore()
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['payload'],
    queryFn: async () => {
      store.setLoading(true)
      try {
        const result = await payloadService.fetchPayload()
        store.setPayloadData(result)
        return result
      } finally {
        store.setLoading(false)
      }
    },
  })

  const mutation = useMutation({
    mutationFn: payloadService.updatePayload,
    onSuccess: (data) => {
      queryClient.setQueryData(['payload'], data)
      store.setPayloadData(data)
    },
  })

  return {
    data,
    isLoading,
    error,
    mutation,
  }
}

