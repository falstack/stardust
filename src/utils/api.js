import http from '~/utils/http'

export const getUserLiveDraft = () => http.get('live_room/drafts')
