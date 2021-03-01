export function notify(message: string): void {
    if (!("Notification" in window)) {
        return;
    } else if (Notification.permission === "granted") {
        new Notification(message, {
            icon: "https://trtl.co.in/assets/icons/apple-touch-icon.png",
        });
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                new Notification(message, {
                    icon:
                        "https://trtl.co.in/assets/icons/apple-touch-icon.png",
                });
            }
        });
    }
}
