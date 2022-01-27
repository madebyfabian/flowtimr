const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
	'Content-Type': 'application/json'
}


module.exports = ({ data = null, error = null, statusCode = 200 }) => {
	try {
		error = JSON.parse(error)
	} catch (error) {}

	if (statusCode !== 200 && error === null)
		error = true

	return {
		statusCode,
		headers,
		body: JSON.stringify({ data, error })
	}
}