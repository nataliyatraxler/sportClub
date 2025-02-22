import axios from 'axios';

const API_CONFIG = {
    baseURL: 'https://your-energy.b.goit.study/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
};

const FILTER_TYPES = ['Body parts', 'Muscles', 'Equipment'];


class YourEnergy {
    constructor() {
        this.api = axios.create(API_CONFIG);

        this.api.interceptors.response.use(
            (response) => response.data,
            (error) => Promise.reject(error),
        );
    }


    handleDefaultError(error) {
        const status = error.status;

        switch (status) {
            case 400:
                return 'Please check your input and try again.';
            case 404:
                return 'This training page took a rest day. Please try again.';
            case 500:
                return 'Our fitness server needs a quick breather. Please try again.';
            default:
                if (error.response) {
                    const { data } = error.response;
                    return (data.message || 'Something unexpected happened');
                }
                else if (error.request) {
                    return (error.request.statusText);
                }
                else {
                    return (`Error: ${error.message}`);
                }
        }
    }


    async getExercises(params = {}) {
        if (!params.page || !params.limit || typeof params.page !== 'number' || typeof params.limit !== 'number') {
            return 'Please specify page and items per page';
        }

        try {
            return await this.api.get('/exercises', { params });
        } catch (error) {
            switch (error.status) {
                case 409:
                    return 'Select a filter to view results';
                case 500:
                    return 'Our fitness server needs a quick breather. Please try again.';
                default:
                    return this.handleDefaultError(error);
            }
        }
    }


    async addRating(id, rate, email, review) {
        const data = { rate, email, review };

        try {
            return await this.api.patch(`/exercises/${id}/rating`, data);
        } catch (error) {
            switch (error.status) {
                case 404:
                    return 'Exercise not found. Try exploring similar ones.';
                case 409:
                    return 'Looks like your email is already part of this exercise community!';
                default:
                    return this.handleDefaultError(error);
            }
        }
    }


    async getExerciseById(id) {
        try {
            return await this.api.get(`/exercises/${id}`);
        } catch (error) {
            switch (error.status) {
                case 404:
                    return 'Exercise not found. Try exploring similar ones.';
                case 409:
                    return 'Looks like your email is already part of this exercise community!';
                default:
                    return this.handleDefaultError(error);
            }
        }
    }


    async getExercisesByFilter(params = {}) {
        if (!params.page || !params.limit || typeof params.page !== 'number' || typeof params.limit !== 'number') {
            return 'Please specify page and items per page';
        }

        if (!FILTER_TYPES.includes(params.filter)) {
            return 'Filter not found. Check out our available categories';
        }

        try {
            return await this.api.get('/filters', { params });
        } catch (error) {
            switch (error.status) {
                case 404:
                    return 'The way to exercises not found. Try exploring similar ones.';
                default:
                    return this.handleDefaultError(error);
            }
        }
    }


    async orderSubscription(email) {
        if (!email) return 'Email is not provided';

        try {
            return await this.api.post('/subscription', { email });
        } catch (error) {
            switch (error.status) {
                case 404:
                    return 'The way to subscription not found. Try exploring similar ones.';
                case 409:
                    return 'Looks like such a subscription is already part of this community!';
                default:
                    return this.handleDefaultError(error);
            }
        }
    }

    async getExercisesByIdList(list) {
        if (!list.length) return 'Please specify list of exercises to get';

        const promises = list.map(async id => await this.getExerciseById(id));
        const results = await Promise.allSettled(promises);

        return results.filter(result => result.status === 'fulfilled')
            .map(result => result.value);
    }


    async getQuote() {

        try {
            return await this.api.get('/quote');
        } catch (error) {
            return this.handleDefaultError(error);
        }
    }
}


const yourEnergy = new YourEnergy();

export default yourEnergy;