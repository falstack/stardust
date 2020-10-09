import http from '~/utils/http'

export const getUserLiveDraft = () => http.get('live_room/drafts')

export const getActivityLiveRoom = ({ seen_ids }) => http.get('flow/live/activity', {
  seen_ids,
  take: 20
})

export const getNewestLiveRoom = ({ from, id, since_id }) => http.get('flow/live/newest', {
  id,
  from,
  last_id: since_id,
  take: 20
})
