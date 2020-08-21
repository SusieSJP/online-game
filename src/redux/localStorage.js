export const loadSavedData = () => {
  const data = localStorage.getItem('state');
  const now = new Date();

  if (!data || JSON.parse(data).expiry < now.getTime()) {
    return {rooms: {}, users: {}}
  }
  return JSON.parse(data).state;
}

export const saveData = (state, ttl) => {
  const now = new Date();
  const serializedData = JSON.stringify({state: state, expiry: now.getTime() + ttl});
  localStorage.setItem('state', serializedData);
}
