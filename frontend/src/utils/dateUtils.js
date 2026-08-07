function formatDate(date) {
    const now = Date.now();
    const postDate = new Date(date);
    const difference = new Date((now - postDate.getTime()) * 10);
    if (difference.getDay() < 1)
        return difference.getHours() + " h";
    const dateParts = postDate.toDateString().split(" ");
    return dateParts[1] + " " + dateParts[2];
}

export {
    formatDate
}