function formatDate(date) {
    const now = new Date();
    const postDate = new Date(date);
    const difference = now - postDate;

    const diffInMins = Math.floor(difference / (1000 * 60));
    const diffInHours = Math.floor(difference / (1000 * 60 * 60));
    const diffInDays = Math.floor(difference / (1000 * 60 * 60 * 24));

    if (diffInMins < 1)
        return "Just now";
    if (diffInHours < 1)
        return diffInMins + " m";
    if (diffInDays < 1)
        return diffInHours + " h";
    const dateParts = postDate.toDateString().split(" ");
    return dateParts[1] + " " + dateParts[2];
}

function adjustPostDate(date) {
    const day = date.toDateString().split(" ").slice(1).join(" ");
    const hour = date.toLocaleTimeString().split(":").slice(0, -1).join(":");
    return `${hour} · ${day}`;
}

export {
    formatDate,
    adjustPostDate
}