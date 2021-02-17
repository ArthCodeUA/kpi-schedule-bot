const {mergeMap, map} = require('rxjs/operators');
const schedule = require('./service/schedule');
const math = require('./service/math');
const {Telegraf} = require('telegraf')

const bot = new Telegraf('1250593789:AAFAAraw42qlrfvBqZrQkjxyE_xR8tRjVUM');
bot.start((ctx) => ctx.reply('Привет, друг, напиши /help, чтобы ознакомится с командами.'));
bot.help((ctx) => ctx.reply(
    '/schedule - расписание на текущую неделю\n' +
    '/today - расписание на сегодня\n' +
    '/tomorrow - расписание на завтра\n' +
    '/weeknumber - номер текущей недели\n' +
    '/timetable - расписание пар по времени\n' +
    '/roll - решить мужицкий спор\n' +
    '/coinflip - решить мужицкий спор иначе\n'
));
bot.command('schedule', (ctx => {
    schedule.getWeekNumber().pipe(
        mergeMap(next => schedule.getWeekLessons(JSON.parse(next.body).data).pipe(
            map(res => ({week: JSON.parse(next.body).data, schedule: JSON.parse(res.body).data})
            ))),
    ).subscribe(next => schedule.printWeek(ctx, next));
}));
bot.command('today', (ctx => {
    let today = new Date().getDay();
    schedule.getWeekNumber().pipe(
        mergeMap(next => schedule.getDayLessons(JSON.parse(next.body).data, today).pipe(
            map(res => ({
                    week: JSON.parse(next.body).data,
                    day: today,
                    schedule: JSON.parse(res.body).data
                })
            ))),
    ).subscribe(next => schedule.printDay(ctx, next));
}));
bot.command('tomorrow', (ctx => {
    let tomorrow = new Date();
    tomorrow.setDate(new Date().getDate() + 1);
    schedule.getWeekNumber().pipe(
        mergeMap(next => schedule.getDayLessons(JSON.parse(next.body).data, tomorrow.getDay()).pipe(
            map(res => ({
                    week: JSON.parse(next.body).data,
                    day: tomorrow.getDay(),
                    schedule: JSON.parse(res.body).data
                })
            ))),
    ).subscribe(next => schedule.printDay(ctx, next));
}));
bot.command('weeknumber', (ctx => {
    schedule.getWeekNumber()
        .subscribe(next => ctx.replyWithMarkdown(`*Неделя №${JSON.parse(next.body).data}*`)
            .then(() => console.log('Week number was requested')));
}));
bot.command('timetable', (ctx => {
    ctx.replyWithMarkdown(
        '*1 пара*  08-30 - 10-05\n' +
        '*2 пара*  10-25 - 12-00\n' +
        '*3 пара*  12-20 - 13-55\n' +
        '*4 пара*  14-15 - 15-50\n' +
        '*5 пара*  16-10 - 17-45'
    ).then(() => console.log('Timetable was sent'));
}));
bot.command('roll', (ctx => {
    ctx.reply(
        `${ctx.from.first_name} - ${math.random(0, 100)}`
    ).then(() => console.log('Coin flipped!'));
}));
bot.command('coinflip', (ctx => {
    ctx.reply(
        math.coinflip()
    ).then(() => console.log('Coin flipped!'));
}));
bot.launch().then(() => console.log('Bot launched'));
