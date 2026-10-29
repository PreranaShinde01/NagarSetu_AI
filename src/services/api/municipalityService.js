import apiClient from '../../api/client';

export const municipalityService = {
  async getMunicipalities() {
    return await apiClient.get('/municipalities');
  },

  async getMunicipalityById(id) {
    return await apiClient.get(`/municipalities/${id}`);
  },
};
