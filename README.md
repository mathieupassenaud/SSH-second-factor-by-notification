# SSH second factor by notification

[https://youtu.be/S9G74I0i9Eg](https://youtu.be/S9G74I0i9Eg)

Allows a second factor authentication using notifications in progressive web app.

based on :

- [https://www.youtube.com/watch?v=HlYFW2zaYQM](https://www.youtube.com/watch?v=HlYFW2zaYQM)
- [https://github.com/bradtraversy/node_push_notifications](https://github.com/bradtraversy/node_push_notifications)

## Install
You need node and npm.

Checkout repository in /opt

Create new keys : 

```
web-push generate-vapid-keys
```

Put those keys in index.js and sendNotification.js

Put the public key in client/client.js


Make /opt/node_push_notifications/sendNotification.js executable : 
```
chmod +x /opt/node_push_notifications/sendNotification.js
```

In /etc/pam.d/ssh add : 

```
auth required pam_exec.so debug log=/tmp/pam_exec.log  /opt/node_push_notifications/sendNotification.js
```

## Register

In file index.js, it exposes "client" directory with a simple webapp, including a worker (worker.js) for notifications.

Launch the app : npm start
Then go to "http://localhost:5000?username=yourSSHUser

It will register your notification subscription for this user. No one else can subscribe until you delete the file /etc/ssh-notification/yourSSHUser-subscription.json

After subscription, this app can be stopped.

## Login

After typing your password, PAM will execute sendNotification.js.
First, it generates a UUID.
It sends a notification with the UUID (by getting parameters in /etc/ssh-notification/<user>-subscription.json) and listen for POST on /send
with the given UUID.
After 4 seconds, the process is killed if nothing happens. It returns an exit code at 1, so login is not validated.

## TODO
- Expose subscription behind a proxy with SSL for external subscriptions (with mobile phone)

- Add this concept to Keycloak

