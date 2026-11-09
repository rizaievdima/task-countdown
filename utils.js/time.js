export function getNextMinuteCurrentTime() {
    var d = new Date();
    var millisecondssince1970 = d.getTime();
    var newMillisec = millisecondssince1970 + (1000 * 60);

    var newDate = new Date(newMillisec);

    return newDate;
}