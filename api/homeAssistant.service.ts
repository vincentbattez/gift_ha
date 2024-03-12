export const HomeAssistantService = {
  triggerEvent: async (haEvent: string) => {
    const url = "https://domotique.vincentbattez.dev/api/events"

    return $fetch(`${url}/${haEvent}`, {
      method: 'POST',
      headers: {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJhM2U5Y2I5NzNkZTY0MDU5YThmYWUwZjhlNzc5OTVlYSIsImlhdCI6MTcxMDAxMzcyMCwiZXhwIjoyMDI1MzczNzIwfQ.wMBSbWYbdGKuFB7dMJI-sjZEm8rAo0F9aMr0zbhfgB4"
      }
    })
  }
}
