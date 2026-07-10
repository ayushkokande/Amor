import client, { withUid } from "./client";

export function fetchGroup(uid) {
  return client.get("/getGroup", withUid(uid));
}

export function fetchGroupStatus(groupId, uid) {
  return client.get(`/groups/${groupId}/status`, withUid(uid));
}

export function runMatching(group, uid) {
  return client.post("/algo", { group }, withUid(uid));
}

export function fetchRoomMessages(roomId) {
  return client.get(`/rooms/${roomId}`);
}
