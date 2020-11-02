const elapser = (time) => {
    console.log(time, time.seconds)
    console.log(Date.now())
    const elapsed = Date.now() - time.seconds * 1000
    console.log(elapsed)
    console.log(elapsed / 86400000) // days
    console.log(elapsed / 3600000) // hours
    console.log(elapsed / 60000) // minutes

    // if time is above a certain point, return Date. 
    if (elapsed > 86400000) {
        const date = new Date(time.seconds * 1000)

        const today = new Date()
        const currentYear = today.getFullYear()
        const dateYear = date.getFullYear()

        if (dateYear !== currentYear) {
            return date.toDateString(4)
        } else {
            return date.toDateString().slice(4, 10)
        }
    } else if (elapsed > 3600000) {
        const hours = elapsed / 3600000
        return `${hours} ago`
    } else {
        const minutes = elapsed / 60000
        return `${minutes} ago`
    }
};

export default elapser;
