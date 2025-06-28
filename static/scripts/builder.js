const readTemplate = async (url) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Error retrieving ${url}: ${response.status}`)
  }
  return await response.text()
}

const initializeTemplate = async (version) => {
  const versionPath = version.replace(".", "/")
  const sourceUrl =  window.location.href.replace("adopt/",`version/${versionPath}/code_of_conduct/code_of_conduct.md`)
  const content = readTemplate(sourceUrl)
  const template = document.createElement('template')
  const preview = document.getElementById('preview')
  template.id = 'template'
  template.innerHTML = content
  document.body.appendChild(template)
  preview.innerHTML = await content
  return template
}

const initializeReportingField = (placeholder) => {
  const template = document.getElementById('template')
  const contents = template.innerHTML
  const escaped = placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`^.*\\[${escaped}\\].*$`, 'm');
  const reportingParagraph = contents.match(regex);
  const reportingField = document.getElementById('reporting')
  const reportText = reportingField.value
  reportingField.value = reportingParagraph.replace(placeholder, reportText)
}

const updateTemplate = (placeholder, content) => {
  const template = document.getElementById('template')
  const contents = template.innerHTML
  const updatedContent = contents.replace(placeholder, content)
  template.innerHTML = updatedContent
  return template
}

/**
 * revealStep toggles visibility for the specified step element.
 * @param {string} elemId ID of the container to make visible.
 */
const revealStep = (elemId) => {
  const steps = document.querySelectorAll('.step');
  const elem = document.getElementById(elemId);
  steps.forEach((step, i) => {
    step.classList.add('hidden');
  });
  elem.classList.remove('hidden');
}
