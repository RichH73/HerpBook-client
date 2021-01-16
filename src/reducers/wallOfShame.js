const wallOfShameInitialState = {
	newReports: [],
	report: {
		id: '',
	},
	business_name: '',
	business_email: '',
	business_owner: '',
	business_phone: '',
	business_website: '',
	incident_description: '',
	reportImages: [],
	sendReportImages: [],
	newComment: '',
};

const fileShameReportInitialState = {
	reportType: '',
	business_name: '',
	business_website: '',
	business_email: '',
	business_phone: '',
	individual_name: '',
	individual_website: '',
	individual_email: '',
	individual_phone: '',
	faceBook: '',
	incident_description: '',
	date: String,
	creatorId: String,
};

export const wallOfShame = (state = wallOfShameInitialState, data) => {
	switch (data.type) {
		case 'SHAMES':
			return {
				...state,
				newReports: data.shames, //[ ...state.newReports, ...data.shames ]
			};
		case 'report_data':
			return {
				...state,
				report: data.reportData,
			};
		case 'FILE_REPORT':
			return {
				...state,
				[data.key]: data.value,
			};

		case 'SHAME_COMMENT':
			return {
				...state,
				newComment: data.data,
			};
		case 'REPORT_IMAGES':
			return {
				...state,
				reportImages: [...state.reportImages, data.viewImages],
				sendReportImages: [...state.sendReportImages, data.saveImages],
			};
		case 'pushComment':
			const newReports = state.newReports.map((report) => {
				if (report._id === data.data.reportId) {
					report.shameComments.unshift(data.data);
				}
				return report;
			});
			return {
				//...state
				newReports,
			};
		default:
			return state;
	}
};

export const fileShameReport = (state = fileShameReportInitialState, data) => {
	switch (data.type) {
		case 'new_report_data':
			return {
				...state,
				[data.key]: data.value,
			};
		case 'INCIDENT_DESCRIPTION':
			return {
				...state,
				incident_description: data.data,
			};
		case 'Clear_Shame_Text':
			return state;
		case 'clear_new_shame_report':
			return fileShameReportInitialState;
		default:
			return state;
	}
};
