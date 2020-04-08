console.log("Service Worker Loaded...");

self.addEventListener("push", e => {
  const data = e.data.json();
  if(data.type === "error"){
    self.registration.showNotification(data.title, {
      body: "SSH notificator",
      icon: "https://s24255.pcdn.co/wp-content/uploads/2016/11/ssh.png",
    });
  } else {
    self.registration.showNotification(data.title, {
      body: "SSH notificator",
      icon: "https://s24255.pcdn.co/wp-content/uploads/2016/11/ssh.png",
      actions: [
        {action: data.id, title: 'Open Session'}
      ]
    });
  }
});

self.addEventListener('notificationclick', function(event) {  

  event.notification.close();  

  var url = "http://localhost:5001/send";
  var data = JSON.stringify({"id": event.action});
  const response = fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *client
    body: data // body data type must match "Content-Type" header
  });

}, false);

