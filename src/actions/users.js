export const FETCH_USERS = 'FETCH_USERS'
export const ADD_USERS = 'ADD_USERS'
export const REMOVE_USERS = 'REMOVE_USERS'


export const fetchUsers = users => ({ type: FETCH_USERS, users })
export const addUsers = users => ({ type: ADD_USERS, users })
export const removeUsers = users => ({ type: REMOVE_USERS, users })