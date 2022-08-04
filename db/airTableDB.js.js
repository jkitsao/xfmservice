var Airtable = require('airtable');
var base = new Airtable({ apiKey: '' }).base('');
let data = []

records = () => base('Projects').select({
    // Selecting the first 3 records in playlist:
    maxRecords: 100,
    view: "playlist"
}).eachPage(function page(records, fetchNextPage) {
    // This function (`page`) will get called for each page of records.
    records.forEach(function (record) {
        // console.log('Retrieved', record.get('Name', 'src'));
        let name = record.get('Name')
        let src = record.get('src')
        // console.log({ name, src })
        data.push({ name, src })

    });

    // To fetch the next page of records, call `fetchNextPage`.
    // If there are more records, `page` will get called again.
    // If there are no more records, `done` will get called.
    fetchNextPage();

}, function done(err) {
    if (err) { console.error(err); return false; }
    console.log('done')
    return data
});