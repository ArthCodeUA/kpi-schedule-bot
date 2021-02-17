const RxHR = require('@akanass/rx-http-request').RxHR;
const group = 'іс-92';
const days = {
    1: 'Понедельник',
    2: 'Вторник',
    3: 'Среда',
    4: 'Четверг',
    5: 'Пятница',
    6: 'Суббота'
};

exports.getWeekNumber = () => {
    return RxHR.get('https://api.rozklad.org.ua/v2/weeks');
};

exports.getWeekLessons = (weekNumber) => {
    return RxHR.get(
        encodeURI(`http://api.rozklad.org.ua/v2/groups/${group}/lessons?filter={'lesson_week':${weekNumber}}`)
    );
};

exports.getDayLessons = (weekNumber, dayNumber) => {
    return RxHR.get(
        encodeURI(`https://api.rozklad.org.ua/v2/groups/${group}/lessons?filter={'day_number':${dayNumber},'lesson_week':${weekNumber}}`)
    );
};

exports.printWeek = (ctx, weekInfo) => {
    const prettyWeek = {};
    for (let i of Object.keys(days)) {
        prettyWeek[i] = weekInfo.schedule.filter(lesson => lesson.day_number === i.toString());
    }
    let week = `*Неделя №${weekInfo.week}*\n\n\n`;
    for (let day of Object.keys(prettyWeek)) {
        week += `*${days[day]}*\n\n`;
        for (let pair of prettyWeek[day]) {
            const lesson_type = pair.lesson_type ? `(${pair.lesson_type})` : '';
            week += `*Пара №${pair.lesson_number} ${lesson_type}*: ${pair.lesson_name}, викладач: ${pair.teacher_name}\n`;
        }
        week += `\n`;
    }
    ctx.replyWithMarkdown(week).then(() => console.log('Schedule sent'));
};

exports.printDay = (ctx, dayInfo) => {
    if (dayInfo.schedule) {
        let day = `*Неделя №${dayInfo.week} • ${days[dayInfo.day]}*\n\n`;
        for (let pair of dayInfo.schedule) {
            const lesson_type = pair.lesson_type ? `(${pair.lesson_type})` : '';
            day += `*Пара №${pair.lesson_number} ${lesson_type}*: ${pair.lesson_name}, викладач: ${pair.teacher_name}\n`;
        }
        ctx.replyWithMarkdown(day).then(() => console.log(`${days[dayInfo.day]} schedule sent`));
    } else {
        ctx.replyWithMarkdown('*Пари відсутні 😎*').then(() => console.log('Pairs are absent'));
    }
};
