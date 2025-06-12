// This file contains mappings from attribute value IDs to their actual values
// You'll need to populate these based on your actual data

const PAGE_COUNT_MAPPING = {
  "114818": 4,
  "114820": 6,
  "114822": 8,
  "114824": 10,
  "114826": 12,
  "114828": 14,
  "114830": 16,
  "114832": 18,
  "114834": 20,
  "114836": 22,
  "114838": 24,
  "114840": 26,
  "114842": 28,
  "114844": 30,
  "114846": 32,
  "114848": 34,
  "114850": 36,
  "114852": 38,
  "114854": 40,
  "114856": 42,
  "114858": 44,
  "114860": 46,
  "114862": 48,
  "114864": 50,
  "114866": 52,
  "114868": 54,
  "114870": 56,
  "114872": 58,
  "114874": 60,
  "114876": 62,
  "114878": 64,
  "114880": 66,
  "114882": 68,
  "114884": 70,
  "114886": 72,
  "114888": 74,
  "114890": 76,
  "114892": 78,
  "114894": 80,
  "114896": 82,
  "114898": 84,
  "114900": 86,
  "114902": 88,
  // Add more mappings as needed
};

const MATERIAL_MAPPING = {
  // Cover materials (CO-529984)
  "107019": { name: "Standard Paper", tags: [] },
  "107040": { name: "Premium Paper", tags: [] },
  "107049": { name: "Recycled Paper", tags: ["eco"] },
  "114344": { name: "Graspapier Eco", tags: ["eco", "graspapier"] },
  "114348": { name: "Graspapier Premium", tags: ["premium", "graspapier"] },
  "114354": { name: "Graspapier Standard", tags: ["graspapier"] },
  "598708": { name: "New Eco Material", tags: ["new", "eco"] },
  // Add more material mappings based on your actual data
  
  // Inner page materials (CO-529985)
  "107007": { name: "Standard Inner Paper", tags: [] },
  "107017": { name: "Premium Inner Paper", tags: [] },
  "575090": { name: "New Inner Material 1", tags: ["new"] },
  "575091": { name: "New Inner Material 2", tags: ["new"] },
  "575092": { name: "New Inner Material 3", tags: ["new"] },
  "575093": { name: "New Inner Material 4", tags: ["new"] },
  // Add more mappings as needed
};

const FINISHING_MAPPING = {
  "114169": "No Finishing",
  "114042": "Glossy Coating",
  "114567": "Matte Coating",
  "113978": "UV Coating",
  "157193": "Soft Touch",
  "177146": "Spot UV",
  "177203": "Embossing",
  // Add more finishing options
};

const CHROMATICITY_MAPPING = {
  "106529": "4/4 (Full Color)",
  "113132": "4/1",
  "113134": "4/0",
  "113136": "1/1",
  "113138": "1/0",
  "115668": "2/2",
  // Add more color options
};

module.exports = {
  PAGE_COUNT_MAPPING,
  MATERIAL_MAPPING,
  FINISHING_MAPPING,
  CHROMATICITY_MAPPING,
  
  // Helper functions
  getPageCount: (id) => PAGE_COUNT_MAPPING[id] || 0,
  getMaterial: (id) => MATERIAL_MAPPING[id] || { name: "Unknown", tags: [] },
  getFinishing: (id) => FINISHING_MAPPING[id] || "Unknown",
  getChromaticity: (id) => CHROMATICITY_MAPPING[id] || "Unknown",
  
  // Check if material is Graspapier
  isGraspapierMaterial: (id) => {
    const material = MATERIAL_MAPPING[id];
    return material && material.tags.includes("graspapier");
  },
  
  // Check if material has "new" tag
  isNewMaterial: (id) => {
    const material = MATERIAL_MAPPING[id];
    return material && material.tags.includes("new");
  }
};