import http from '~/utils/http'

export const getUserLiveDraft = () => http.get('live_room/drafts')

export const getActivityLiveRoom = ({ seen_ids }) => http.get('live_room/list/activity', {
  seen_ids,
  take: 20
})
