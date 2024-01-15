import parsems from 'parse-ms'

Date.prototype.constructor.format = function (DateInMs = 0, Shorted = false, withDateNow = true) {

    if (Shorted)
        return new Date(DateInMs + Date.now()).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })
  
    const date = withDateNow ? new Date(DateInMs + Date.now()) : new Date(DateInMs)
  
    return Intl.DateTimeFormat('pt-BR', { dateStyle: 'full', timeStyle: 'medium' }).format(date)
  }
  
  Date.prototype.constructor.stringDate = ms => {

    if (!ms || isNaN(ms) || ms <= 0) return '0 segundo'

    const translate = {
        millennia: n => n == 1 ? 'milênio' : 'milênios',
        century: n => n == 1 ? 'século' : 'séculos',
        years: n => n == 1 ? 'ano' : 'anos',
        months: n => n == 1 ? 'mês' : 'mêses',
        days: n => n == 1 ? 'dia' : 'dias',
        hours: n => n == 1 ? 'hora' : 'horas',
        minutes: n => n == 1 ? 'minuto' : 'minutos',
        seconds: n => n == 1 ? 'segundo' : 'segundos'
    }

    const date = { millennia: 0, century: 0, years: 0, months: 0, ...parsems(ms) }

    if (date.days >= 365)
        while (date.days >= 365) {
            date.years++
            date.days -= 365
        }
    if (date.days >= 30)
        while (date.days >= 30) {
            date.months++
            date.days -= 30
        }

    if (date.years >= 1000)
        while (date.years >= 1000) {
            date.millennia++
            date.years -= 1000
        }

    if (date.years >= 100)
        while (date.years >= 365) {
            date.century++
            date.years -= 100
        }

    const timeSequency = ['millennia', 'century', 'years', 'months', 'days', 'hours', 'minutes', 'seconds']
    let result = ''

    for (let time of timeSequency)
        if (date[time] > 0)
            result += `${date[time]} ${translate[time](date[time])} `

    return result?.trim()
}