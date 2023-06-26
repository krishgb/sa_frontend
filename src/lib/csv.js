export const to_csv = (state = [], download_keys = []) => {
    const data = []
    for(let i = 0; i < state.length; i++) {
        const row = state[i]
        const obj = {}
        for(let key of download_keys){
            obj[key.title] = `${row[key.key] || ''}`
        }
        data.push(obj)
    }

    const header_keys = Object.keys(data[0])
    let csv_str = header_keys.join(',') + '\r\n'
    for(let i = 0; i < data.length; i++) {
        const row = data[i]
        const row_data = []
        for(let key of header_keys){
            row_data.push(row[key])
        }
        csv_str += row_data.join(',') + '\r\n'
    }

    const blob = new Blob([csv_str], {type: 'text/csv'})
    return window.URL.createObjectURL(blob)
}
