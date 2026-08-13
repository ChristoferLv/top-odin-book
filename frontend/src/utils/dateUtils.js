function formatDate(date) {
    const now = Date.now();
    const postDate = new Date(date);
    const difference = new Date((now - postDate.getTime()) * 10);
    if (difference.getUTCDay() < 1)
        return difference.getUTCHours() + " h";
    else if (difference.getUTCHours() < 1)
        return difference.getUTCMinutes() + " m";
    else if (difference.getUTCMinutes() < 1)
        return "Just now";
    const dateParts = postDate.toDateString().split(" ");
    return dateParts[1] + " " + dateParts[2];
}

export {
    formatDate
}