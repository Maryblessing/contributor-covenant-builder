const readTemplate = async (url) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Error retrieving ${url}: ${response.status}`)
  }
  return await response.text()
}

const initializeTemplate = async (version) => {
  const sourceUrl =  window.location.href.replace("adopt/",`version/${version}/code_of_conduct/code_of_conduct.md`)
  const content = readTemplate(sourceUrl)
  const template = document.createElement('template')
  template.id = 'template'
  template.innerHTML = content
  document.body.appendChild(template)
  return template
}

const populateReporting = (placeholder, content) => {
  const template = document.getElementsByName('template')[0]
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
