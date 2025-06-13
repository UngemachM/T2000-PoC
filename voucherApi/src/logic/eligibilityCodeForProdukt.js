
function isProductEligibleForCoupon(product, config) {
  if (!config) return false;

  console.log("🔍 Starte Produktvalidierung für Gutschein:", config.code);

  for (const [key, value] of Object.entries(config)) {
    console.log(`👉 Prüfe "${key}" mit Wert "${value}"`);

    switch (key) {
      case "code":
        const codeexists = isCodeValid(config.code, value);
        console.log(`   ➤ Der Gutscheincode Existiert: ${codeexists}`)
        if (!codeexists) { 
        console.log("❌ Produkt ist ungültig für Gutschein:", config.code);
        return false;}
        break;
        break;
      case "allowedGroups":
        const validGroup = isInValidProductGroup(product, value);
        console.log(`   ➤ Gültige Produktgruppe: ${validGroup}`);
        if (!validGroup) { 
        console.log("❌ Produkt ist ungültig für Gutschein:", config.code);
        return false;}
        break;
        break;

      case "minPageCount":
        const hasMinPages = hasMinimumPageCount(product, value);
        console.log(`   ➤ Mindestseitenanzahl erreicht: ${hasMinPages}`);
        if (!hasMinPages){ 
        console.log("❌ Produkt ist ungültig für Gutschein:", config.code);
        return false;}
        break;
        break;

      case "allowedFinishing":
          const noFinishing = hasValidAttribute(product, "finishing", value);
          console.log(`   ➤ Finishing Erlaubt : ${noFinishing}`);
          if (!noFinishing){ 
        console.log("❌ Produkt ist ungültig für Gutschein:", config.code);
        return false;}
        break;

      case "allowedMaterial":
          const allowedMaterial = hasValidAttribute(product, "material", value);
          console.log(`   ➤ Material ist erlaubt ${allowedMaterial}`);
          if (!allowedMaterial) { 
        console.log("❌ Produkt ist ungültig für Gutschein:", config.code);
        return false;}
        break;
        

      default:
        console.log(`⚠️  Unbekannte Konfigurationsoption "${key}" ignoriert`);
        break;
    }
  }

  console.log("✅ Produkt ist gültig für Gutschein:", config.code);
  return true;
}


function isCodeValid(code,validcode){
  return code === validcode;
}

function isInValidProductGroup(product, allowedGroupsCsv) {
  const allowed = allowedGroupsCsv.split(",").map(s => s.trim());

  // Wenn "true" in der Liste ist, ist jede Gruppe gültig
  if (allowed.includes("true")) {
    console.log(`   \t Beliebige Produktgruppe erlaubt (\"true\" ist enthalten).`);
    return true;
  }

  // Normale Prüfung
  const isValid = allowed.includes(product.productGroupId);
  console.log(`   \t Produktgruppe "${product.productGroupId}" erlaubt? ${isValid}`);
  return isValid;
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



function hasMinimumPageCount(product, minPageCount) {
  let foundAttribute = false;
  let allComponentsValid = true;

  for (const component of product.components || []) {
    const attr = component.attributes?.find(attr => attr.type === "pagecount");

    if (!attr || !attr.values) continue;

    foundAttribute = true;
    console.log(`   \t Attribut "pagecount" gefunden in Komponente ${component.id}`);

    const selected = attr.values.filter(val => val.cpqid === true);
    console.log(`   \t Ausgewählte Werte (cpqid=true):`, selected.map(v => v.id));

    if (selected.length === 0) {
      console.log(`   \tKeine ausgewählten Werte in Komponente ${component.id}`);
      allComponentsValid = false;
      continue;
    }

    const selectedValue = selected[0]; // Nur ein Wert darf cpqid === true haben

   

    if (minPageCount === "true") {

      console.log(`   \t Komponente ${component.id}: Belibige Seitenzahl Erlaubt`);
      return true;
    }

    const pageCount = Number(selectedValue.id);
    if (isNaN(pageCount)) {
      console.log(`   \t Komponente ${component.id}: Ungültiger Seitenwert (id = "${selectedValue.id}")`);
      allComponentsValid = false;
      continue;
    }

    const valid = pageCount >= minPageCount;
    console.log(`   \t Komponente ${component.id}: Seitenzahl ${pageCount} >= ${minPageCount}? ${valid}`);

    if (!valid) {
      allComponentsValid = false;
    }
  }

  if (!foundAttribute) {
    console.log(` \t   Attribut "pagecount" in keiner Komponente gefunden`);
    return false;
  }

  console.log(`    Endergebnis für "pagecount": ${allComponentsValid}`);
  return allComponentsValid;
}






module.exports = {
  isProductEligibleForCoupon,
}