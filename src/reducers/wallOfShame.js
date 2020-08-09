const { get, isEqual } = require('lodash')
const initialState = {
    newReports: [],
    business_name: '',
    business_email: '',
    business_owner: '',
    business_phone: '',
    business_website: '',
    incident_description: '',
    reportImages: [],
    sendReportImages: [],
    newComment: ''  
};

const wallOfShame = (state = initialState, data) => {
    switch(data.type) {
        case 'SHAMES':
        return {
            ...state,
            newReports: data.shames //[ ...state.newReports, ...data.shames ]
        }
        case 'FILE_REPORT':
        return {
            ...state,
            [data.key]: data.value
        }
        case 'INCIDENT_DESCRIPTION':
        return {
            ...state,
            incident_description: data.data
        }
        case 'REPORT_IMAGES':            
        return {
            ...state,
            reportImages: [ ...state.reportImages, data.viewImages ],
            sendReportImages: [ ...state.sendReportImages, data.saveImages]
        }
        case 'pushComment':
            const newReports = state.newReports.map(report => {
                if (report._id === data.data.reportId) {
                  report.shameComments.push(data.data);
                }
                return report
            })
            return {
                //...state
                newReports
            }
        default:
            return state
    }
}

export default wallOfShame