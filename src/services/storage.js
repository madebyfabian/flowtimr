export const STORAGE_KEYS = {
	auth: {
		customIdentifier: 'flowtimr.auth.customIdentifier',
		tokenProviderData: {
			microsoft: 'flowtimr.auth.customIdentifier.tokenProviderData.microsoft'
		}
	}
}


export const get = ( key ) => {
	try {
		return JSON.parse(localStorage.getItem(key))
	} catch (error) {
		return localStorage.getItem(key)
	}
}


export const getAndDelete = ( key ) => {
	let value = get(key)
	localStorage.removeItem(key)
	return value
}


export const set = ( key, value ) => {
	localStorage.setItem(key, JSON.stringify(value))
}


export const setAndGet = ( key, value ) => {
	set(key, value)
	return get(key)
}



export default {
	get,
	getAndDelete,
	set,
	setAndGet
}