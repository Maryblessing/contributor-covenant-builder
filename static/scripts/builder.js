const readTemplate = async (url) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Error retrieving ${url}: ${response.status}`)
  }
  return await response.text()
}

const initializeBuilder = async (version) => {
  const versionPath = version.replace(".", "/")
  const sourceUrl =  window.location.href.replace("adopt/",`version/${versionPath}/code_of_conduct/code_of_conduct.md`)
  const content = await readTemplate(sourceUrl)

  // Preview box
  const preview = document.getElementById('preview')
  if (preview) { preview.innerHTML = content }

  // Immutable cache
  const template = document.getElementById('template')
  if (template) { template.innerHTML = content }

  const reportingField = document.getElementById('reporting')
  if (reportingField) {
    const placeholder = reportingField.dataset.placeholder
    const escaped = placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`^.*${escaped}.*$`, 'm');
    const match = content.match(regex);
    reportingField.value = match
    reportingField.addEventListener("blur", (event) => {
      updateTemplate('reporting')
    });
  }

  const enforcementField = document.getElementById('enforcement')
  if (enforcementField) {
    const placeholder = enforcementField.dataset.placeholder
    const escaped = placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`^.*${escaped}.*$`, 'm');
    const match = content.match(regex);
    enforcementField.value = match
    enforcementField.addEventListener("blur", (event) => {
      updateTemplate('enforcement')
    });
  }

}

const updateTemplate = (elemId) => {
  const template = document.getElementById('template')
  const preview = document.getElementById('preview')
  const field = document.getElementById(elemId)
  if (template && field) {
    const placeholder = field.dataset.placeholder
    const escaped = placeholder.replace(/[.*+\?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`^.*${escaped}.*$`, 'm');
    const content = template.innerHTML
    const replacement = field.value
    const match = content.match(regex);
    const updatedContent = content.replace(match, replacement)
    preview.innerHTML = updatedContent
  }
  return template
}

const revealStep = (elemId) => {
  const steps = document.querySelectorAll('.step');
  const elem = document.getElementById(elemId);
  steps.forEach((step, i) => {
    step.classList.add('hidden');
  });
  elem.classList.remove('hidden');
}
