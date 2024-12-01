const Notification = ({ statusMsg }) => {
    if (!statusMsg || !statusMsg.message) {
      return null;
    }
  
    const notificationClass = statusMsg.status === "success" ? "success" : "error";
  
    return (
      <div className={notificationClass}>
        {statusMsg.message}
      </div>
    );
  };
  
  export default Notification;
  