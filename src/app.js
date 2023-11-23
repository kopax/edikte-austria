import { JSDOM } from 'jsdom'
import jQuery from 'jquery'
import { startOfDay, subDays, format } from 'date-fns'

const EDIKTE_URL = 'https://edikte.justiz.gv.at/edikte'

const { INCLUDE_ADDRESS_AND_CATEGORY_FILTER } = process.env

const filters = INCLUDE_ADDRESS_AND_CATEGORY_FILTER ? INCLUDE_ADDRESS_AND_CATEGORY_FILTER.split(',') : []

function formatRow(row) {
  return `#${row.id}
    Edit und Datum: ${row.editAndDate}
    Adresse und Kategorie(n): ${row.addressAndCategory}
    Objektbezeichnung: ${row.nameOfTheObject}
`
}

export async function run() {
  try {
    const oneWeekAgo = startOfDay(subDays(new Date(), 7))
    const oneWeekAgoFormatted = format(oneWeekAgo, 'dd-MM-yyyy')
    const URL = `${EDIKTE_URL}/ex/exedi3.nsf/suchedi?SearchView&subf=eex&SearchOrder=4&SearchMax=4999&retfields=&ftquery=&query=%28%5BDATBM%5D%3E%3D${oneWeekAgoFormatted}%29`
    const response = await fetch(URL)
    const html = await response.text()
    const dom = new JSDOM(html)
    const $ = jQuery(dom.window)
    const rows = []
    $('tbody tr').each((index, element) => {
      const id = index + 1
      rows.push({
        id,
        editAndDate: $(element).find('td').eq(1).text(),
        addressAndCategory: $(element).find('td').eq(2).html().replace('<br>', ', '),
        nameOfTheObject: $(element).find('td').eq(3).html(),
      })
    })

    const alerts = filters.map((filter) => rows.filter((row) => row.addressAndCategory.toLowerCase().includes(filter.toLowerCase()))).flat(1)

    const ids = alerts.map(({ id }) => id);
    const filteredAlerts = alerts.filter(({ id }, index) => !ids.includes(id, index + 1));

    console.log(`
Website URL: ${URL}

Alerts:

    ${filteredAlerts.length > 0 ? filteredAlerts.map(formatRow).join('\n    ') : 'NA'}
  
Ignored:

    ${rows.map(formatRow).join('\n    ')}
Disclaimer: 

    - This automatic weekly report is generated. 
    - Read more at https://github.com/kopax/edikte-austria`)
  } catch (error) {
    console.log(`
An error happened, please check manually on ${URL} and report the problem asap:

Error:

    ${error.message}

Stack:

${error.stack}
    `)
  }
}
