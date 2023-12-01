import dayjs from "dayjs";

const formatDate = (date, formatType) => {
    let dateObj = dayjs(date);
    let formattedDate = dateObj.format(formatType);
    return formattedDate;
}

const formatTime = (time, formatType) => {
    let parsedTime = dayjs(time, 'HH:mm');
    let formattedTime = parsedTime.format(formatType);
    return formattedTime;
}

const calcTimeByAddingMin = (startTime, duration, formatType) => {
    let parsedTime = dayjs(startTime, 'HH:mm');
    let resultTime = parsedTime.add(duration, 'minute');
    let endTime = resultTime.format(formatType);
    return endTime;
}

export { formatDate, formatTime, calcTimeByAddingMin };


