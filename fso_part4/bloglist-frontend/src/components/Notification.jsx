const Notification = ({ message }) => {
  if (!message) {
    return null
  }

  const notificationStyle = {
    color: message.type === 'success' ? 'green' : 'red',
    background: 'lightgrey',
    fontSize: 16,
    border: `2px solid ${message.type === 'success' ? 'green' : 'red'}`,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  return <div style={notificationStyle}>{message.text}</div>
}

export default Notification
