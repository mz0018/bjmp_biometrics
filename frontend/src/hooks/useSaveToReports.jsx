const useSaveToReports = () => {

    const saveReport = (log) => {
        console.log(`Save the log to reports ${log.visitor.visitor_id}`)
    }

    return { saveReport }
}

export default useSaveToReports