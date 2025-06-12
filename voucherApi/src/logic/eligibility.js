const fs = require("fs");
const { parse } = require("csv-parse/sync");
const {
  getPageCount,
  isGraspapierMaterial,
  isNewMaterial,
  FINISHING_MAPPING
} = require("./attribute-mappings");

function loadCoupons(csvFilePath) {
  const fileContent = fs.readFileSync(csvFilePath);
  console.log("test")
  console.log(fileContent.toString());
  console.log(csvFilePath)
  return parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  });
}

function findCouponConfig(coupons, code) {
  return coupons.find(c => c.code === code);
}

function isProductEligibleForCoupon(product, config) {
  if (!config) return false;

  console.log("🔍 Starte Produktvalidierung für Gutschein:", config.code);

  for (const [key, value] of Object.entries(config)) {
    console.log(`👉 Prüfe "${key}" mit Wert "${value}"`);

    switch (key) {
      case "code":
        const codeexists = isCodeValid(config.code, value);
        console.log(`   ➤ Der Gutscheincode Existiert: ${codeexists}`)
        if (!codeexists) return false;
        break;
      case "allowedGroups":
        const validGroup = isInValidProductGroup(product, value);
        console.log(`   ➤ Gültige Produktgruppe: ${validGroup}`);
        if (!validGroup) return false;
        break;

      case "minPageCount":
        const hasMinPages = hasMinimumPageCount(product, Number(value));
        console.log(`   ➤ Mindestseitenanzahl erreicht: ${hasMinPages}`);
        if (!hasMinPages) return false;
        break;

      case "allowedFinishing":
          const noFinishing = hasValidAttribute(product, "finishing", value);
          console.log(`   ➤ Finishing Erlaubt : ${noFinishing}`);
          if (!noFinishing) return false;
        
        break;

      case "allowedMaterial":
          const allowedMaterial = hasValidAttribute(product, "material", value);
          console.log(`   ➤ Material ist erlaubt ${allowedMaterial}`);
          if (!allowedMaterial) return false;
        break;

      default:
        console.log(`⚠️  Unbekannte Konfigurationsoption "${key}" ignoriert`);
        break;
    }
  }

  console.log("✅ Produkt ist gültig für Gutschein:", config.code);
  return true;
}


function toBool(str) {
  return String(str).toLowerCase() === "true";
}
function isCodeValid(code,validcode){
  return code === validcode;
}

function isInValidProductGroup(product, allowedGroupsCsv) {
  const allowed = allowedGroupsCsv.split(",").map(s => s.trim());
  // Check if the product group ID matches any allowed groups
  return allowed.includes(product.productGroupId);
}


function hasValidAttribute(product, attributeType, requiredIdsCsv) {
  let foundAttribute = false;
  let allComponentsValid = true;

  // Unterstützung für mehrere erlaubte IDs
  const allowedIds = requiredIdsCsv.split(",").map(s => s.trim());

  for (const component of product.components || []) {
    const attr = component.attributes?.find(attr => attr.type === attributeType);

    if (!attr || !attr.values) continue;

    foundAttribute = true;
    console.log(`   \t Attribut "${attributeType}" gefunden in Komponente ${component.id}`);

    const selected = attr.values.filter(val => val.cpqid === true);
    console.log(`   \t Ausgewählte Werte (cpqid=true):`, selected.map(v => v.id));

    if (selected.length === 0) {
      console.log(`   \tKeine ausgewählten Werte in Komponente ${component.id}`);
      allComponentsValid = false;
      continue;
    }

    if (allowedIds.includes("true")) {
      console.log(`  \t Komponente ${component.id}: Beliebiger Wert erlaubt`);
      continue; // kein weiterer Check nötig
    }

    const hasAnyRequiredValue = selected.some(val => allowedIds.includes(val.id));
    console.log(`   \t Komponente ${component.id}: Einer der erlaubten Werte gefunden? ${hasAnyRequiredValue}`);

    if (!hasAnyRequiredValue) {
      allComponentsValid = false;
    }
  }

  if (!foundAttribute) {
    console.log(` \t   Attribut "${attributeType}" in keiner Komponente gefunden`);
    return false;
  }

  console.log(`    Endergebnis für "${attributeType}": ${allComponentsValid}`);
  return allComponentsValid;
}


// Hilfsfunktion: Gibt detaillierte Informationen über ein Attribut in allen Komponenten zurück
function getAttributeDetails(product, attributeType) {
  const details = {
    found: false,
    components: []
  };

  for (const component of product.components || []) {
    const attr = component.attributes?.find(attr => attr.type === attributeType);
    
    if (attr && attr.values) {
      details.found = true;
      const selected = attr.values.filter(val => val.cpqid === true);
      
      details.components.push({
        componentId: component.id,
        totalValues: attr.values.length,
        selectedValues: selected.map(v => ({ id: v.id, cpqid: v.cpqid })),
        hasSelection: selected.length > 0
      });
    }
  }

  return details;
}

function hasMinimumPageCount(product, min) {
  // Finde das pagecount-Attribut in allen Komponenten
  for (const comp of product.components || []) {
    const pagecountAttr = comp.attributes?.find(attr => attr.type === "pagecount");
    if (!pagecountAttr) continue;

    // Prüfe, ob ein Wert mit cpqid === true existiert
    const cpqValue = pagecountAttr.values.find(v => v.cpqid === true);
    if (!cpqValue) {
      // Kein Wert mit cpqid === true, Fehler oder false zurückgeben
      throw new Error("Kein Wert mit cpqid === true im pagecount-Attribut gefunden.");
      // Alternativ: return false;
    }

    // Wert gefunden, nun prüfen ob id dem min entspricht
    const pageCount = Number(cpqValue.id);
    if (isNaN(pageCount)) {
      throw new Error("Ungültiger pagecount Wert (id ist keine Zahl).");
      // Alternativ: return false;
    }

    return pageCount >= min;
  }

  // Wenn keine Komponente mit pagecount-Attribut gefunden wurde
  throw new Error("Kein pagecount-Attribut in den Komponenten vorhanden.");
  // Alternativ: return false;
}

// Helper function to find attribute in any component
function findAttributeInComponents(product, attributeType) {
  for (const component of product.components || []) {
    const attr = component.attributes?.find(attr => attr.type === attributeType);
    if (attr) return attr;
  }
  return null;
}

// Helper function to find attribute in specific component
function findAttributeInComponent(product, componentId, attributeType) {
  const component = product.components?.find(comp => comp.id === componentId);
  if (!component) return null;
  
  return component.attributes?.find(attr => attr.type === attributeType) || null;
}

module.exports = {
  loadCoupons,
  findCouponConfig,
  isProductEligibleForCoupon,
  // Export helper functions for testing
  hasValidAttribute,
  findAttributeInComponents,
  findAttributeInComponent
};