import React, { createContext, useContext, useState } from 'react';
import { DEFAULT_MUNICIPALITIES } from '../config/defaultMunicipalities';

const MunicipalityContext = createContext();

export function MunicipalityProvider({ children }) {
  const [municipalities] = useState(DEFAULT_MUNICIPALITIES);
  const [activeMunicipalityId, setActiveMunicipalityId] = useState(() => {
    return localStorage.getItem('nagarsetu_active_muni') || 'muni-ichalkaranji-demo';
  });

  const activeMunicipality = municipalities.find(m => m.id === activeMunicipalityId) || municipalities.find(m => m.id === 'muni-ichalkaranji-demo') || municipalities[0];

  const switchMunicipality = (muniId) => {
    const exists = municipalities.some(m => m.id === muniId);
    if (exists) {
      setActiveMunicipalityId(muniId);
      localStorage.setItem('nagarsetu_active_muni', muniId);
    }
  };

  return (
    <MunicipalityContext.Provider
      value={{
        municipalities,
        activeMunicipality,
        activeMunicipalityId,
        switchMunicipality,
      }}
    >
      {children}
    </MunicipalityContext.Provider>
  );
}

export function useMunicipality() {
  const context = useContext(MunicipalityContext);
  if (!context) throw new Error('useMunicipality must be used within MunicipalityProvider');
  return context;
}
